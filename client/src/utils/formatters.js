export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const truncateText = (text, length = 20) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};
