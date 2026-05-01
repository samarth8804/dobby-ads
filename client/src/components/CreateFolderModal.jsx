import { useState } from "react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../utils/errorMessage";

const CreateFolderModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!folderName.trim()) {
      toast.error("Folder name is required.");
      return;
    }

    try {
      await onSubmit(folderName);
      setFolderName("");
      onClose();
      toast.success("Folder created successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create folder."));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-amber-950">Create New Folder</h2>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
          <div>
            <label className="text-sm font-medium text-amber-950">
              Folder Name
            </label>
            <input
              type="text"
              className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-amber-500"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="My Folder"
              autoFocus
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setFolderName("");
                onClose();
              }}
              className="flex-1 rounded-lg border border-amber-200 bg-white px-4 py-2.5 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-linear-to-r from-amber-700 to-amber-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-amber-700/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;