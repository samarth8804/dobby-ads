import { useState } from "react";
import { FiFolder, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";
import FolderCard from "../components/FolderCard";
import ImageCard from "../components/ImageCard";
import CreateFolderModal from "../components/CreateFolderModal";
import UploadButton from "../components/UploadButton";
import ConfirmModal from "../components/ConfirmModal";
import Loader from "../components/Loader";
import useDashboardData from "../hooks/useDashboardData";
import { formatSize } from "../utils/formatSize";

const Dashboard = () => {
  const {
    user,
    folders,
    images,
    breadcrumbs,
    stats,
    isLoading,
    error,
    fetchFolderData,
    openFolder,
    goToRoot,
    goToBreadcrumb,
    createNewFolder,
    deleteFolder,
    uploadImage,
    deleteImage,
  } = useDashboardData();

  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenFolder = (folderId) => {
    fetchFolderData(folderId);
  };

  const handleCreateFolder = async (name) => {
    try {
      await createNewFolder(name);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteClick = (id, name, type = "folder") => {
    setDeleteTarget({ id, name, type });
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      if (deleteTarget.type === "folder") {
        await deleteFolder(deleteTarget.id);
        toast.success("Folder deleted successfully.");
      } else {
        await deleteImage(deleteTarget.id);
        toast.success("Image deleted successfully.");
      }
      setIsDeleteConfirmOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Failed to delete ${deleteTarget.type}.`,
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUploadImage = async (file) => {
    try {
      await uploadImage(file);
    } catch (error) {
      throw error;
    }
  };

  const handleBreadcrumbNavigate = async (folderId) => {
    if (!folderId) {
      await goToRoot();
      return;
    }
    await goToBreadcrumb(folderId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50">
        <Navbar />
        <div className="grid min-h-[calc(100vh-80px)] place-items-center">
          <Loader label="Loading your dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 text-gray-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-950 sm:text-4xl">
            Hi, {user?.username}
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome back to your Drive Dashboard
          </p>
        </div>

        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs
            breadcrumbs={breadcrumbs}
            onNavigate={handleBreadcrumbNavigate}
          />
        </div>

        {/* Stats Section */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-amber-200 bg-white p-5 sm:p-6">
            <div className="text-sm text-gray-600">Subfolders</div>
            <div className="mt-2 text-2xl font-bold text-amber-950 sm:text-3xl">
              {stats.foldersCount || 0}
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-white p-5 sm:p-6">
            <div className="text-sm text-gray-600">Images</div>
            <div className="mt-2 text-2xl font-bold text-amber-950 sm:text-3xl">
              {stats.imagesCount || 0}
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-white p-5 sm:p-6">
            <div className="text-sm text-gray-600">Storage Used</div>
            <div className="mt-2 text-2xl font-bold text-amber-950 sm:text-3xl">
              {formatSize(stats.size || 0)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => setIsCreateFolderOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-4 py-2.5 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-50 sm:px-6"
          >
            <FiPlus className="h-4 w-4" />
            <span className="hidden sm:inline">New Folder</span>
            <span className="sm:hidden">Folder</span>
          </button>

          <UploadButton onUpload={handleUploadImage} isLoading={isLoading} />
        </div>

        {/* Content Section */}
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => fetchFolderData()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : folders.length === 0 && images.length === 0 ? (
          <div className="rounded-xl border border-amber-200 bg-white p-12 text-center">
            <FiFolder className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">This folder is empty</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Folders Section */}
            {folders.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-amber-950">
                  Folders
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {folders.map((folder) => (
                    <FolderCard
                      key={folder._id}
                      folder={folder}
                      onOpen={() => openFolder(folder)}
                      onDelete={() =>
                        handleDeleteClick(folder._id, folder.name, "folder")
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Images Section */}
            {images.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-amber-950">
                  Images
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {images.map((image) => (
                    <ImageCard
                      key={image._id}
                      image={image}
                      onDelete={() =>
                        handleDeleteClick(image._id, image.name, "image")
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onSubmit={handleCreateFolder}
        isLoading={isLoading}
      />

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title={`Delete ${deleteTarget?.type}?`}
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setDeleteTarget(null);
        }}
        isLoading={isDeleting}
        isDanger
      />
      <footer className="border-t border-amber-200 bg-white">
        {" "}
        <div className="mx-auto max-w-7xl px-6 py-6 sm:py-8 text-center">
          {" "}
          <p className="mb-2 text-xs sm:text-sm text-gray-600">
            {" "}
            &copy; {new Date().getFullYear()} Dobby Drive. All rights
            reserved.{" "}
          </p>{" "}
          <p className="text-xs text-gray-500">
            {" "}
            Built with React • Tailwind CSS • Node.js • MongoDB{" "}
          </p>{" "}
        </div>{" "}
      </footer>
    </div>
  );
};

export default Dashboard;
