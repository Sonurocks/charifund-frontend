import path from "path";
import fs from "fs";
import { DonationReceipt, ReceiptOrgInfo } from "@/src/types/web/receipt";
import { numberToWordsINR } from "@/src/utils/numberToWordsINR";

let cachedLogoBase64: string | null = null;

function getLogoBase64(): string {
  if (cachedLogoBase64) return cachedLogoBase64;
  try {
    const logoPath = path.join(process.cwd(), "public", "assets", "LogoO.webp");
    if (fs.existsSync(logoPath)) {
      cachedLogoBase64 = fs.readFileSync(logoPath).toString("base64");
      return cachedLogoBase64;
    }
  } catch (err) {
    console.warn("Could not load logo from filesystem:", err);
  }
  return "";
}

function escapeHtml(str: any): string {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function generateCertificateHtml(receipt: DonationReceipt): string {
  const org: Partial<ReceiptOrgInfo> = receipt.organization || {};
  const orgName = escapeHtml(org.name || "YOUTH UTIL WELFARE ASSOCIATION");
  const headOffice = escapeHtml(
    org.address ||
      "H.No. RZC-13, KH. No. 72/23, 78/3, Nihal Vihar, Nangloi, New Delhi-110041"
  );
  const branchOffice = escapeHtml(
    org.branchAddress ||
      "Behind Sankat Mochan Hanuman Mandir, Azad Nagar Colony East, Taramandal Road, Rustampur, Gorakhpur, Uttar Pradesh-273001"
  );
  const orgEmail = escapeHtml(org.email || "yuwaaindia@gmail.com");
  const orgPhone = escapeHtml(org.phone || "9450886855, 7394886855");
  const orgWeb = escapeHtml(org.website || "yuwaindia.org");
  const regNumber = escapeHtml(org.regNumber || "SOCIETY/WEST/ 2016/8902080");

  let formattedDate = receipt.paymentDate || new Date().toISOString();
  try {
    const d = new Date(formattedDate);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      formattedDate = `${day} / ${month} / ${year}`;
    }
  } catch (_e) {}
  formattedDate = escapeHtml(formattedDate);

  let formattedAmount = receipt.amount ? receipt.amount.toString() : "0";
  try {
    formattedAmount = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(receipt.amount || 0);
  } catch (_e) {}
  formattedAmount = escapeHtml(formattedAmount);

  const amountInWords = escapeHtml(
    receipt.amountInWords || numberToWordsINR(receipt.amount || 0)
  );

  let serialNumber = "0001";
  if (receipt.receiptNumber) {
    const parts = receipt.receiptNumber.split("-");
    if (parts.length >= 3) {
      serialNumber = parts[2];
    } else {
      serialNumber = receipt.receiptNumber.slice(-4);
    }
  }
  serialNumber = escapeHtml(serialNumber);

  const donorName = escapeHtml(receipt.donor?.name || "Generous Donor");
  const donorAddress = escapeHtml(receipt.donor?.address || "—");
  const donorPhone = escapeHtml(receipt.donor?.phone || "—");
  const rawPan = receipt.donor?.pan && String(receipt.donor.pan).trim() !== "" && String(receipt.donor.pan).trim() !== "—"
    ? String(receipt.donor.pan).trim()
    : null;
  const donorPan = rawPan ? escapeHtml(rawPan) : null;

  const isOffline =
    typeof receipt.paymentMethod === "string" &&
    (receipt.paymentMethod.toLowerCase().includes("offline") ||
      receipt.paymentMethod.toLowerCase().includes("cash") ||
      receipt.paymentMethod.toLowerCase().includes("cheque") ||
      receipt.paymentMethod.toLowerCase().includes("bank") ||
      receipt.paymentMethod.toLowerCase().includes("neft") ||
      receipt.paymentMethod.toLowerCase().includes("rtgs") ||
      receipt.paymentMethod.toLowerCase().includes("dd"));

  const modeTag = isOffline ? " (Offline)" : " (Online)";
  const defaultId = isOffline ? "Direct Offline" : "ONLINE";
  const rawId = receipt.paymentId || receipt.orderId || defaultId;
  const paymentIdentifier = escapeHtml(`${rawId}${modeTag}`);
  const receiptNum = escapeHtml(receipt.receiptNumber || "PENDING");
  const campaignTitle = escapeHtml(
    receipt.campaignTitle || "General Welfare Fund"
  );

  const logoBase64 = getLogoBase64();
  const logoSrc = logoBase64
    ? `data:image/webp;base64,${logoBase64}`
    : "/assets/LogoO.webp";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Donation Receipt - ${receiptNum}</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 880px;
      height: 520px;
      overflow: hidden;
      background: #ffffff;
      color: #111827;
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
      line-height: 1.2;
      -webkit-font-smoothing: antialiased;
    }
    .cert-root {
      width: 880px;
      height: 520px;
      padding: 10px;
      background: #ffffff;
      position: relative;
    }
    .cert-outer {
      width: 100%;
      height: 100%;
      padding: 8px;
      border: 4px solid #003366;
      border-radius: 4px;
      background-color: #ffffff;
    }
    .cert-inner {
      width: 100%;
      height: 100%;
      padding: 16px;
      border: 1.5px solid #003366;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .cert-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid #d1d5db;
    }
    .header-left {
      width: 185px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .logo-box {
      width: 112px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .logo-img {
      max-height: 56px;
      width: auto;
      object-fit: contain;
    }
    .serial-row {
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .serial-label {
      font-size: 13px;
      font-weight: 700;
      color: #1f2937;
    }
    .serial-box {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f9fafb;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      height: 32px;
      min-width: 68px;
      padding: 0 8px;
    }
    .serial-number {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 1px;
      color: #111827;
      line-height: 1;
      text-align: center;
      position: relative;
      top: -1px;
    }
    .receipt-no-text {
      font-size: 9.5px;
      font-weight: 700;
      color: #374151;
      margin-top: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
    .receipt-no-val {
      font-family: monospace;
      font-size: 9px;
      color: #003366;
      font-weight: 800;
    }
    .header-center {
      flex: 1;
      text-align: center;
      padding: 0 4px;
    }
    .org-title {
      font-size: 21px;
      font-weight: 900;
      letter-spacing: 0.5px;
      line-height: 1.25;
      text-transform: uppercase;
      color: #003366;
    }
    .reg-tagline {
      font-size: 11px;
      font-weight: 700;
      color: #003366;
      margin-top: 2px;
    }
    .pill-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 4px 0;
    }
    .reg-pill {
      background-color: #003366;
      color: #ffffff;
      font-size: 9.5px;
      font-weight: 900;
      padding: 0 14px;
      height: 20px;
      border-radius: 9999px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
    .contact-line {
      font-size: 10px;
      font-weight: 700;
      color: #1f2937;
      line-height: 1.3;
    }
    .web-email-line {
      font-size: 9.5px;
      color: #374151;
      line-height: 1.3;
    }
    .web-email-line span {
      color: #003366;
      font-weight: 500;
    }
    .address-line {
      font-size: 8.5px;
      color: #4b5563;
      margin-top: 2px;
      line-height: 1.3;
    }
    .address-line strong {
      color: #374151;
    }
    .header-right {
      width: 175px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      text-align: right;
    }
    .receipt-pill {
      background-color: #002244;
      color: #ffffff;
      font-size: 10.5px;
      font-weight: 800;
      padding: 0 14px;
      height: 22px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
    .date-row {
      margin-top: 8px;
      font-size: 11px;
      font-weight: 700;
      color: #1f2937;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
    }
    .date-val {
      font-weight: 700;
      color: #111827;
      border-bottom: 1px dotted #4b5563;
      padding-bottom: 2px;
      min-width: 85px;
      text-align: center;
    }
    .tax-box {
      margin-top: 10px;
      padding: 6px;
      border: 1px solid #9ca3af;
      border-radius: 4px;
      font-size: 8px;
      font-weight: 600;
      color: #374151;
      text-align: center;
      line-height: 1.3;
      background-color: rgba(249, 250, 251, 0.6);
      max-width: 170px;
    }
    .cert-body {
      padding: 10px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 12px;
      color: #111827;
    }
    .form-row {
      display: flex;
      align-items: flex-end;
      width: 100%;
      min-width: 0;
    }
    .field-label {
      font-weight: 700;
      color: #1f2937;
      font-style: italic;
      font-family: Georgia, Cambria, "Times New Roman", serif;
      flex-shrink: 0;
      padding-bottom: 4px;
    }
    .dotted-line {
      flex: 1;
      border-bottom: 1px dotted #4b5563;
      padding: 0 8px 4px 8px;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
    }
    .donor-name-val {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .donor-addr-val {
      font-size: 11.5px;
      font-weight: 500;
      color: #1f2937;
    }
    .donor-phone-val {
      font-size: 12px;
      font-weight: 700;
      text-align: center;
    }
    .amount-words-val {
      font-size: 12px;
      font-weight: 700;
      font-style: italic;
    }
    .payment-id-val {
      font-family: monospace;
      font-size: 10px;
      letter-spacing: -0.2px;
      font-weight: 700;
      color: #003366;
    }
    .campaign-val {
      font-size: 12px;
      font-weight: 700;
    }
    .pan-val {
      font-family: monospace;
      font-size: 12px;
      font-weight: 700;
      color: #1f2937;
    }
    .currency-box {
      width: 144px;
      height: 48px;
      flex-shrink: 0;
      border: 2px solid #a3704c;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
      background-color: rgba(254, 243, 199, 0.2);
    }
    .currency-symbol {
      font-size: 24px;
      font-weight: 900;
      color: #111827;
      margin-right: 6px;
      line-height: 1;
    }
    .currency-amount {
      font-size: 20px;
      font-weight: 800;
      color: #111827;
      letter-spacing: 0.5px;
      line-height: 1;
    }
    .cert-footer {
      padding-top: 8px;
      border-top: 1px solid #d1d5db;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 8px;
    }
    .footer-left {
      width: 140px;
      flex-shrink: 0;
    }
    .donor-copy-badge {
      background-color: #5a1818;
      color: #ffffff;
      font-size: 10px;
      font-weight: 900;
      padding: 0 14px;
      height: 22px;
      border-radius: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      width: fit-content;
    }
    .footer-center {
      flex: 1;
      text-align: center;
      padding: 0 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .gratitude-pill {
      background-color: #002244;
      color: #fbc531;
      font-size: 12px;
      font-weight: 900;
      padding: 0 24px;
      height: 26px;
      border-radius: 9999px;
      border: 1px solid #003366;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      font-family: Georgia, Cambria, "Times New Roman", serif;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
    .gratitude-subtext {
      font-size: 10px;
      font-style: italic;
      color: #374151;
      margin-top: 4px;
      font-weight: 500;
      font-family: Georgia, Cambria, "Times New Roman", serif;
    }
    .terms-text {
      font-size: 8px;
      color: #6b7280;
      margin-top: 2px;
    }
    .footer-right {
      width: 200px;
      flex-shrink: 0;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .signatory-org {
      font-size: 9.5px;
      font-weight: 900;
      text-transform: uppercase;
      color: #003366;
      letter-spacing: -0.2px;
    }
    .signature-space {
      height: 24px;
      width: 100%;
    }
    .signatory-line {
      width: 160px;
      border-top: 1px solid #374151;
      padding-top: 2px;
    }
    .signatory-title {
      font-size: 10.5px;
      font-weight: 700;
      color: #1f2937;
      font-style: italic;
      font-family: Georgia, Cambria, "Times New Roman", serif;
    }
  </style>
</head>
<body>
  <div class="cert-root" id="donation-certificate">
    <div class="cert-outer">
      <div class="cert-inner">
        <div class="cert-header">
          <div class="header-left">
            <div class="logo-box">
              <img src="${logoSrc}" alt="YUWA INDIA Official Logo" class="logo-img" />
            </div>
            <div class="serial-row">
              <span class="serial-label">№</span>
              <div class="serial-box">
                <span class="serial-number">${serialNumber}</span>
              </div>
            </div>
            <div class="receipt-no-text">
              Receipt No.: <span class="receipt-no-val">${receiptNum}</span>
            </div>
          </div>

          <div class="header-center">
            <h1 class="org-title">${orgName}</h1>
            <div class="reg-tagline">Registered Under 12AA/80G</div>
            <div class="pill-container">
              <div class="reg-pill">Registration No. : ${regNumber}</div>
            </div>
            <div class="contact-line">Mob. No. : <span>${orgPhone}</span></div>
            <div class="web-email-line">website: <span>${orgWeb}</span> • E-mail: <span>${orgEmail}</span></div>
            <div class="address-line"><strong>Head Off.:</strong> ${headOffice}</div>
            <div class="address-line"><strong>Branch Off.:</strong> ${branchOffice}</div>
          </div>

          <div class="header-right">
            <div>
              <div class="receipt-pill">DONATION RECEIPT</div>
            </div>
            <div class="date-row">
              <span>Date :</span>
              <span class="date-val">${formattedDate}</span>
            </div>
            <div class="tax-box">
              Donations are eligible for tax exemption under Section 80G of the Income Tax Act.
            </div>
          </div>
        </div>

        <div class="cert-body">
          <div class="form-row">
            <span class="field-label">Received with thanks from :</span>
            <span class="dotted-line donor-name-val">${donorName}</span>
          </div>

          <div class="form-row" style="gap: 8px;">
            <div class="form-row" style="flex: 1;">
              <span class="field-label">Address :</span>
              <span class="dotted-line donor-addr-val">${donorAddress}</span>
            </div>
            <div class="form-row" style="width: 250px; flex-shrink: 0;">
              <span class="field-label">Mobile :</span>
              <span class="dotted-line donor-phone-val">${donorPhone}</span>
            </div>
          </div>

          <div class="form-row">
            <span class="field-label">The sum of Rupees (in words) :</span>
            <span class="dotted-line amount-words-val">${amountInWords}</span>
          </div>

          <div class="form-row" style="gap: 8px; align-items: flex-end;">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px; min-width: 0;">
              <div class="form-row" style="gap: 8px;">
                <span class="field-label" style="font-size: 11px;">Cash / Cheque / UPI / NEFT No. :</span>
                <span class="dotted-line payment-id-val">${paymentIdentifier}</span>
                <span class="field-label" style="font-size: 11px; margin-left: 4px;">Dated :</span>
                <span class="dotted-line" style="width: 96px; flex: none; text-align: center; font-size: 11px;">${formattedDate}</span>
              </div>
              <div class="form-row">
                <span class="field-label">On account of / Purpose of Donation :</span>
                <span class="dotted-line campaign-val">${campaignTitle}</span>
              </div>
              ${donorPan ? `
              <div class="form-row">
                <span class="field-label">Donor PAN (if Applicable) :</span>
                <span class="dotted-line pan-val">${donorPan}</span>
              </div>` : ''}
            </div>

            <div class="currency-box">
              <span class="currency-symbol">₹</span>
              <span class="currency-amount">${formattedAmount} /-</span>
            </div>
          </div>
        </div>

        <div class="cert-footer">
          <div class="footer-left">
            <div class="donor-copy-badge">DONOR COPY</div>
          </div>

          <div class="footer-center">
            <div class="gratitude-pill">Thanks You for Your Generous Donation</div>
            <p class="gratitude-subtext">Your contribution helps us serve humanity.</p>
            <p class="terms-text">All donations are accepted subject to the rules and regulations of the Association.*</p>
          </div>

          <div class="footer-right">
            <h4 class="signatory-org">${orgName}</h4>
            <div class="signature-space"></div>
            <div class="signatory-line">
              <p class="signatory-title">Authorised Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
