"use client";
import React, { useState } from "react";
import FadeUpCard from "@/src/animations/FadeButtomUp";
import CustomLoader from "../../UI/web/Loader/CustomLoader";
import WebCustomPagination from "../../UI/web/Pagination/Paginationlogic";
import BlogCard from "./BlogCard";
import { useFetchAllBlogs } from "@/src/hooks/web/useBlog";
import Sidebar from "../../UI/web/sideBar";
const BlogGrid = () => {
    const PageLimit = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, isError } = useFetchAllBlogs(currentPage, PageLimit);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }
    console.log("blog", data)
    if(isLoading) return <div className="flex items-center justify-center text-center"><CustomLoader/></div>
    return (
        <div className="w-full mx-auto xl:max-w-[1440px]">
            <div className=" mt-0 max-[719px]:mt-20 md:mt-15 lg:mt-10 md:pl-7 md:pr-7 lg:p-10  p-2 sm:p-4 xl:p-23 ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6   ">
                    <div className="col-span-1 md:col-span-2">
                        {isLoading ? <div className="flex items-center justify-center text-center"><CustomLoader /></div> : isError ? <div className="text-center flex items-center justify-center text-red">Failed to fetch blogs.</div> :
                            <>
                                <div className="grid grid-cols-1 lg:grid-cols-2 justify-center gap-6 xl:gap-8">
                                    {data?.blogs?.map((card: any, i: number) => {
                                        return (
                                            <FadeUpCard key={i} delay={i * 0.2}>
                                                <BlogCard key={i} card={card} />
                                            </FadeUpCard>
                                        )
                                    })}
                                </div>
                                <div className="flex justify-center mt-12">
                                    {data?.totalPages > 1 && (
                                        <FadeUpCard delay={0.3}>
                                            <WebCustomPagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePageChange} />
                                        </FadeUpCard>
                                    )}
                                </div>
                            </>
                        }
                    </div>
                    <div className="xl:col-span-1  md:col-span-2 col-span-1 w-full mt-5 md:mt-0  ">
                        <Sidebar pathName="blogs" as="Recent Post" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogGrid;
