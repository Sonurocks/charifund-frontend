

'use client';

import React, { useState, useMemo, useCallback, useRef } from "react";
import DataTableWrapper from "../../UI/admin/DataTableWrapper";
import CustomInput from "../../UI/admin/CustomInput";
import Dropdown from "../../UI/admin/Dropdown";
import Drawer from "../../UI/admin/Drawer";
import { useDeleteSingleEvent, useFetchAllEvent, useFetchSingleEvent, submitEventForm } from '@/src/hooks/admin/useEvent';
import AnimatedReveal from "@/src/animations/AnimatedReveal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AdminCustomPagination from "../../UI/admin/CustomePagination";
import toast from "react-hot-toast";
import ConfirmModal from "../../UI/admin/ConfirmModal";
import { createEvent, updateEvent } from "@/src/services/admin/eventApi";
import { Event, EventsValue } from "@/src/types/admin/event";
import { EventFormValues } from "@/src/utils/validations/FormValidation";
import { EventSearchOptions } from "../Data/staticData";
import useDebounce from "@/src/hooks/web/useDebounce";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import CustomLoader from "../../UI/web/Loader/CustomLoader";
import Button from "../../UI/web/Buttons/Button";
import { useLanguageToggle } from "@/src/hooks/admin/useLanguageToggle";
import { getEventColumns } from "./EventColumns";
import EventPreview from "./EventPreview";
import EventForm from "./EventForm";

