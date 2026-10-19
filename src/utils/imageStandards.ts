/**
 * Dynamic Image Management & Optimization Standards
 * ----------------------------------------------------
 * Standard definitions, file-size limits, dimension constraints,
 * and Cloudinary dynamic transformation pipeline for YUWA India.
 */

export interface ImageStandard {
  id: "banner" | "campaign" | "blog" | "event" | "member" | "sponsor" | "feedback" | "general";
  label: string;
  description: string;
  recommendedWidth: number;
  recommendedHeight: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  aspectRatio: string;
  maxSizeKB: number;
  recommendedSizeKB: string;
  acceptedFormats: string[];
  formatLabel: string;
  qualityTarget: number;
}

export const IMAGE_STANDARDS: Record<string, ImageStandard> = {
  banner: {
    id: "banner",
    label: "Page & Hero Banner",
    description: "Full-width hero carousel and header banner displays across desktop and mobile devices",
    recommendedWidth: 1920,
    recommendedHeight: 800,
    minWidth: 1024,
    minHeight: 400,
    maxWidth: 3840,
    maxHeight: 1600,
    aspectRatio: "16:9 / 2.4:1",
    maxSizeKB: 800,
    recommendedSizeKB: "250 – 500 KB",
    acceptedFormats: ["image/webp", "image/jpeg", "image/jpg", "image/png", "image/avif"],
    formatLabel: "WebP, JPG, PNG, AVIF",
    qualityTarget: 80,
  },
  campaign: {
    id: "campaign",
    label: "Campaign Feature & Gallery",
    description: "Featured campaign cards, detail hero banners, and gallery previews",
    recommendedWidth: 1200,
    recommendedHeight: 800,
    minWidth: 600,
    minHeight: 400,
    maxWidth: 2400,
    maxHeight: 1600,
    aspectRatio: "3:2",
    maxSizeKB: 500,
    recommendedSizeKB: "150 – 300 KB",
    acceptedFormats: ["image/webp", "image/jpeg", "image/jpg", "image/png"],
    formatLabel: "WebP, JPG, PNG",
    qualityTarget: 80,
  },
  blog: {
    id: "blog",
    label: "Blog Cover & Content",
    description: "Featured article thumbnails, editorial headers, and story illustrations",
    recommendedWidth: 1200,
    recommendedHeight: 675,
    minWidth: 600,
    minHeight: 338,
    maxWidth: 2400,
    maxHeight: 1350,
    aspectRatio: "16:9",
    maxSizeKB: 500,
    recommendedSizeKB: "150 – 300 KB",
    acceptedFormats: ["image/webp", "image/jpeg", "image/jpg", "image/png"],
    formatLabel: "WebP, JPG, PNG",
    qualityTarget: 80,
  },
  event: {
    id: "event",
    label: "Event Cover & Gallery",
    description: "Community activity cards, schedule banners, and activity highlights",
    recommendedWidth: 1200,
    recommendedHeight: 675,
    minWidth: 600,
    minHeight: 338,
    maxWidth: 2400,
    maxHeight: 1350,
    aspectRatio: "16:9",
    maxSizeKB: 500,
    recommendedSizeKB: "150 – 300 KB",
    acceptedFormats: ["image/webp", "image/jpeg", "image/jpg", "image/png"],
    formatLabel: "WebP, JPG, PNG",
    qualityTarget: 80,
  },
  member: {
    id: "member",
    label: "Team & Volunteer Profile",
    description: "Staff and volunteer portrait headshots with crisp square or portrait cropping",
    recommendedWidth: 600,
    recommendedHeight: 600,
    minWidth: 300,
    minHeight: 300,
    maxWidth: 1200,
    maxHeight: 1200,
    aspectRatio: "1:1 Square (or 3:4)",
    maxSizeKB: 250,
    recommendedSizeKB: "60 – 150 KB",
    acceptedFormats: ["image/webp", "image/jpeg", "image/jpg", "image/png"],
    formatLabel: "WebP, JPG, PNG",
    qualityTarget: 82,
  },
  sponsor: {
    id: "sponsor",
    label: "Sponsor & Partner Logo",
    description: "Corporate partner and sponsor brand logos on transparent or clean backgrounds",
    recommendedWidth: 400,
    recommendedHeight: 200,
    minWidth: 200,
    minHeight: 100,
    maxWidth: 1000,
    maxHeight: 600,
    aspectRatio: "2:1 Wide / 1:1 Square",
    maxSizeKB: 200,
    recommendedSizeKB: "30 – 100 KB",
    acceptedFormats: ["image/webp", "image/png", "image/svg+xml", "image/jpeg", "image/jpg"],
    formatLabel: "WebP, SVG, PNG",
    qualityTarget: 85,
  },
  feedback: {
    id: "feedback",
    label: "Testimonial Avatar",
    description: "Customer and beneficiary testimonial reviewer avatar",
    recommendedWidth: 300,
    recommendedHeight: 300,
    minWidth: 100,
    minHeight: 100,
    maxWidth: 800,
    maxHeight: 800,
    aspectRatio: "1:1 Square",
    maxSizeKB: 150,
    recommendedSizeKB: "30 – 80 KB",
    acceptedFormats: ["image/webp", "image/jpeg", "image/jpg", "image/png"],
    formatLabel: "WebP, JPG, PNG",
    qualityTarget: 80,
  },
  general: {
    id: "general",
    label: "Standard Image Asset",
    description: "Standard website illustration or supporting content graphic",
    recommendedWidth: 800,
    recommendedHeight: 600,
    minWidth: 400,
    minHeight: 300,
    maxWidth: 1920,
    maxHeight: 1440,
    aspectRatio: "4:3 / 16:9",
    maxSizeKB: 500,
    recommendedSizeKB: "150 – 300 KB",
    acceptedFormats: ["image/webp", "image/jpeg", "image/jpg", "image/png"],
    formatLabel: "WebP, JPG, PNG",
    qualityTarget: 80,
  },
};

