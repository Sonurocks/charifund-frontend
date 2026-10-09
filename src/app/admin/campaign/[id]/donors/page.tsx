import Breadcrumb from "@/src/components/Admin/Breadcrumb";
import DonorTable from "@/src/components/Admin/Campaign/Donors/DonorTable";

export const metadata = {
  title: "charifund | Campaign Donors",
};

export default async function DonorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <Breadcrumb lable="Campaign Donors" />
      <section className="mt-5">
        <DonorTable campaignId={id} />
      </section>
    </div>
  );
}
