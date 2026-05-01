import { FiAlertCircle } from "react-icons/fi";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
  isDanger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-white p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <FiAlertCircle
            className={`mt-1 h-6 w-6 shrink-0 ${isDanger ? "text-red-600" : "text-amber-600"}`}
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-600">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-amber-200 bg-white px-4 py-2.5 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-70 ${
              isDanger
                ? "bg-linear-to-r from-red-600 to-red-700 hover:shadow-lg hover:shadow-red-600/30"
                : "bg-linear-to-r from-amber-700 to-amber-900 hover:shadow-lg hover:shadow-amber-700/30"
            }`}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
