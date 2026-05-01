import axiosInstance from "./axios";

const IMAGES_BASE = "/image";

// Upload image
export const uploadImage = (formData) => {
  return axiosInstance.post(IMAGES_BASE, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete image
export const deleteImage = (imageId) => {
  return axiosInstance.delete(`${IMAGES_BASE}/${imageId}`);
};
