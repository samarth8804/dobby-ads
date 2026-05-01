const safeFallback = "Something went wrong. Please try again.";

const rules = [
  {
    test: (raw) => raw.includes("e11000") || raw.includes("duplicate key"),
    message: "A folder with this name already exists in this location.",
  },
  {
    test: (raw) => raw.includes("folder already exists"),
    message: "A folder with this name already exists in this location.",
  },
  {
    test: (raw) => raw.includes("invalid credentials"),
    message: "Email or password is incorrect.",
  },
  {
    test: (raw) => raw.includes("no file uploaded"),
    message: "Please choose an image before uploading.",
  },
  {
    test: (raw) => raw.includes("network error"),
    message: "Network issue detected. Check your connection and retry.",
  },
  {
    test: (raw) => raw.includes("not found"),
    message: "The requested item was not found.",
  },
  {
    test: (raw) => raw.includes("unauthorized") || raw.includes("jwt"),
    message: "Your session has expired. Please log in again.",
  },
];

export const getApiErrorMessage = (error, fallback = safeFallback) => {
  const raw = String(error?.response?.data?.message || error?.message || "")
    .toLowerCase()
    .trim();

  if (!raw) return fallback;

  const mapped = rules.find((rule) => rule.test(raw));
  if (mapped) return mapped.message;

  if (raw.length > 120 || raw.includes("mongodb") || raw.includes("stack")) {
    return fallback;
  }

  return error?.response?.data?.message || fallback;
};
