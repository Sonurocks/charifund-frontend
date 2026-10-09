export const getApiErrorMessage = (error: unknown, fallbackMessage: string = "Something went wrong. Please try again."): string => {
  if (typeof error === "object" && error !== null) {
    const err = error as any;
    
    // Most standard API message responses
    if (err.response?.data?.message) {
      return err.response.data.message;
    }
    
    // Nested error object
    if (err.response?.data?.error?.message) {
      return err.response.data.error.message;
    }

    // Axios native message (Network errors, timeouts)
    if (err.message && !err.response) {
      if (err.message === "Network Error") return "Unable to connect to the server. Please check your connection.";
      return err.message;
    }
  }

  return fallbackMessage;
};

export const getApiSuccessMessage = (data: unknown, fallbackMessage: string = "Operation completed successfully"): string => {
  if (typeof data === "object" && data !== null) {
    const response = data as any;
    
    if (response?.message) {
      return response.message;
    }
    
    if (response?.data?.message) {
      return response.data.message;
    }
  }
  return fallbackMessage;
};
