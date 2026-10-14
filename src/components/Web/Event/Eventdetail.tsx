"use client";

import Image from "next/image";
import { IoLocationSharp, IoCalendarSharp } from "react-icons/io5";
import {
  eventdetail1,
} from "@/public/assets";
import Comments from "../comments/Comments";
import LeaveComment from "../comments/LeaveComment";
import { useFetchSingleEvent } from "@/src/hooks/web/useEvent";
import { useParams } from "next/navigation";
import { EventInterface } from "@/src/types";
import CustomLoader from "../../UI/web/Loader/CustomLoader";
import PageBanner from "@/src/helper/PageBanner";
import Sidebar from "../../UI/web/sideBar";
import { FaRegCheckCircle } from "react-icons/fa";
import { getOptimizedImageUrl } from "@/src/utils/imageStandards";

const EventDetail = () => {
  const eventTid = useParams().id as string;
  const { data: event, isLoading } = useFetchSingleEvent(eventTid) as { data: EventInterface, isLoading: boolean };
  const mapUrl = event?.latitude && event?.longitude
    ? `https://maps.google.com/maps?q=${event.latitude},${event.longitude}&z=15&output=embed`
    : "";
  if (isLoading) return <div className="flex items-center justify-center"><CustomLoader /></div>


  return (
    <>
      <PageBanner
        pageName="Events"
        title="Our Events & Activities" 
        tagline="Making a Difference Together"
        description="We organize meaningful events and community activities to create positive change and support those in need."
        smallIcon="mdi:calendar-heart"
      />

      <section className="bg-white py-16  text-gray-green flex justify-center items-center w-full">

        <div className="full md:w-11/12 px-3">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <main className="xl:col-span-2 relative">

              {isLoading ? <CustomLoader /> : <>
                <div className="relative w-full h-[220px] sm:h-[300px] lg:h-[450px] mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={getOptimizedImageUrl(event?.images?.[0], { width: 1200, quality: "auto", format: "auto" })}
                    alt={event?.title || "Event image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 800px"
                    className="object-cover object-center"
                    priority
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-black mb-6">
                  <span className="flex items-center gap-1">
                    <IoCalendarSharp className="text-yellow-400" />
                    <span>{event?.startTime ? new Date(event.startTime).toLocaleDateString() : "N/A"}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <IoLocationSharp className="text-yellow-400" />
                    {event?.location}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black mb-6 leading-tight font-nunito">
                  {event?.title}
                </h1>

                <p className="text-xl mb-8 font-nunito">
                  {event?.description}
                </p>

                <h2 className="text-3xl font-extrabold text-black mb-4 font-nunito">Summary</h2>
                <p className="mb-8 text-xl font-nunito">
                  {event?.summary}
                </p>

                {/* Key Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black font-bold mb-8">
                  {event?.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2 font-nunito">
                      <FaRegCheckCircle className="text-green-700 text-xl" />
                      {point}
                    </div>
                  ))}
                </div>

                {/* Detail Images */}
                {event?.images && event.images.length > 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {event.images.slice(1).map((img, idx) => (
                      <div key={idx} className={`relative w-full rounded-lg overflow-hidden ${idx === 0 ? 'h-[300px]' : 'h-[220px] sm:h-[300px]'}`}>
                        <Image
                          src={getOptimizedImageUrl(img, { width: 800, quality: "auto", format: "auto" })}
                          alt={`Detail ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 400px"
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Social Media Grid */}
                <div className="flex flex-col gap-6 items-center justify-between mb-8">
                  {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-5 gap-4 w-full">
                    {socialIcons.map((s, i) => (
                      <a
                        key={i}
                        href="#"
                        className={`flex flex-col justify-center items-center rounded-md shadow-md text-white hover:opacity-90 transition-all h-20 sm:h-28 lg:h-32 ${i === 4 ? "col-span-2 sm:col-span-3 md:col-span-3 lg:col-span-1" : ""
                          }`}
                        style={{ backgroundColor: s.bg }}
                      >
                        <s.icon className="text-xl sm:text-2xl lg:text-3xl mb-2" />
                        <span className="text-xs sm:text-sm lg:text-lg font-medium">{s.label}</span>
                      </a>
                    ))}
                  </div> */}

                  {/* Google Maps */}
                  <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[450px] rounded-lg overflow-hidden">
                    {mapUrl && (
                      <iframe
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        allowFullScreen={false}
                        loading="lazy"
                        className="w-full h-full border-0"
                        title="Event Location"
                      ></iframe>
                    )}

                  </div>
                </div>

                {/* Comments */}
                <div className="mt-6 sm:mt-8 md:mt-12">
                  <Comments CommentId={event?.id} />
                </div>

                {/* Leave Comment */}
                <div className="mt-4 sm:mt-6 md:mt-8">
                  <LeaveComment blogId={event?.id} />
                </div>
              </>}

            </main>

            {/* Sidebar */}
            <aside className="col-span-1 space-y-5">
              <Sidebar pathName="events" as="Recent Post" />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

export default EventDetail