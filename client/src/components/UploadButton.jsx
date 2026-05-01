import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiUpload } from "react-icons/fi";
import { getApiErrorMessage } from "../utils/errorMessage";

const UploadButton = ({ onUpload, isLoading }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    setUploading(true);

    try {
      await onUpload(file);
      toast.success("Image uploaded successfully.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to upload image."));
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading || isLoading}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || isLoading}
        className="flex items-center gap-2 rounded-lg bg-linear-to-r from-amber-700 to-amber-900 px-4 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-amber-700/30 disabled:cursor-not-allowed disabled:opacity-70 sm:px-6"
      >
        <FiUpload className="h-4 w-4" />
        <span className="hidden sm:inline">{uploading ? "Uploading..." : "Upload Image"}</span>
        <span className="sm:hidden">{uploading ? "..." : "Upload"}</span>
      </button>
    </>
  );
};

export default UploadButton;