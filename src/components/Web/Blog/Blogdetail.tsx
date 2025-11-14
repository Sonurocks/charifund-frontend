"use client";
import { bannerBg } from "@/public/assets";
import { useTranslation } from "react-i18next";
import SingleBlogDetails from "@/src/components/Web/Blog/SingleBlogDetails";
import { useParams } from "next/navigation";
import Sidebar from "../../UI/web/sideBar";
import PageBanner from "@/src/helper/PageBanner";
import { useFetchSingleBlog } from "@/src/hooks/web/useBlog";
import CustomLoader from "../../UI/web/Loader/CustomLoader";

export default function Blogdetail() {
  const { t } = useTranslation();

  const { id: Blogid } = useParams() as { id: string };

  const { data, isLoading, isError } = useFetchSingleBlog(Blogid);
  if (isLoading) {
    return <div><CustomLoader /></div>;
  }

  if (isError) {
    return (
      <p className="text-center text-red">
        Failed to fetch blog details.
      </p>
    );
  }
  return (
    <div>
      <PageBanner bgImage={bannerBg} title={t("Blog Details")} />
      <section className="bg-white py-16  text-gray-green flex justify-center items-center w-full">
        <div className="full md:w-11/12 px-3">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <main className="xl:col-span-2 relative">
              <SingleBlogDetails data={data} id={Blogid} />
            </main>
            <aside className="col-span-1 space-y-5">
              <Sidebar pathName="campaigns" as="Recent Post" />
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
