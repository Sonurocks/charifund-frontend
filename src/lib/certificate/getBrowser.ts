import puppeteer, { Browser } from "puppeteer-core";
import fs from "fs";

export async function getBrowser(): Promise<Browser> {
  const isServerless =
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_VERSION) ||
    (process.env.NODE_ENV === "production" && process.platform !== "win32");

  if (isServerless && process.platform !== "win32") {
    const chromium = (await import("@sparticuz/chromium")).default;
    return await puppeteer.launch({
      args: [...chromium.args, "--font-render-hinting=none"],
      defaultViewport: { width: 880, height: 520, deviceScaleFactor: 2 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const candidatePaths = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ];

  let executablePath = candidatePaths.find((p) => {
    try {
      return fs.existsSync(p);
    } catch {
      return false;
    }
  });

  if (!executablePath && process.env.CHROME_BIN) {
    executablePath = process.env.CHROME_BIN;
  }

  if (!executablePath) {
    throw new Error(
      "No supported Chrome or Edge browser executable found on local machine. Please install Google Chrome or set CHROME_BIN."
    );
  }

  return await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--font-render-hinting=none",
    ],
    defaultViewport: { width: 880, height: 520, deviceScaleFactor: 2 },
    executablePath,
    headless: true,
  });
}
