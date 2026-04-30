import axiosInstance from "./axios";

const FOLDERS_BASE = "/folders";

// Get folders (with optional parentId filter) - returns folder data with size
export const getFolders = (parentId = null) => {
  const params = parentId ? { parentId } : {};
  return axiosInstance.get(FOLDERS_BASE, { params });
};

// Create folder
export const createFolder = (folderData) => {
  return axiosInstance.post(FOLDERS_BASE, folderData);
};

// Delete folder
export const deleteFolder = (folderId) => {
  return axiosInstance.delete(`${FOLDERS_BASE}/${folderId}`);
};
