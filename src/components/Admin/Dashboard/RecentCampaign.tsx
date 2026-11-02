import React from 'react'
import { Campaign } from '@/src/types/admin/campaign';
import { useFetchAllCampaigns } from '@/src/hooks/admin/useCampaigns';

function RecentCampaign() {
  const { data, isLoading } = useFetchAllCampaigns(1, 10) as {
    data?: { campaigns: Campaign[] };
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl my-6 w-full p-4 border border-gray-100">
        <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.campaigns || data.campaigns.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl my-6 w-full">
      <h2 className="text-gray-700 font-semibold mb-4">Recent Campaigns</h2>
      {/* Scrollable table container */}
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[550px] table-auto border-collapse text-xs sm:text-sm">
          <thead className="sticky top-0 bg-primaryColor/20 z-10">
            <tr>
              <th className="p-2.5 sm:p-3 border border-foreground/30 text-left whitespace-nowrap">ID</th>
              <th className="p-2.5 sm:p-3 border border-foreground/30 text-left">Title</th>
              <th className="p-2.5 sm:p-3 border border-foreground/30 text-left whitespace-nowrap">Goal Amount</th>
              <th className="p-2.5 sm:p-3 border border-foreground/30 text-left whitespace-nowrap">Funds Raised</th>
              <th className="p-2.5 sm:p-3 border border-foreground/30 text-left whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.campaigns.map((item: Campaign, index: number) => {
              const campaignKey = (item as any)._id || item.id || `campaign-${index}`;
              const titleText =
                (typeof item.title === 'string' ? item.title : item.title?.en) || 'Untitled';

              return (
                <tr
                  key={campaignKey}
                  className="transition-colors hover:bg-gray-50/80"
                >
                  <td className="p-3 border border-foreground/30 font-medium">{index + 1}</td>
                  <td className="p-3 border border-foreground/30 font-medium text-gray-900">{titleText}</td>
                  <td className="p-3 border border-foreground/30 whitespace-nowrap">
                    ₹{(item.goalAmount ?? 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 border border-foreground/30 whitespace-nowrap font-semibold text-gray-900">
                    ₹{(item.raisedAmount ?? 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 border border-foreground/30 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border shadow-2xs ${
                        item.status?.toLowerCase() === 'completed'
                          ? 'bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]'
                          : item.status?.toLowerCase() === 'active'
                          ? 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]'
                          : 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentCampaign;
