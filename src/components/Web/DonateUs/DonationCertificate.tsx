"use client";

import React, { forwardRef } from "react";
import Image from "next/image";
import { DonationReceipt, ReceiptOrgInfo } from "@/src/types/web/receipt";
import { numberToWordsINR } from "@/src/utils/numberToWordsINR";

interface DonationCertificateProps {
  receipt: DonationReceipt;
  className?: string;
}

const DonationCertificate = forwardRef<HTMLDivElement, DonationCertificateProps>(
  ({ receipt, className = "" }, ref) => {
    const formattedDate = React.useMemo(() => {
      const rawDate = receipt.paymentDate || new Date().toISOString();
      try {
        const d = new Date(rawDate);
        if (isNaN(d.getTime())) return rawDate;
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day} / ${month} / ${year}`;
      } catch {
        return rawDate;
      }
    }, [receipt.paymentDate]);

    const formattedAmount = React.useMemo(() => {
      try {
        return new Intl.NumberFormat("en-IN", {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        }).format(receipt.amount);
      } catch {
        return receipt.amount.toString();
      }
    }, [receipt.amount]);

    const amountInWords = React.useMemo(() => {
      return receipt.amountInWords || numberToWordsINR(receipt.amount);
    }, [receipt.amount, receipt.amountInWords]);

    const serialNumber = React.useMemo(() => {
      if (!receipt.receiptNumber) return "0001";
      const parts = receipt.receiptNumber.split("-");
      if (parts.length >= 3) {
        return parts[2];
      }
      return receipt.receiptNumber.slice(-4);
    }, [receipt.receiptNumber]);

    const isOffline = React.useMemo(() => {
      const method = String(receipt.paymentMethod || "").toLowerCase();
      return (
        method.includes("offline") ||
        method.includes("cash") ||
        method.includes("cheque") ||
        method.includes("bank") ||
        method.includes("neft") ||
        method.includes("rtgs") ||
        method.includes("dd")
      );
    }, [receipt.paymentMethod]);

    const modeTag = isOffline ? "(Offline)" : "(Online)";
    const paymentId = receipt.paymentId || receipt.orderId || (isOffline ? "Direct Offline" : "ONLINE");
    const hasPan = Boolean(receipt.donor?.pan && String(receipt.donor.pan).trim() && String(receipt.donor.pan).trim() !== "—");

    const org: Partial<ReceiptOrgInfo> = receipt.organization || {};
    const orgName = org.name || "YOUTH UTIL WELFARE ASSOCIATION";
    const headOffice =
      org.address ||
      "H.No. RZC-13, KH. No. 72/23, 78/3, Nihal Vihar, Nangloi, New Delhi-110041";
    const branchOffice = "393i, Rajiv Nagar, West Basharatpur, Gorakhpur (U.P.)-273001";
    const orgEmail = org.email || "yuwaaindia@gmail.com";
    const orgPhone = org.phone || "9450886855, 7394886855";
    const orgWeb = org.website || "yuwaindia.org";
    const regNumber = org.regNumber || "SOCIETY/WEST/ 2016/8902080";

    return (
      <div
        ref={ref}
        id="donation-certificate"
        data-testid="donation-certificate"
        className={`w-[880px] h-[520px] select-text p-2.5 box-border relative mx-auto bg-white text-gray-900 ${className}`}
        style={{
          boxSizing: "border-box",
          fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
          lineHeight: "1.2",
        }}
      >
        <div
          className="w-full h-full p-2 box-border relative"
          style={{
            border: "4px solid #003366",
            borderRadius: "4px",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            className="w-full h-full p-4 flex flex-col justify-between box-border"
            style={{
              border: "1.5px solid #003366",
              backgroundColor: "#ffffff",
            }}
          >
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-gray-300">
              <div className="w-[185px] shrink-0 flex flex-col items-start">
                <div className="relative w-28 h-14 shrink-0 flex items-center justify-start">
                  <Image
                    src="/assets/LogoO.webp"
                    alt="YUWA INDIA Official Logo"
                    width={110}
                    height={56}
                    className="object-contain max-h-14 w-auto"
                    priority
                    unoptimized
                  />
                </div>

                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-gray-800">
                    №
                  </span>
                  <div
                    className="flex items-center justify-center bg-gray-50 border border-gray-300 rounded shadow-2xs px-2"
                    style={{ height: "32px", minWidth: "68px" }}
                  >
                    <span
                      className="text-2xl font-black tracking-wider text-gray-900 leading-none text-center relative -top-[1px]"
                    >
                      {serialNumber}
                    </span>
                  </div>
                </div>

                <div className="text-[9.5px] font-bold text-gray-700 mt-1 truncate max-w-full leading-normal">
                  Receipt No.:{" "}
                  <span className="font-mono text-[9px] text-[#003366] font-extrabold">
                    {receipt.receiptNumber || "PENDING"}
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center px-1">
                <h1
                  className="text-[21px] font-black tracking-tight leading-tight uppercase"
                  style={{ color: "#003366", letterSpacing: "0.5px" }}
                >
                  {orgName}
                </h1>

                <div className="text-[11px] font-bold text-[#003366] mt-0.5 leading-normal">
                  Registered Under 12AA/80G
                </div>

                <div className="flex items-center justify-center my-1">
                  <div
                    className="bg-[#003366] text-white text-[9.5px] font-black px-3.5 h-[20px] rounded-full tracking-wide uppercase inline-flex items-center justify-center leading-none text-center"
                  >
                    <span className="relative -top-[0.5px]">
                      Registration No. : {regNumber}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-gray-800 leading-tight">
                  Mob. No. : <span className="font-semibold">{orgPhone}</span>
                </div>

                <div className="text-[9.5px] text-gray-700 leading-tight">
                  website: <span className="font-medium text-[#003366]">{orgWeb}</span> •
                  E-mail: <span className="font-medium text-[#003366]">{orgEmail}</span>
                </div>

                <div className="text-[8.5px] text-gray-600 mt-0.5 leading-tight">
                  <span className="font-bold text-gray-700">Head Off.:</span> {headOffice}
                </div>

                <div className="text-[8.5px] text-gray-600 leading-tight">
                  <span className="font-bold text-gray-700">Branch Off.:</span> {branchOffice}
                </div>
              </div>

              <div className="w-[175px] shrink-0 flex flex-col items-end text-right">
                <div className="flex justify-end w-full">
                  <div
                    className="text-white text-[10.5px] font-extrabold px-3.5 h-[22px] rounded-full uppercase tracking-wider shadow-2xs inline-flex items-center justify-center leading-none text-center"
                    style={{ backgroundColor: "#002244" }}
                  >
                    <span className="relative -top-[0.5px]">
                      DONATION RECEIPT
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] font-bold text-gray-800 flex items-center justify-end gap-1">
                  <span>Date :</span>
                  <span className="font-bold text-gray-900 border-b border-dotted border-gray-600 pb-0.5 min-w-[85px] text-center leading-normal">
                    {formattedDate}
                  </span>
                </div>

                <div className="mt-2.5 p-1.5 border border-gray-400 rounded text-[8px] font-semibold text-gray-700 text-center leading-tight bg-gray-50/60 max-w-[170px]">
                  Donations are eligible for tax exemption under Section 80G of the Income Tax Act.
                </div>
              </div>
            </div>

            <div className="py-2.5 space-y-2.5 text-[12px] text-gray-900">
              <div className="flex items-end w-full min-w-0">
                <span
                  className="font-bold text-gray-800 shrink-0 italic pb-1"
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                >
                  Received with thanks from :
                </span>
                <span className="flex-1 font-bold text-[13px] text-gray-900 px-2 border-b border-dotted border-gray-600 pb-1 truncate uppercase tracking-wide leading-normal min-w-0">
                  {receipt.donor?.name || "Generous Donor"}
                </span>
              </div>

              <div className="flex items-end w-full gap-2 min-w-0">
                <div className="flex items-end flex-1 min-w-0">
                  <span
                    className="font-bold text-gray-800 shrink-0 italic pb-1"
                    style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  >
                    Address :
                  </span>
                  <span className="flex-1 font-medium text-[11.5px] text-gray-800 px-2 border-b border-dotted border-gray-600 pb-1 truncate leading-normal min-w-0">
                    {receipt.donor?.address || "—"}
                  </span>
                </div>
                <div className="flex items-end w-[250px] shrink-0">
                  <span
                    className="font-bold text-gray-800 shrink-0 italic pb-1"
                    style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  >
                    Mobile :
                  </span>
                  <span className="flex-1 font-bold text-[12px] text-gray-900 px-2 border-b border-dotted border-gray-600 pb-1 text-center leading-normal truncate min-w-0">
                    {receipt.donor?.phone || "—"}
                  </span>
                </div>
              </div>

              <div className="flex items-end w-full min-w-0">
                <span
                  className="font-bold text-gray-800 shrink-0 italic pb-1"
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                >
                  The sum of Rupees (in words) :
                </span>
                <span
                  className="flex-1 font-bold text-[12px] text-gray-900 px-2 border-b border-dotted border-gray-600 pb-1 italic leading-normal truncate min-w-0"
                  title={amountInWords}
                >
                  {amountInWords}
                </span>
              </div>

              <div className="flex items-end justify-between w-full gap-2 min-w-0">
                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <div className="flex items-end w-full gap-2 min-w-0">
                    <span
                      className="font-bold text-gray-800 shrink-0 text-[11px] italic pb-1"
                      style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                    >
                      Cash / Cheque / UPI / NEFT No. :
                    </span>
                    <span className="flex-1 font-mono font-bold text-[10px] tracking-tight text-[#003366] px-1.5 border-b border-dotted border-gray-600 pb-1 truncate leading-normal min-w-0" title={`${paymentId} ${modeTag}`}>
                      {paymentId} {modeTag}
                    </span>
                    <span
                      className="font-bold text-gray-800 shrink-0 text-[11px] ml-1 italic pb-1"
                      style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                    >
                      Dated :
                    </span>
                    <span className="w-24 font-medium text-[11px] text-gray-800 px-1 border-b border-dotted border-gray-600 pb-1 text-center leading-normal shrink-0">
                      {formattedDate}
                    </span>
                  </div>

                  <div className="flex items-end w-full min-w-0">
                    <span
                      className="font-bold text-gray-800 shrink-0 italic pb-1"
                      style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                    >
                      On account of / Purpose of Donation :
                    </span>
                    <span className="flex-1 font-bold text-[12px] text-gray-900 px-2 border-b border-dotted border-gray-600 pb-1 truncate leading-normal min-w-0">
                      {receipt.campaignTitle || "General Welfare Fund"}
                    </span>
                  </div>

                  {hasPan && (
                    <div className="flex items-end w-full min-w-0">
                      <span
                        className="font-bold text-gray-800 shrink-0 italic pb-1"
                        style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                      >
                        Donor PAN (if Applicable) :
                      </span>
                      <span className="flex-1 font-mono font-bold text-[12px] text-gray-800 px-2 border-b border-dotted border-gray-600 pb-1 leading-normal truncate min-w-0">
                        {receipt.donor?.pan}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className="w-36 h-12 shrink-0 border-2 border-[#a3704c] rounded-md flex items-center justify-center px-3 bg-amber-50/20 shadow-2xs"
                  style={{ borderColor: "#a3704c" }}
                >
                  <span className="text-2xl font-black text-gray-900 mr-1.5 leading-none">
                    ₹
                  </span>
                  <span className="text-xl font-extrabold text-gray-900 tracking-wide leading-none">
                    {formattedAmount} /-
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-300 flex items-end justify-between gap-2">
              <div className="w-[140px] shrink-0">
                <div
                  className="text-white text-[10px] font-black px-3.5 h-[22px] rounded-sm uppercase tracking-wider shadow-2xs inline-flex items-center justify-center leading-none text-center"
                  style={{
                    backgroundColor: "#5a1818",
                    width: "fit-content",
                  }}
                >
                  <span className="relative -top-[0.5px]">
                    DONOR COPY
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center px-2 flex flex-col items-center">
                <div
                  className="text-[#fbc531] text-[12px] font-black px-6 h-[26px] rounded-full border border-[#003366] shadow-2xs inline-flex items-center justify-center leading-none text-center"
                  style={{
                    backgroundColor: "#002244",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    fontFamily: 'Georgia, Cambria, "Times New Roman", serif',
                  }}
                >
                  <span className="relative -top-[1px]">
                    Thanks You for Your Generous Donation
                  </span>
                </div>
                <p
                  className="text-[10px] italic text-gray-700 mt-1 font-medium leading-tight"
                  style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                >
                  Your contribution helps us serve humanity.
                </p>
                <p className="text-[8px] text-gray-500 mt-0.5 leading-tight">
                  All donations are accepted subject to the rules and regulations of the Association.*
                </p>
              </div>

              <div className="w-[200px] shrink-0 text-center flex flex-col items-center">
                <h4 className="text-[9.5px] font-black uppercase text-[#003366] tracking-tight leading-normal">
                  {orgName}
                </h4>
                <div className="h-6 w-full flex items-center justify-center"></div>
                <div className="w-40 border-t border-gray-700 pt-0.5">
                  <p
                    className="text-[10.5px] font-bold text-gray-800 italic leading-normal"
                    style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                  >
                    Authorised Signatory
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DonationCertificate.displayName = "DonationCertificate";

export default DonationCertificate;
