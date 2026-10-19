export const getApiErrorMessage = (error: unknown, fallbackMessage: string = "Something went wrong. Please try again."): string => {
  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }

  if (typeof error === "object" && error !== null) {
    const err = error as any;

    // Check if error response body is a raw string
    if (typeof err.response?.data === "string" && err.response.data.trim()) {
      return err.response.data.trim();
    }

    // Check data.msg (Common in Charifund / Express backends)
    if (typeof err.response?.data?.msg === "string" && err.response.data.msg.trim()) {
      return err.response.data.msg.trim();
    }
    
    // Most standard API message responses
    if (typeof err.response?.data?.message === "string" && err.response.data.message.trim()) {
      return err.response.data.message.trim();
    }
    
    // String error field
    if (typeof err.response?.data?.error === "string" && err.response.data.error.trim()) {
      return err.response.data.error.trim();
    }

    // Nested error object
    if (typeof err.response?.data?.error?.message === "string" && err.response.data.error.message.trim()) {
      return err.response.data.error.message.trim();
    }

    // Express-validator errors array: { errors: [{ msg: "...", message: "..." }] }
    if (Array.isArray(err.response?.data?.errors) && err.response.data.errors.length > 0) {
      const firstErr = err.response.data.errors[0];
      if (typeof firstErr === "string") return firstErr;
      if (typeof firstErr?.msg === "string") return firstErr.msg;
      if (typeof firstErr?.message === "string") return firstErr.message;
    }

    // HTTP Status based fallbacks when body has no readable message
    if (err.response?.status) {
      switch (err.response.status) {
        case 400:
          return "Bad request. Please check the provided information.";
        case 401:
          return "Your session has expired. Please log in again.";
        case 403:
          return "You do not have permission to perform this action.";
        case 404:
          return "The requested record was not found.";
        case 409:
          return "Conflict detected. This record may have already been updated.";
        case 422:
          return "Validation error. Please verify all required fields.";
        case 500:
        case 502:
        case 503:
          return "Server error occurred. Please try again shortly or contact support.";
      }
    }

    // Axios native message (Network errors, timeouts)
    if (err.message && !err.response) {
      if (err.message === "Network Error") return "Unable to connect to the server. Please check your connection.";
      if (err.code === "ECONNABORTED" || err.message.includes("timeout")) return "Request timed out. Please check your network and try again.";
      return err.message;
    }
  }

  return fallbackMessage;
};

export const getApiSuccessMessage = (data: unknown, fallbackMessage: string = "Operation completed successfully"): string => {
  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (typeof data === "object" && data !== null) {
    const response = data as any;
    
    if (typeof response?.msg === "string" && response.msg.trim()) {
      return response.msg.trim();
    }

    if (typeof response?.message === "string" && response.message.trim()) {
      return response.message.trim();
    }

    if (typeof response?.data === "string" && response.data.trim()) {
      return response.data.trim();
    }
    
    if (typeof response?.data?.msg === "string" && response.data.msg.trim()) {
      return response.data.msg.trim();
    }

    if (typeof response?.data?.message === "string" && response.data.message.trim()) {
      return response.data.message.trim();
    }
  }
  return fallbackMessage;
};