/**
 * Format bytes to readable string (e.g. 450 KB, 1.2 MB)
 */
export const formatBytes = (bytes: number, decimals: number = 1): string => {
  if (!bytes || bytes === 0) return "0 KB";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Reads image dimensions in browser asynchronously with timeout and safety guards
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !file.type.startsWith("image/")) {
      resolve({ width: 0, height: 0 });
      return;
    }

    let objectUrl = "";
    try {
      objectUrl = URL.createObjectURL(file);
    } catch {
      reject(new Error(`Failed to create object URL for "${file.name}".`));
      return;
    }

    const img = new window.Image();
    let settled = false;

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {}
        reject(new Error(`Timed out decoding image "${file.name}".`));
      }
    }, 6000);

    img.onload = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {}
        resolve({ width, height });
      }
    };

    img.onerror = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {}
        reject(new Error(`Failed to decode image "${file.name}". File may be corrupted or unsupported.`));
      }
    };

    img.src = objectUrl;
  });
};

/**
 * Helper to inspect SVG dimensions if natural dimensions are not directly available from raster rendering
 */
export const getSvgDimensions = async (file: File): Promise<{ width: number; height: number }> => {
  try {
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "image/svg+xml");
    if (doc.querySelector("parsererror")) {
      return { width: 0, height: 0 };
    }
    const svg = doc.querySelector("svg");
    if (!svg) return { width: 0, height: 0 };

    let w = parseFloat(svg.getAttribute("width") || "0");
    let h = parseFloat(svg.getAttribute("height") || "0");

    if ((!w || !h) && svg.getAttribute("viewBox")) {
      const parts = svg.getAttribute("viewBox")!.trim().split(/[\s,]+/);
      if (parts.length === 4) {
        w = parseFloat(parts[2]);
        h = parseFloat(parts[3]);
      }
    }
    return { width: isNaN(w) ? 0 : w, height: isNaN(h) ? 0 : h };
  } catch {
    return { width: 0, height: 0 };
  }
};

/**
 * Comprehensive client-side image file validator against defined standards.
 * Strictly verifies real width and height, minimum resolution, maximum limits,
 * file size, and file format. Rejects corrupted or dimension-violating files.
 */
export const validateImageFile = async (
  file: File,
  standard: ImageStandard = IMAGE_STANDARDS.general
): Promise<{
  valid: boolean;
  error?: string;
  warning?: string;
  width: number;
  height: number;
  sizeKB: number;
}> => {
  const sizeKB = Math.round(file.size / 1024);

  // 1. Validate format
  const isFormatAllowed = standard.acceptedFormats.some((fmt) => {
    if (fmt === file.type) return true;
    if (fmt.includes("jpeg") && (file.type === "image/jpeg" || file.type === "image/jpg")) return true;
    return false;
  });

  if (!isFormatAllowed) {
    return {
      valid: false,
      error: `Unsupported format (${file.type || "unknown"}). Allowed: ${standard.formatLabel}.`,
      width: 0,
      height: 0,
      sizeKB,
    };
  }

  // 2. Validate max file size
  if (sizeKB > standard.maxSizeKB) {
    return {
      valid: false,
      error: `File size (${formatBytes(file.size)}) exceeds ${standard.maxSizeKB} KB limit.`,
      width: 0,
      height: 0,
      sizeKB,
    };
  }

  // 3. Inspect real decoded dimensions (browser environment)
  let dimensions = { width: 0, height: 0 };

  if (typeof window !== "undefined") {
    try {
      if (file.type === "image/svg+xml") {
        const text = await file.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        if (doc.querySelector("parsererror")) {
          return {
            valid: false,
            error: `Corrupted or invalid SVG file.`,
            width: 0,
            height: 0,
            sizeKB,
          };
        }
        dimensions = await getImageDimensions(file);
        if (dimensions.width === 0 || dimensions.height === 0) {
          dimensions = await getSvgDimensions(file);
        }
      } else {
        dimensions = await getImageDimensions(file);
      }
    } catch {
      return {
        valid: false,
        error: `Corrupted or unreadable image file.`,
        width: 0,
        height: 0,
        sizeKB,
      };
    }

    // Corrupted / 0-dimension check for raster images
    if (file.type !== "image/svg+xml" && (dimensions.width <= 0 || dimensions.height <= 0)) {
      return {
        valid: false,
        error: `Invalid image dimensions (${dimensions.width}×${dimensions.height}px).`,
        width: dimensions.width,
        height: dimensions.height,
        sizeKB,
      };
    }

    // 4. Validate minimum resolution (Hard constraint)
    const isBelowMinWidth = standard.minWidth && dimensions.width > 0 && dimensions.width < standard.minWidth;
    const isBelowMinHeight = standard.minHeight && dimensions.height > 0 && dimensions.height < standard.minHeight;

    if (isBelowMinWidth || isBelowMinHeight) {
      return {
        valid: false,
        error: `Image is too small (${dimensions.width}×${dimensions.height}px). Min required: ${standard.minWidth || standard.recommendedWidth}×${standard.minHeight || standard.recommendedHeight}px.`,
        width: dimensions.width,
        height: dimensions.height,
        sizeKB,
      };
    }

    // 5. Validate maximum dimensions (Hard constraint)
    const isAboveMaxWidth = standard.maxWidth && dimensions.width > standard.maxWidth;
    const isAboveMaxHeight = standard.maxHeight && dimensions.height > standard.maxHeight;

    if (isAboveMaxWidth || isAboveMaxHeight) {
      return {
        valid: false,
        error: `Image is too large (${dimensions.width}×${dimensions.height}px). Max allowed: ${standard.maxWidth || standard.recommendedWidth}×${standard.maxHeight || standard.recommendedHeight}px.`,
        width: dimensions.width,
        height: dimensions.height,
        sizeKB,
      };
    }
  }

  return {
    valid: true,
    width: dimensions.width,
    height: dimensions.height,
    sizeKB,
  };
};

/**
 * Transforms Cloudinary URLs dynamically into optimized, responsive variants.
 * Injects automatic format negotiation (f_auto), automatic quality (q_auto),
 * and dimension constraints (w_<width>, c_limit) without duplicate segments.
 *
 * If the URL is already local or from a non-Cloudinary host, it is returned intact.
 */
export const getOptimizedImageUrl = (
  src: string | undefined | null,
  options?: {
    width?: number;
    height?: number;
    quality?: string | number;
    format?: string;
    crop?: "limit" | "fill" | "fit" | "scale" | "thumb";
  }
): string => {
  const FALLBACK_IMAGE = "/assets/aboutus.webp";

  if (!src || typeof src !== "string" || !src.trim()) {
    return FALLBACK_IMAGE;
  }

  // Check if this is a Cloudinary URL
  if (!src.includes("res.cloudinary.com") || !src.includes("/image/upload/")) {
    return src;
  }

  const {
    width,
    height,
    quality = "auto",
    format = "auto",
    crop = "limit",
  } = options || {};

  // Build target optimization parameters
  const targetParams: string[] = [];
  if (format) targetParams.push(`f_${format}`);
  if (quality) targetParams.push(`q_${quality}`);
  if (width) targetParams.push(`w_${width}`);
  if (height) targetParams.push(`h_${height}`);
  if (width || height) targetParams.push(`c_${crop}`);

  // Split at /image/upload/
  const uploadIndex = src.indexOf("/image/upload/");
  if (uploadIndex === -1) return src;

  const prefix = src.substring(0, uploadIndex + "/image/upload/".length);
  let rest = src.substring(uploadIndex + "/image/upload/".length);

  // Preserve query string if present (e.g., ?token=...)
  let query = "";
  const queryIndex = rest.indexOf("?");
  if (queryIndex !== -1) {
    query = rest.substring(queryIndex);
    rest = rest.substring(0, queryIndex);
  }

  // Split path into segments
  const segments = rest.split("/").filter(Boolean);

  // Helper checks for Cloudinary transformation components
  const isTransformParam = (part: string) => /^[a-z]{1,3}_[a-zA-Z0-9:._-]+$/i.test(part);
  const isVersion = (seg: string) => /^v\d+$/i.test(seg);
  const hasFileExt = (seg: string) => /\.[a-zA-Z0-9]+$/i.test(seg);

  const isTransformSegment = (seg: string) => {
    if (isVersion(seg) || hasFileExt(seg)) return false;
    const parts = seg.split(",");
    return parts.length > 0 && parts.every((p) => isTransformParam(p));
  };

  // Identify all leading transformation segments before the version or asset path
  let transformSegmentCount = 0;
  const existingParams: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (isVersion(seg) || hasFileExt(seg)) {
      break;
    }
    if (isTransformSegment(seg)) {
      transformSegmentCount++;
      existingParams.push(...seg.split(","));
    } else {
      break;
    }
  }

  // Remaining path after stripping transformation segments
  const assetPath = segments.slice(transformSegmentCount).join("/");

  // Determine which parameters we override vs preserve
  const overriddenPrefixes = new Set<string>();
  if (format) overriddenPrefixes.add("f_");
  if (quality) overriddenPrefixes.add("q_");
  if (width) overriddenPrefixes.add("w_");
  if (height) overriddenPrefixes.add("h_");
  if (width || height || crop) overriddenPrefixes.add("c_");

  const preservedCustomParams = existingParams.filter((p) => {
    const prefix2 = p.substring(0, 2);
    const prefix3 = p.substring(0, 3);
    return !overriddenPrefixes.has(prefix2) && !overriddenPrefixes.has(prefix3);
  });

  const finalTransforms = [...targetParams, ...preservedCustomParams].join(",");

  return `${prefix}${finalTransforms}/${assetPath}${query}`;
};
