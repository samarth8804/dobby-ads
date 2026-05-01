import { useState, useEffect, useMemo } from "react";
import * as folderApi from "../api/folder.api";
import * as imageApi from "../api/image.api";
import { useSelector } from "react-redux";

const useDashboardData = () => {
  const { user } = useSelector((state) => state.auth);

  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [currentFolder, setCurrentFolder] = useState({});
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFolderId, setCurrentFolderId] = useState(null);

  const stats = useMemo(() => {
    const foldersCount = folders.length;
    const imagesCount = images.length;
    const folderSize = Number(currentFolder?.size || 0);

    return {
      foldersCount,
      imagesCount,
      size: folderSize,
    };
  }, [folders, images, currentFolder]);

  const fetchFolderData = async (parentId = null) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await folderApi.getFolders(parentId);
      const foldersData = response?.data?.folders || [];
      const imagesData = response?.data?.images || [];
      const currentFolder = response?.data?.currentFolder || {};

      setFolders(foldersData);
      setImages(imagesData);
      setCurrentFolder(currentFolder);
      setCurrentFolderId(parentId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load folder data");
    } finally {
      setIsLoading(false);
    }
  };

  const openFolder = async (folder) => {
    const nextCrumbs = [...breadcrumbs, { _id: folder._id, name: folder.name }];
    setBreadcrumbs(nextCrumbs);
    await fetchFolderData(folder._id);
  };

  const goToRoot = async () => {
    setBreadcrumbs([]);
    await fetchFolderData(null);
  };

  const goToBreadcrumb = async (folderId) => {
    const index = breadcrumbs.findIndex((crumb) => crumb._id === folderId);
    const nextCrumbs = index >= 0 ? breadcrumbs.slice(0, index + 1) : [];
    setBreadcrumbs(nextCrumbs);
    await fetchFolderData(folderId);
  };

  const createNewFolder = async (name) => {
    const response = await folderApi.createFolder({
      name,
      parentId: currentFolderId || undefined,
    });
    await fetchFolderData(currentFolderId);
    return response.data;
  };

  const deleteFolder = async (folderId) => {
    await folderApi.deleteFolder(folderId);
    await fetchFolderData(currentFolderId);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folderId", currentFolderId || "");

    const response = await imageApi.uploadImage(formData);
    await fetchFolderData(currentFolderId);
    return response.data;
  };

  const deleteImage = async (imageId) => {
    await imageApi.deleteImage(imageId);
    await fetchFolderData(currentFolderId);
  };

  useEffect(() => {
    fetchFolderData();
  }, []);

  return {
    user,
    folders,
    images,
    breadcrumbs,
    stats,
    isLoading,
    error,
    currentFolderId,
    fetchFolderData,
    openFolder,
    goToRoot,
    goToBreadcrumb,
    createNewFolder,
    deleteFolder,
    uploadImage,
    deleteImage,
  };
};

export default useDashboardData;
