import { NextRequest, NextResponse } from "next/server";
import { getBrowser } from "@/src/lib/certificate/getBrowser";
import { generateCertificateHtml } from "@/src/lib/certificate/generateCertificateHtml";
import { DonationReceipt } from "@/src/types/web/receipt";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let browser = null;
  try {
    const body = await req.json();
    const { receipt, format = "png" } = body as {
      receipt: DonationReceipt;
      format?: "pdf" | "png";
    };

    if (!receipt) {
      return NextResponse.json(
        { error: "Receipt data is required." },
        { status: 400 }
      );
    }

    const html = generateCertificateHtml(receipt);

    browser = await getBrowser();
    const page = await browser.newPage();

    await page.setViewport({
      width: 880,
      height: 520,
      deviceScaleFactor: 2,
    });

    await page.setContent(html, {
      waitUntil: "load",
    });

    await page.evaluateHandle("document.fonts.ready");

    const receiptId =
      receipt.receiptNumber || receipt.paymentId || "receipt";
    const safeReceiptId = receiptId.replace(/[^a-zA-Z0-9_-]/g, "_");

    if (format === "pdf") {
      const pdfBuffer = await page.pdf({
        width: "880px",
        height: "520px",
        printBackground: true,
        pageRanges: "1",
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });

      const filename = `YUWA-India-Donation-Receipt-${safeReceiptId}.pdf`;

      return new Response(Buffer.from(pdfBuffer) as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-store, max-age=0",
        },
      });
    } else {
      const pngBuffer = await page.screenshot({
        type: "png",
        clip: { x: 0, y: 0, width: 880, height: 520 },
      });

      const filename = `YUWA-India-Donation-Receipt-${safeReceiptId}.png`;

      return new Response(Buffer.from(pngBuffer) as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }
  } catch (error: any) {
    console.error("Donation certificate export error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate certificate export.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
