import axiosInstance from "./axios";

const IMAGES_BASE = "/images";

// Upload image
export const uploadImage = (formData) => {
  return axiosInstance.post(`${IMAGES_BASE}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete image
export const deleteImage = (imageId) => {
  return axiosInstance.delete(`${IMAGES_BASE}/${imageId}`);
};
