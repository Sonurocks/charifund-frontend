import React from 'react'
import { motion, Variants } from "framer-motion";
import { Campaign } from '@/src/types/admin/campaign';
import { useFetchAllCampaigns } from '@/src/hooks/admin/useCampaigns';

function RecentCampaign() {
  const rowVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, type: "spring", stiffness: 80 },
    }),
  };

  const { data } = useFetchAllCampaigns(1, 10) as { data: { campaigns: Campaign[] } };

  console.log(data)

  return (
    <div className="bg-white rounded-xl my-6 w-full">
      <h2 className="text-gray-700 font-semibold mb-4">Recent Campaigns</h2>

      {/* Scrollable table container */}
      <div className=" overflow-y-auto">
        <table className="w-full table-auto border-collapse ">
          <thead className="sticky top-0 bg-primaryColor/20 z-10">
            <tr>
              <th className="p-3 border border-foreground/30 text-left">ID</th>
              <th className="p-3 border border-foreground/30 text-left">Title</th>
              <th className="p-3 border border-foreground/30 text-left">Goal Amount</th>
              <th className="p-3 border border-foreground/30 text-left">Funds Raised</th>
              <th className="p-3 border border-foreground/30 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.campaigns?.map((item: Campaign, index: number) => (
              <motion.tr
                key={item.id}
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                transition={{ type: "spring", stiffness: 80 }}
              >
                <td className="p-3 border border-foreground/30">{index + 1}</td>
                <td className="p-3 border border-foreground/30">{item.title}</td>
                <td className="p-3 border border-foreground/30">₹{item.goalAmount.toLocaleString()}</td>
                <td className="p-3 border border-foreground/30">₹{item.raisedAmount.toLocaleString()}</td>
                <td className="p-3 border border-foreground/30">{item.status}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentCampaign
