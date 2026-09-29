import * as Yup from "yup";
import i18n from "i18next";

// Existing schemas here...


export const DetailsformSchema = Yup.object().shape({
  firstName: Yup.string().min(2, "First name is required").required(),
  lastName: Yup.string().min(2, "Last name is required").required(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().matches(/^\d{10}$/, "Phone must be exactly 10 digits").required(),
  address: Yup.string().min(5, "Address is required").required(),
  message: Yup.string().required("Message is required"),
});
export type DetailsFormValues = Yup.InferType<typeof DetailsformSchema>;



export const NewsletterEmailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
});
export type NewsletterEmailValues = Yup.InferType<typeof NewsletterEmailSchema>;




export type FormValues = Yup.InferType<typeof DetailsformSchema>;

export const SendMsgformSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required(),
  phone: Yup.string().length(10, "Phone must be exactly 10 digits").required(),
  address: Yup.string().min(5, "Address is required").required(),
  message: Yup.string().min(20, "Message must be of 20 Words").required("Message is required"),
});

export type SendMsgFormValues = Yup.InferType<typeof SendMsgformSchema>;

export const CommentReplySchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required(),
  name: Yup.string().required("Name is required"),
  comment: Yup.string().min(2, "Comment must be of atleast 2 Words").required("Reply is required"),
});

export type CommentReplyFormValues = Yup.InferType<typeof CommentReplySchema>;

export const LeaveCommentSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required(),
  name: Yup.string().required("Name is required"),
  comment: Yup.string().min(2, "Comment must be of atleast 2 Words").required("Reply is required"),
});

export type LeaveCommentFormValues = Yup.InferType<typeof LeaveCommentSchema>;

export const volunteerSchema = Yup.object().shape({
  firstName: Yup.string().required(i18n.t("First Name is required")),
  lastName: Yup.string().required(i18n.t("Last Name is required")),
  email: Yup.string().email(i18n.t("Invalid email")).required(i18n.t("Email is required")),
  phone: Yup.string().matches(/^\d{10}$/, i18n.t("Phone must be exactly 10 digits")).required(i18n.t("Phone is required")),
  occupation: Yup.string().required(i18n.t("Occupation is required")),
  message: Yup.string().required(i18n.t("Message is required")),
});

export type VolunteerValues = Yup.InferType<typeof volunteerSchema>;

export const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
});

export type loginValues = Yup.InferType<typeof loginSchema>;

// ======================= Register validation  =======================
export const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone must be digits only")
    .min(10, "Phone must be exactly 10 digits")
    .required("Phone is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export type registerValues = Yup.InferType<typeof registerSchema>;

// ======================= Campaign =======================

export const campaignSchema = Yup.object({

  title: Yup.object({
    en: Yup.string().required("Title is required in English"),
    hi: Yup.string().required("शीर्षक हिंदी में होना आवश्यक है"),
  }),
  category: Yup.object({
    en: Yup.string().required("Category is required"),
    hi: Yup.string().required("श्रेणी आवश्यक है"),
  }),
  description: Yup.object({
    en: Yup.string().required("Description is required"),
    hi: Yup.string().required("विवरण आवश्यक है"),
  }),
  goalAmount: Yup.number().min(1, "Goal must be at least 1").required().required("Goal Amount is required"),
  summary: Yup.object({
    en: Yup.string().required("Summary is required"),
    hi: Yup.string().required("सारांश आवश्यक है"),
  }),
  keyPoints: Yup.object({
    en: Yup.array()
      .of(Yup.string().required("Key point in English is required"))
      .min(1, "Add at least one key point in English")
      .required("English key points are required"),

    hi: Yup.array()
      .of(Yup.string().required("मुख्य बिंदु हिंदी में आवश्यक है"))
      .min(1, "कम से कम एक मुख्य बिंदु हिंदी में जोड़ें")
      .required("हिंदी मुख्य बिंदु आवश्यक हैं"),
  }).required("मुख्य बिंदु दोनों भाषाओं में आवश्यक हैं"),
  images: Yup.array()
    .of(Yup.mixed())
    .default([]),
  existingImages: Yup.array().of(Yup.string().nullable()).default([]),
  _combinedImagesGuard: Yup.mixed().test(
    "at-least-one-image",
    "At least one image is required",
    function () {
      const { images, existingImages } = this.parent as any;
      const hasFiles = Array.isArray(images) && images.length > 0;
      const hasUrls = Array.isArray(existingImages) && existingImages.filter(Boolean).length > 0;
      return hasFiles || hasUrls;
    }
  ),
  location: Yup.object({
    en: Yup.string().required("Location is required"),
    hi: Yup.string().required("स्थान आवश्यक है"),
  }),
});


export type CampaignFormValues = Yup.InferType<typeof campaignSchema>;

// ======================= Event =======================

export const EventSchema = Yup.object({

  title: Yup.object({
    en: Yup.string().required("Title is required in English"),
    hi: Yup.string().required("शीर्षक हिंदी में होना आवश्यक है"),
  }),
  description: Yup.object({
    en: Yup.string().required("Description is required"),
    hi: Yup.string().required("विवरण आवश्यक है"),
  }),
  summary: Yup.object({
    en: Yup.string().required("Summary is required"),
    hi: Yup.string().required("सारांश आवश्यक है"),
  }),
  startDate: Yup.date().nullable().required("Start date is required"),
  startTime: Yup.date().nullable().required("Start time is required") ,
  endDate: Yup.date().nullable().required("End date is required"),
  endTime: Yup.date().nullable().required("End time is required"),
  keyPoints: Yup.object({
    en: Yup.array()
      .of(Yup.string().required("Key point in English is required"))
      .min(1, "Add at least one key point in English")
      .required("English key points are required"),

    hi: Yup.array()
      .of(Yup.string().required("मुख्य बिंदु हिंदी में आवश्यक है"))
      .min(1, "कम से कम एक मुख्य बिंदु हिंदी में जोड़ें")
      .required("हिंदी मुख्य बिंदु आवश्यक हैं"),
  }).required("मुख्य बिंदु दोनों भाषाओं में आवश्यक हैं"),
  images: Yup.array()
    .of(Yup.mixed().required("Image is required"))
    .min(1, "At least one image is required"),
  location: Yup.object({
    en: Yup.string().required("Location is required"),
    hi: Yup.string().required("स्थान आवश्यक है"),
  }),
  latitude: Yup.number().nullable().required("latitude is required"),
  longitude: Yup.number().nullable().required("Longitude is required"),
});


export type EventFormValues = Yup.InferType<typeof EventSchema>;

// ======================= Category =======================
export const categorySchema = Yup.object({
  name: Yup.object({
    en: Yup.string().required("Category name is required in English"),
    hi: Yup.string().required("Category name is required in Hindi"),
  }).required("Category name is required in both languages"),
});

export type CategoryFormValues = Yup.InferType<typeof categorySchema>;



// ======================= Blog ======================
export const blogSchema = Yup.object({
  title: Yup.object({
    en: Yup.string().required("Title is required in English"),
    hi: Yup.string().required("Title is required in Hindi"),
  }),
  creator: Yup.object({
    en: Yup.string().required("Creator is required in English"),
    hi: Yup.string().required("Creator is required in Hindi"),
  }),
  description: Yup.object({
    en: Yup.string().required("Description is required in English"),
    hi: Yup.string().required("Description is required in Hindi"),
  }),
  summary: Yup.object({
    en: Yup.string().required("Summary is required in English"),
    hi: Yup.string().required("Summary is required in Hindi"),
  }),
  quote: Yup.object({
    en: Yup.string().required("Quote is required in English"),
    hi: Yup.string().required("Quote is required in Hindi"),
  }),
  quoteAuthor: Yup.object({
    en: Yup.string().required("Quote Author is required in English"),
    hi: Yup.string().required("Quote Author is required in Hindi"),
  }),
  tags: Yup.object({
    en: Yup.array()
      .of(Yup.string().required("Tag cannot be empty in English"))
      .min(1, "Add at least one tag in English")
      .required("English tags are required"),
    hi: Yup.array()
      .of(Yup.string().required("Tag cannot be empty in Hindi"))
      .min(1, "Add at least one tag in Hindi")
      .required("Hindi tags are required"),
  }).required("Tags are required in both languages"),
  keyPoints: Yup.object({
    en: Yup.array()
      .of(Yup.string().required("Key point in English is required"))
      .min(1, "Add at least one key point in English")
      .required("English key points are required"),

    hi: Yup.array()
      .of(Yup.string().required("Key point in Hindi is required"))
      .min(1, "Add at least one key point in Hindi")
      .required("Hindi key points are required"),
  }).required("Key points are required in both languages"),


  location: Yup.object({
    en: Yup.string().required("Location is required in English"),
    hi: Yup.string().required("Location is required in Hindi"),
  }).required(),

  category: Yup.object({
    en: Yup.string().required("Category is required in English"),
    hi: Yup.string().required("Category is required in Hindi"),
  }).required("Category is required"),
  images: Yup.array()
    .of(Yup.mixed())
    .default([]),
  existingImages: Yup.array().of(Yup.string().nullable()).default([]),
  _combinedImagesGuard: Yup.mixed().test(
    "at-least-one-image",
    "At least one image is required",
    function () {
      const { images, existingImages } = this.parent as any;
      const hasFiles = Array.isArray(images) && images.length > 0;
      const hasUrls = Array.isArray(existingImages) && existingImages.filter(Boolean).length > 0;
      return hasFiles || hasUrls;
    }
  ),
});



export type BlogFormValues = Yup.InferType<typeof blogSchema>;

// ======================= Comment =======================

export const commentSchema = Yup.object().shape({
  name: Yup.string().notRequired(),
  comment: Yup.string().notRequired(),
  email: Yup.string().notRequired(),
  status: Yup.string().required("Status is required"),
});

export type CommentFormValues = Yup.InferType<typeof commentSchema>;

// ======================= Banner ======================

export const bannerSchema = Yup.object().shape({
  title: Yup.object({
    en: Yup.string().required("Title is required in English"),
    hi: Yup.string().required("शीर्षक हिंदी में होना आवश्यक है"),
  }),
  subtitle: Yup.object({
    en: Yup.string().required("subtitle is required in English"),
    hi: Yup.string().required("उपशीर्षक हिंदी में होना आवश्यक है"),
  }),
  image: Yup.mixed()
    .test(
      "fileOrString",
      "Banner image is required",
      value => {
        if (typeof value === "string" && value.trim() !== "") return true;
        if (value instanceof File) return true;
        return false;
      }
    )
    .required("Banner image is required"),
  priority: Yup.number().required("priority is required"),
});

//  Inferred type from the schema
export type BannerFormValues = Yup.InferType<typeof bannerSchema>;


// ======================= Member ======================

export const memberSchema = Yup.object({
  name: Yup.object({
    en: Yup.string().required("Name is required in English"),
    hi: Yup.string().required("नाम हिंदी में आवश्यक है"),
  }),
  position: Yup.object({
    en: Yup.string().required("Position is required in English"),
    hi: Yup.string().required("पद हिंदी में आवश्यक है"),
  }),
  title: Yup.object({
    en: Yup.string().required("Title is required in English"),
    hi: Yup.string().required("शीर्षक हिंदी में आवश्यक है"),
  }),
  description: Yup.object({
    en: Yup.string().required("Description is required in English"),
    hi: Yup.string().required("विवरण हिंदी में आवश्यक है"),
  }),
  about: Yup.object({
    en: Yup.string().required("About is required in English"),
    hi: Yup.string().required("के बारे में जानकारी हिंदी में आवश्यक है"),
  }),
  keyPoints: Yup.object({
    en: Yup.array()
      .of(Yup.string().required("Key point in English is required"))
      .min(1, "At least one key point is required in English")
      .required("Key points in English are required"),
    hi: Yup.array()
      .of(Yup.string().required("मुख्य बिंदु हिंदी में आवश्यक है"))
      .min(1, "कम से कम एक मुख्य बिंदु हिंदी में आवश्यक है")
      .required("मुख्य बिंदु हिंदी में आवश्यक हैं"),
  }),
  image: Yup.mixed()
    .test(
      "fileOrString",
      "Image is required / छवि आवश्यक है",
      (value) => {
        if (typeof value === "string" && value.trim() !== "") return true;
        if (value instanceof File) return true;
        return false;
      }
    )
    .required("Image is required / छवि आवश्यक है"),
  facebookUrl: Yup.string()
    .url("Must be a valid URL / मान्य URL होना चाहिए")
    .optional()
    .nullable(),
  twitterUrl: Yup.string()
    .url("Must be a valid URL / मान्य URL होना चाहिए")
    .optional()
    .nullable(),
  instagramUrl: Yup.string()
    .url("Must be a valid URL / मान्य URL होना चाहिए")
    .optional()
    .nullable(),
  linkedInUrl: Yup.string()
    .url("Must be a valid URL / मान्य URL होना चाहिए")
    .optional()
    .nullable(),
  existingImages: Yup.array().of(Yup.string()),
});


export type MemberFormValues = Yup.InferType<typeof memberSchema>;


// ======================= Member ======================

export const QueryFormSchema = Yup.object().shape({
  isViewed: Yup.boolean().required("Status is required"),
});

export type QueryFormValues = Yup.InferType<typeof QueryFormSchema>;


// ======================= Feedback ======================

export const feedbackSchema = Yup.object({
  name: Yup.string().required(i18n.t("Name is required")),
  designation: Yup.string().required(i18n.t("Designation is required")),
  image: Yup.mixed().nullable().notRequired(),
  feedback: Yup.string().max(500, "Feedback must be 500 characters or less").required(i18n.t("Feedback is required")),
  rating: Yup.number()
    .min(1, "Please select a rating")
    .max(5, "Maximum rating is 5")
    .required(i18n.t("Rating is required")),
});

export type FeedbackFormValues = Yup.InferType<typeof feedbackSchema>;
