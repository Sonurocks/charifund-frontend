"use client";
import React, { useMemo } from "react";
import CustomPagination from "../../UI/web/Pagination";
import CustomLoader from "../../UI/web/Loader/CustomLoader";
import { EventListProps } from "@/src/types";
import { useFetchAllEvent } from "@/src/hooks/web/useEvent";
import EventCard from "./EventCard";
import { ApiEvent } from "@/src/types/web/event";
import EmptyState from "../../UI/web/EmptyState";
import { upcomingEvents } from "@/public/assets";

type FormattedEvent = Pick<ApiEvent, "id" | "title" | "location"> & {
  date: string;
  image: string;
};

export default function EventList({ currentPage, onPageChange, onEmptyChange }: EventListProps) {
  const itemsPerPage = 3;
  const { data, isLoading, isError } = useFetchAllEvent(currentPage, itemsPerPage);

  const events = useMemo<FormattedEvent[]>(() => {
    if (!data?.events) return [];
    return data.events.map((event: ApiEvent) => ({
      id: event.id,
      title: event.title,
      location: event.location,
      date: new Date(event.startTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      image: event.images?.[0] || "/assets/events.webp",
    }));
  }, [data]);

  React.useEffect(() => {
    onEmptyChange?.(events.length === 0);
  }, [events.length, onEmptyChange]);

  const totalPages = data?.totalPages || 1;

  if (isLoading) {
    return (
      <section className="py-12 flex justify-center items-center h-64">
        <CustomLoader />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 bg-white flex justify-center items-center h-64">
        <div className="text-lg text-red">Failed to load Event data</div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className=" flex flex-col items-center justify-center w-full ">
        <EmptyState
          title="No Live Events"
          description="All events have been completed. Stay tuned for upcoming events!"
          imageSrc={upcomingEvents.src}
        />
      </section>
    );
  }

  return (
    <section className="py-12 w-full">
      {events.length === 1 ? (
        <EventCard event={events[0]} large />
      ) : events.length === 2 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {events.map((event: FormattedEvent) => (
            <EventCard key={event.id} event={event} large />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 lg:grid lg:grid-cols-5 w-full">
          {events[0] && (
            <div className="col-span-3 relative w-full h-[250px] sm:h-[350px] lg:h-[700px] overflow-hidden">
              <EventCard event={events[0]} large />
            </div>
          )}
          <div className="col-span-2 flex flex-col gap-6 w-full h-full">
            {events.slice(1).map((event: FormattedEvent, index: number) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && onPageChange && (
        <div className="flex justify-center mt-12">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </section>
  );
}
