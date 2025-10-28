"use client";
import React, {  useMemo } from "react";
import CustomPagination from "../../UI/web/Pagination";
import CustomLoader from "../../UI/web/Loader/CustomLoader";
import { EventListProps } from "@/src/types";
import { useFetchAllEvent } from "@/src/hooks/web/useEvent";
import EventCard from "./EventCard";

export default function EventList({ currentPage, onPageChange }: EventListProps) {
  const itemsPerPage = 3;
  const { data, isLoading, isError } = useFetchAllEvent(currentPage, itemsPerPage);

  const events = useMemo(() => {
    if (!data?.events) return [];
    return data.events.map((event: any) => ({
      ...event,
      date: new Date(event.startTime).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      image: event.images?.[0] || "/assets/events.webp",
    }));
  }, [data]);

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

// Inside your rendering logic:
return (
  <section className="py-12 w-full">
    {events.length === 1 ? (
      <EventCard event={events[0]} large />
    ) : events.length === 2 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {events.map((event) => (
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
          {events.slice(1).map((event, index) => (
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
