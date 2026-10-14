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
    // Format date safely as DD / MM / YYYY
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

    // Format currency (e.g. 5,000)
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

    // Amount in words
    const amountInWords = React.useMemo(() => {
      return receipt.amountInWords || numberToWordsINR(receipt.amount);
    }, [receipt.amount, receipt.amountInWords]);

    // Extract serial number (e.g. 0007 from YUWA-2026-0007-8e307c61)
    const serialNumber = React.useMemo(() => {
      if (!receipt.receiptNumber) return "0001";
      const parts = receipt.receiptNumber.split("-");
      if (parts.length >= 3) {
        return parts[2];
      }
      return receipt.receiptNumber.slice(-4);
    }, [receipt.receiptNumber]);

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
        className={`w-[880px] min-h-[460px] select-text font-sans p-2.5 box-border relative mx-auto bg-white text-gray-900 ${className}`}
        style={{ boxSizing: "border-box" }}
      >
        {/* Outer Frame with Double Classic Blue Border and Corner Blocks */}
        <div
          className="w-full h-full p-2 box-border relative"
          style={{
            border: "4px solid #003366",
            borderRadius: "4px",
            backgroundColor: "#ffffff",
          }}
        >
          {/* Inner Thin Border */}
          <div
            className="w-full h-full p-4 flex flex-col justify-between box-border"
            style={{
              border: "1.5px solid #003366",
              backgroundColor: "#ffffff",
            }}
          >
            {/* ===================== HEADER ===================== */}
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-gray-300">
              {/* Left Column: Logo, Hindi Tagline, Serial Box & Receipt No */}
              <div className="w-[185px] shrink-0 flex flex-col items-start">
                <div className="flex items-center gap-1.5">
                  <div className="relative w-16 h-14 shrink-0 flex items-center justify-center">
                    <Image
                      src="/assets/LogoO.webp"
                      alt="YUWA INDIA Logo"
                      width={64}
                      height={56}
                      className="object-contain max-h-14"
                      priority
                      unoptimized
                    />
                  </div>
                  <div>
                    <div className="font-extrabold text-[#e65100] text-sm tracking-tight leading-none">
                      YUWA
                    </div>
                    <div className="font-black text-[#00897b] text-base tracking-widest leading-tight">
                      INDIA
                    </div>
                  </div>
                </div>
                <p className="text-[8.5px] font-semibold text-[#d84315] mt-0.5 tracking-tight">
                  मानवता में ही पूर्णता निहित है
                </p>

                {/* Big Serial Number Box */}
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[13px] font-serif font-bold text-gray-800">
                    №
                  </span>
                  <span className="text-2xl font-black font-sans tracking-wider text-gray-900 px-1.5 py-0.2 bg-gray-50 border border-gray-300 rounded shadow-2xs">
                    {serialNumber}
                  </span>
                </div>

                <div className="text-[9.5px] font-serif font-bold text-gray-700 mt-0.5 truncate max-w-full">
                  Receipt No.:{" "}
                  <span className="font-mono text-[9px] text-[#003366] font-extrabold">
                    {receipt.receiptNumber || "PENDING"}
                  </span>
                </div>
              </div>

              {/* Center Column: Organization Name & Registered Office Details */}
              <div className="flex-1 text-center px-1">
                <h1
                  className="text-[21px] font-black tracking-tight leading-tight uppercase font-sans"
                  style={{ color: "#003366", letterSpacing: "0.5px" }}
                >
                  {orgName}
                </h1>

                <div className="text-[11px] font-bold text-[#003366] mt-0.5">
                  Registered Under 12AA/80G
                </div>

                {/* Registration Number Pill */}
                <div className="inline-block bg-[#003366] text-white text-[9.5px] font-black px-2.5 py-0.5 rounded-full my-0.5 tracking-wide uppercase">
                  Registration No. : {regNumber}
                </div>

                <div className="text-[10px] font-bold text-gray-800 mt-0.5">
                  Mob. No. : <span className="font-sans font-semibold">{orgPhone}</span>
                </div>

                <div className="text-[9.5px] text-gray-700">
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

              {/* Right Column: Donation Receipt Pill, Date & 80G Box */}
              <div className="w-[170px] shrink-0 flex flex-col items-end text-right">
                <div
                  className="inline-block text-white text-[10.5px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs"
                  style={{ backgroundColor: "#002244" }}
                >
                  DONATION RECEIPT
                </div>

                <div className="mt-2 text-[11px] font-serif font-bold text-gray-800 flex items-center justify-end gap-1">
                  <span>Date :</span>
                  <span className="font-sans font-bold text-gray-900 border-b border-dotted border-gray-500 pb-0.5 min-w-[85px] text-center">
                    {formattedDate}
                  </span>
                </div>

                {/* 80G Tax Exemption Framed Note */}
                <div className="mt-2.5 p-1.5 border border-gray-400 rounded text-[8px] font-semibold text-gray-700 text-center leading-tight bg-gray-50/60 max-w-[165px]">
                  Donations are eligible for tax exemption under Section 80G of the Income Tax Act.
                </div>
              </div>
            </div>

            {/* ===================== BODY (TRADITIONAL CHECK/RECEIPT DOTTED LINES) ===================== */}
            <div className="py-2.5 space-y-2.5 font-serif text-[12px] text-gray-900">
              {/* Row 1: Received with thanks from */}
              <div className="flex items-baseline w-full">
                <span className="italic font-bold text-gray-800 shrink-0">
                  Received with thanks from :
                </span>
                <span className="flex-1 font-sans font-bold text-[13px] text-gray-900 px-2 border-b-2 border-dotted border-gray-500 pb-0.5 truncate uppercase tracking-wide">
                  {receipt.donor?.name || "Generous Donor"}
                </span>
              </div>

              {/* Row 2: Address & Mobile */}
              <div className="flex items-baseline w-full gap-2">
                <div className="flex items-baseline flex-1 min-w-0">
                  <span className="italic font-bold text-gray-800 shrink-0">
                    Address :
                  </span>
                  <span className="flex-1 font-sans font-medium text-[11.5px] text-gray-800 px-2 border-b-2 border-dotted border-gray-500 pb-0.5 truncate">
                    {receipt.donor?.address || "—"}
                  </span>
                </div>
                <div className="flex items-baseline w-[250px] shrink-0">
                  <span className="italic font-bold text-gray-800 shrink-0">
                    Mobile :
                  </span>
                  <span className="flex-1 font-sans font-bold text-[12px] text-gray-900 px-2 border-b-2 border-dotted border-gray-500 pb-0.5 text-center">
                    {receipt.donor?.phone || "—"}
                  </span>
                </div>
              </div>

              {/* Row 3: The sum of Rupees (in words) */}
              <div className="flex items-baseline w-full">
                <span className="italic font-bold text-gray-800 shrink-0">
                  The sum of Rupees (in words) :
                </span>
                <span className="flex-1 font-sans font-bold text-[12px] text-gray-900 px-2 border-b-2 border-dotted border-gray-500 pb-0.5 italic">
                  {amountInWords}
                </span>
              </div>

              {/* Row 4: Mode / Transaction No, Dated & ₹ Amount Box */}
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-baseline w-full gap-2">
                    <span className="italic font-bold text-gray-800 shrink-0 text-[11px]">
                      Cash / Cheque / UPI / NEFT No. :
                    </span>
                    <span className="flex-1 font-mono font-bold text-[11px] text-[#003366] px-1.5 border-b-2 border-dotted border-gray-500 pb-0.5 truncate">
                      {receipt.paymentId || receipt.orderId || "ONLINE"}
                    </span>
                    <span className="italic font-bold text-gray-800 shrink-0 text-[11px] ml-1">
                      Dated :
                    </span>
                    <span className="w-24 font-sans font-medium text-[11px] text-gray-800 px-1 border-b-2 border-dotted border-gray-500 pb-0.5 text-center">
                      {formattedDate}
                    </span>
                  </div>

                  {/* Row 5: Purpose of Donation */}
                  <div className="flex items-baseline w-full">
                    <span className="italic font-bold text-gray-800 shrink-0">
                      On account of / Purpose of Donation :
                    </span>
                    <span className="flex-1 font-sans font-bold text-[12px] text-gray-900 px-2 border-b-2 border-dotted border-gray-500 pb-0.5 truncate">
                      {receipt.campaignTitle || "General Welfare Fund"}
                    </span>
                  </div>

                  {/* Row 6: Donor PAN (if Applicable) */}
                  <div className="flex items-baseline w-full">
                    <span className="italic font-bold text-gray-800 shrink-0">
                      Donor PAN (if Applicable) :
                    </span>
                    <span className="flex-1 font-mono font-bold text-[12px] text-gray-800 px-2 border-b-2 border-dotted border-gray-500 pb-0.5">
                      {receipt.donor?.pan || "—"}
                    </span>
                  </div>
                </div>

                {/* Distinctive Currency Box on Right */}
                <div
                  className="w-36 h-12 shrink-0 border-2 border-[#b08958] rounded-md flex items-center justify-center px-3 bg-amber-50/20 shadow-2xs"
                  style={{ borderColor: "#a3704c" }}
                >
                  <span className="text-2xl font-black text-gray-900 mr-1.5 font-sans">
                    ₹
                  </span>
                  <span className="text-xl font-extrabold font-sans text-gray-900 tracking-wide">
                    {formattedAmount} /-
                  </span>
                </div>
              </div>
            </div>

            {/* ===================== FOOTER ===================== */}
            <div className="pt-2 border-t border-gray-300 flex items-end justify-between gap-2">
              {/* Left: DONOR COPY Badge */}
              <div className="w-[140px] shrink-0">
                <div
                  className="inline-block text-white text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-wider shadow-2xs"
                  style={{ backgroundColor: "#5a1818" }}
                >
                  DONOR COPY
                </div>
              </div>

              {/* Center: Oval Gratitude Banner & Terms */}
              <div className="flex-1 text-center px-2 flex flex-col items-center">
                <div
                  className="inline-block text-[#fbc531] text-[12px] font-serif font-black px-6 py-0.5 rounded-full border border-[#003366] shadow-2xs"
                  style={{
                    backgroundColor: "#002244",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                >
                  Thanks You for Your Generous Donation
                </div>
                <p className="text-[10px] font-serif italic text-gray-700 mt-0.5 font-medium">
                  Your contribution helps us serve humanity.
                </p>
                <p className="text-[8px] text-gray-500 mt-0.5">
                  All donations are accepted subject to the rules and regulations of the Association.*
                </p>
              </div>

              {/* Right: Signature Space */}
              <div className="w-[200px] shrink-0 text-center flex flex-col items-center">
                <h4 className="text-[9.5px] font-black uppercase text-[#003366] tracking-tight">
                  {orgName}
                </h4>
                {/* Empty digital signature reserved space */}
                <div className="h-7 w-full flex items-center justify-center"></div>
                <div className="w-40 border-t border-gray-700 pt-0.5">
                  <p className="text-[10.5px] font-serif font-bold text-gray-800 italic">
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