const EventTable = () => {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState<"title" | "location" | "date" | "status">("title");
  const [EventField, setEventField] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<string | null>(null);
  const [mode, setMode] = useState<"add" | "edit" | "view" | "preview-edit">("add");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const[deleteLoading,setDeleteLoading]=useState<boolean>(false);

  const [previewData, setPreviewData] = useState<EventFormValues | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const searchedData = useDebounce(search, 1000);
  const { language, toggleLanguage } = useLanguageToggle();

  const { data: eventData, isLoading } = useFetchAllEvent(currentPage, itemsPerPage, searchedData, searchField);
  const { data: singleEventData, isLoading: isLoadingEvent, refetch } = useFetchSingleEvent(editEvent || undefined);
  const deleteEvent = useDeleteSingleEvent();
  const totalPages = eventData?.totalPages || 1;
  console.log(eventData)
  const lang = language
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; values: EventFormValues }) =>
      updateEvent(data.id, data.values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
  const normalizeEventData = (data: any): EventFormValues => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return {
      title: data.title ?? { en: "", hi: "" },
      description: data.description ?? { en: "", hi: "" },
      summary: data.summary ?? { en: "", hi: "" },
      keyPoints: data.keyPoints ?? { en: [], hi: [] },
      startDate: start,
      startTime: start,
      endDate: end,
      endTime: end,
      location: data.location ?? { en: "", hi: "" },
      images: Array.isArray(data.images) ? data.images.filter(Boolean) : [],
      latitude: data?.latitude ?? null,
      longitude: data?.longitude ?? null,
    };
  };


  const handleEdit = useCallback((e: Event) => {
    setEditEvent(e.id.toString());
    setMode("edit");
    setDrawerOpen(true);
  }, []);

  const handleView = useCallback(async (e: Event) => {
    setEditEvent(e.id.toString());
    setMode("view");
    setDrawerOpen(true);
    setPreviewData(null);
    setShowPreview(false);
    try {
      setTimeout(async () => {
        const { data } = await refetch();
        if (data) {
          setMode("view");
          setPreviewData(normalizeEventData(data));
          setShowPreview(true)
        }
      }, 100);
    } catch (error) {
      console.error("Failed to fetch campaign:", error);
    }
  }, [refetch]);

  const handleDelete = useCallback(
    (e: Event) => {
      if (!e.id) {
        console.error("Cannot delete Campaign: ID is missing.");
        return;
      }
      setSelectedEvent(e);
      setIsOpen(true);
    },
    [deleteEvent]
  );
  const confirmDelete = useCallback(() => {
    if (selectedEvent?.id) {
      setDeleteLoading(true)
      toast.dismiss();
      toast.loading("Deleting Event....")
      deleteEvent.mutate(selectedEvent.id.toString(), {
      onSuccess: () => {
        setDeleteLoading(false)
        setIsOpen(false);
      setSelectedEvent(null);
      },
      onError: () => {
        setDeleteLoading(false)
        setIsOpen(false); 
      },
    });      
    }
  }, [selectedEvent, deleteEvent]);

  const columns = useMemo(
    () =>
      getEventColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onView: handleView,
      }),
    [handleEdit, handleDelete, handleView]
  );

  const paginatedData = useMemo(() => {
    if (!eventData?.events) return [];

    return eventData.events.map((e: any, index: number) => {
      const start = new Date(e.startTime);
      const end = new Date(e.endTime);

      return {
        id: e.id,
        title: e.title,
        description: e.description,
        summary: e.summary,
        location: e.location,
        images: e.images,
        keyPoints: e.keyPoints,
        status: e.status || "Active",
        startTime: start.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', hour12: true }),
        endTime: end.toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', hour12: true }),
        Date: start.toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }),
      };
    });
  }, [eventData]);

  const filteredData = useMemo(() => paginatedData, [paginatedData]);
  const normalizedEventData = useMemo(() => {
    if (!singleEventData) return undefined;


    const stringImages =
      singleEventData.images?.filter((img: any) => typeof img === "string") ?? [];

    return {
      ...singleEventData,
      // existingImages: singleEventData.existingImages ?? stringImages,
      images: singleEventData.images ?? stringImages,
    };
  }, [singleEventData]);


  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <AnimatedReveal direction="left" delay={0.1}>
          <div className="w-fit flex flex-row gap-2">
            <Dropdown
              options={EventSearchOptions}
              value={searchField}
              onChange={(value) => {
                setSearchField(value);
                setSearch('')
                setSelectedDate(null);
                if (value !== "status") {
                  setEventField("");
                }
                setTimeout(() => {
                  searchInputRef.current?.focus();
                }, 0);
              }}
            />
            {searchField === "date" ? (
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => {
                  setSelectedDate(date);
                  setSearch(date ? format(date, "yyyy-MM-dd") : "");
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primaryColor w-full"
              />
            ) : ((searchField === 'status') ? (<>
              <Dropdown
                options={EventsValue}
                value={EventField}
                onChange={(value) => {
                  setEventField(value)
                  setSearch(value)
                }}

              />
            </>) : (
              <CustomInput
                ref={searchInputRef}
                placeholder={`Search by ${searchField}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            ))}

          </div>
        </AnimatedReveal>

        <AnimatedReveal direction="left" delay={0.3}>
          <div className="w-fit">
            <Button
              text="Add Event"
              onClick={() => {
                setDrawerOpen(true);
                setEditEvent(null);
                setMode("add");
              }}
              bgColor="bg-lime-green"
              hoverBg="before:bg-primaryColor"
              textColor="text-white"
              hoverTextColor="group-hover:text-foreground"
              paddingx="px-4"
              paddingy="py-2"
              rounded="rounded-[5px] "
            />
          </div>
        </AnimatedReveal>
      </div>

      {/* Table */}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <CustomLoader />
        </div>
      ) : (
        <DataTableWrapper
          columns={columns}
          data={paginatedData}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end mt-4">
          <AdminCustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <Drawer
          isOpen={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setEditEvent(null);
            setMode("add");
            setPreviewData(null);
          }}
          // &&!previewData
          title={
            mode === "edit"
              ? "Edit Event"
              : mode === "view" || mode === "preview-edit"
                ? "View Event"
                : "Add Event"
          }
          mode={mode}

        >
          {(mode === "view" || mode === "preview-edit") && (
            !previewData || isLoadingEvent ? (

              <div className="flex justify-center py-10">
                <CustomLoader />
              </div>
            ) : (
              <EventPreview
                mode={mode}
                showButton={mode === "preview-edit"}
                data={normalizeEventData(previewData)}
                onBack={() => {
                  setShowPreview(false);
                  setMode(editEvent ? "edit" : "add");
                }}
                createMutation={createMutation}
                updateMutation={updateMutation}
                onSubmit={() => {
                  submitEventForm(
                    { ...previewData!, keyPoints: previewData!.keyPoints },
                    singleCampaignData,
                    createMutation,
                    updateMutation,
                    () => {
                      setPreviewData(null);
                      setShowPreview(false);
                      setDrawerOpen(false);
                    },
                    () => { },
                    () => setDrawerOpen(false)
                  );
                }}
              />
            )
          )}
          {(mode === "add" || mode === "edit") && (
            isLoadingEvent ? (
              <div><CustomLoader /></div>
            ) :
              (
                <EventForm
                  initialData={{
                    ...(normalizedEventData ?? {}),
                    ...(previewData ?? {}),
                    // Ensure both arrays persist
                    images:
                      previewData?.images?.length
                        ? previewData.images
                        : normalizedEventData?.images ?? []
                  }}
                  onClose={() => {
                    setDrawerOpen(false);
                    setPreviewData(null);
                    setShowPreview(false);
                  }}
                  mode={mode}
                  onPreview={(data) => {
                    setPreviewData(data);
                    setShowPreview(true);
                    setMode('preview-edit')
                  }}
                  createMutation={createMutation}
                  updateMutation={updateMutation}
                />
              ))}
        </Drawer>
      )}
      <ConfirmModal
        isOpen={isOpen}
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setIsOpen(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete these record ?"
        buttonText="Delete"
      />
    </div>
  );
};

export default EventTable;

