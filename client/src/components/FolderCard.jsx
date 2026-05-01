import { FiFolder, FiTrash2, FiChevronRight } from "react-icons/fi";
import { formatDate } from "../utils/formatters";
import { formatSize } from "../utils/formatSize";

const FolderCard = ({ folder, onOpen, onDelete }) => {
  return (
    <div className="rounded-xl border border-amber-200 bg-white p-4 transition-all hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 items-start gap-3 min-w-0">
          <FiFolder className="mt-1 h-5 w-5 shrink-0 text-amber-700" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-amber-950 text-sm sm:text-base">
              {folder.name}
            </h3>
            <div className="mt-1 flex flex-col gap-1 text-xs text-gray-600 sm:flex-row sm:gap-3">
              <span>{formatDate(folder.createdAt)}</span>
              <span>{formatSize(folder.size)}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => onOpen(folder._id)}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-amber-100 hover:text-amber-700"
            title="Open folder"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(folder._id, folder.name)}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-100 hover:text-red-700"
            title="Delete folder"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
