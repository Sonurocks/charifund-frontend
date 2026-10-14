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
    // Format date safely
    const formattedDate = React.useMemo(() => {
      if (!receipt.paymentDate) {
        return new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
      try {
        const d = new Date(receipt.paymentDate);
        if (isNaN(d.getTime())) return receipt.paymentDate;
        return d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      } catch {
        return receipt.paymentDate;
      }
    }, [receipt.paymentDate]);

    // Format currency
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

    const org: Partial<ReceiptOrgInfo> = receipt.organization || {};
    const orgName = org.name || "Youth Util Welfare Association (YUWA INDIA)";
    const orgTagline =
      org.tagline ||
      "मानवता में ही पूर्णता निहित है | Empowering lives, building a better society";
    const orgAddress =
      org.address ||
      "H. No. RZC-13, Nihal Vihar, Nangloi, New Delhi – 110041, India";
    const orgEmail = org.email || "yuwaaindia@gmail.com";
    const orgPhone = org.phone || "+91 85650 06669";
    const orgWeb = org.website || "www.yuwaindia.org";
    const orgReg = org.regNumber || "Regd. Under Society Reg. Act XXI of 1860";

    return (
      <div
        ref={ref}
        id="donation-certificate"
        data-testid="donation-certificate"
        className={`w-[794px] min-h-[560px] select-text font-sans p-3 box-border relative mx-auto ${className}`}
        style={{
          boxSizing: "border-box",
          backgroundColor: "#ffffff",
          color: "#111827",
        }}
      >
        {/* Outer Blue Border */}
        <div
          className="w-full h-full p-1.5 rounded-lg box-border"
          style={{
            border: "3px solid #0f3460",
            backgroundColor: "#ffffff",
          }}
        >
          {/* Inner Blue Border */}
          <div
            className="w-full h-full rounded-md p-5 flex flex-col justify-between box-border"
            style={{
              border: "1.5px solid #2563eb",
              backgroundColor: "#ffffff",
            }}
          >
            {/* Header Section */}
            <div>
              <div
                className="flex items-center justify-between gap-4 pb-3"
                style={{ borderBottom: "2px solid #1e40af" }}
              >
                {/* Logo */}
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <Image
                    src="/assets/LogoO.webp"
                    alt="Youth Util Welfare Association Official Logo"
                    width={80}
                    height={80}
                    className="object-contain max-h-20"
                    priority
                    unoptimized
                  />
                </div>

                {/* Organization Details */}
                <div className="flex-1 text-center px-2">
                  <h1
                    className="text-xl font-extrabold tracking-wide uppercase leading-tight"
                    style={{ color: "#0f3460" }}
                  >
                    {orgName}
                  </h1>
                  <p
                    className="text-[11px] font-medium mt-0.5 italic"
                    style={{ color: "#4b5563" }}
                  >
                    {orgTagline}
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: "#6b7280" }}>
                    {orgReg} | {orgAddress}
                  </p>
                  <p
                    className="text-[10px] font-medium"
                    style={{ color: "#6b7280" }}
                  >
                    Email: {orgEmail} | Phone: {orgPhone} | Web: {orgWeb}
                  </p>
                </div>

                {/* Receipt Tag & Meta */}
                <div className="shrink-0 text-right min-w-[140px]">
                  <div
                    className="inline-block text-white text-[11px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider"
                    style={{ backgroundColor: "#0f3460" }}
                  >
                    Donation Receipt
                  </div>
                  <div className="mt-2 text-[11px] space-y-0.5">
                    <div>
                      <span style={{ color: "#6b7280" }} className="font-medium">
                        Receipt:{" "}
                      </span>
                      <span
                        className="font-bold font-mono"
                        style={{ color: "#0f3460" }}
                      >
                        {receipt.receiptNumber ||
                          "RCP-" + receipt.paymentId.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: "#6b7280" }} className="font-medium">
                        Date:{" "}
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: "#1f2937" }}
                      >
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Information Grid */}
              <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                {/* Left: Donor Details */}
                <div
                  className="rounded-md p-3 flex flex-col justify-between"
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div>
                    <h3
                      className="text-[11px] font-bold uppercase tracking-wider pb-1 mb-2 flex items-center justify-between"
                      style={{
                        color: "#0f3460",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <span>Donor Details</span>
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                        style={{
                          color: "#047857",
                          backgroundColor: "#ecfdf5",
                        }}
                      >
                        Verified Donor
                      </span>
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-start">
                        <span
                          className="w-20 shrink-0 font-medium"
                          style={{ color: "#6b7280" }}
                        >
                          Name:
                        </span>
                        <span
                          className="font-bold break-words flex-1"
                          style={{ color: "#111827" }}
                        >
                          {receipt.donor.name || "Generous Supporter"}
                        </span>
                      </div>
                      {receipt.donor.email && (
                        <div className="flex items-start">
                          <span
                            className="w-20 shrink-0 font-medium"
                            style={{ color: "#6b7280" }}
                          >
                            Email:
                          </span>
                          <span
                            className="break-words flex-1 font-mono text-[11px]"
                            style={{ color: "#1f2937" }}
                          >
                            {receipt.donor.email}
                          </span>
                        </div>
                      )}
                      {receipt.donor.phone && (
                        <div className="flex items-start">
                          <span
                            className="w-20 shrink-0 font-medium"
                            style={{ color: "#6b7280" }}
                          >
                            Phone:
                          </span>
                          <span className="flex-1" style={{ color: "#1f2937" }}>
                            {receipt.donor.phone}
                          </span>
                        </div>
                      )}
                      {receipt.donor.address && (
                        <div className="flex items-start">
                          <span
                            className="w-20 shrink-0 font-medium"
                            style={{ color: "#6b7280" }}
                          >
                            Address:
                          </span>
                          <span
                            className="flex-1 line-clamp-2 leading-relaxed"
                            style={{ color: "#374151" }}
                          >
                            {receipt.donor.address}
                          </span>
                        </div>
                      )}
                      {receipt.donor.pan && (
                        <div className="flex items-start">
                          <span
                            className="w-20 shrink-0 font-medium"
                            style={{ color: "#6b7280" }}
                          >
                            PAN:
                          </span>
                          <span
                            className="font-mono font-semibold flex-1"
                            style={{ color: "#111827" }}
                          >
                            {receipt.donor.pan}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Payment & Contribution Details */}
                <div
                  className="rounded-md p-3 flex flex-col justify-between"
                  style={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div>
                    <h3
                      className="text-[11px] font-bold uppercase tracking-wider pb-1 mb-2 flex items-center justify-between"
                      style={{
                        color: "#0f3460",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <span>Payment & Campaign</span>
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
                        style={{
                          color: "#047857",
                          backgroundColor: "#ecfdf5",
                        }}
                      >
                        {receipt.paymentStatus || "Completed"}
                      </span>
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-start">
                        <span
                          className="w-24 shrink-0 font-medium"
                          style={{ color: "#6b7280" }}
                        >
                          Campaign:
                        </span>
                        <span
                          className="font-semibold break-words flex-1"
                          style={{ color: "#111827" }}
                        >
                          {receipt.campaignTitle || "General Welfare Fund"}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span
                          className="w-24 shrink-0 font-medium"
                          style={{ color: "#6b7280" }}
                        >
                          Payment Mode:
                        </span>
                        <span className="flex-1" style={{ color: "#1f2937" }}>
                          {receipt.paymentMethod || "Online (Razorpay)"}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span
                          className="w-24 shrink-0 font-medium"
                          style={{ color: "#6b7280" }}
                        >
                          Payment ID:
                        </span>
                        <span
                          className="font-mono text-[10.5px] break-all flex-1"
                          style={{ color: "#1f2937" }}
                        >
                          {receipt.paymentId || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span
                          className="w-24 shrink-0 font-medium"
                          style={{ color: "#6b7280" }}
                        >
                          Order ID:
                        </span>
                        <span
                          className="font-mono text-[10.5px] break-all flex-1"
                          style={{ color: "#1f2937" }}
                        >
                          {receipt.orderId || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Highlight Banner */}
              <div
                className="mt-3 rounded-md p-3 flex items-center justify-between"
                style={{
                  backgroundColor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                }}
              >
                <div>
                  <span
                    className="text-[10px] uppercase font-bold tracking-wider block mb-0.5"
                    style={{ color: "#1e3a8a" }}
                  >
                    Donation Amount Received
                  </span>
                  <p
                    className="text-xl font-extrabold"
                    style={{ color: "#0f3460" }}
                  >
                    ₹ {formattedAmount}{" "}
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#1e40af" }}
                    >
                      INR
                    </span>
                  </p>
                </div>
                <div className="text-right max-w-sm pl-4">
                  <span
                    className="text-[10px] uppercase font-bold tracking-wider block mb-0.5"
                    style={{ color: "#6b7280" }}
                  >
                    Amount In Words
                  </span>
                  <p
                    className="text-[11px] font-semibold italic leading-snug"
                    style={{ color: "#1f2937" }}
                  >
                    {amountInWords}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Section: Tax Note & Signatory */}
            <div
              className="pt-3 flex items-end justify-between gap-6 text-xs mt-2"
              style={{ borderTop: "1px solid #e5e7eb" }}
            >
              {/* Tax Note */}
              <div className="flex-1 max-w-md">
                <p
                  className="text-[9.5px] leading-relaxed"
                  style={{ color: "#6b7280" }}
                >
                  {receipt.taxNote ||
                    "Thank you for your valuable contribution. This is a computer-generated receipt issued following verified electronic payment. Please retain this receipt for your records."}
                </p>
              </div>

              {/* Authorized Signatory */}
              <div className="shrink-0 text-center min-w-[160px]">
                <div className="h-10 flex items-center justify-center">
                  <span
                    className="font-serif italic font-bold text-sm tracking-wider"
                    style={{ color: "#0f3460" }}
                  >
                    YUWA India
                  </span>
                </div>
                <div
                  className="w-36 mx-auto pt-1"
                  style={{ borderTop: "1px solid #9ca3af" }}
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "#1f2937" }}
                  >
                    Authorised Signatory
                  </p>
                  <p className="text-[8.5px]" style={{ color: "#6b7280" }}>
                    Youth Util Welfare Association
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
