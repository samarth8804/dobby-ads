import { FiImage, FiTrash2 } from "react-icons/fi";
import { formatDate } from "../utils/formatters";
import { formatSize } from "../utils/formatSize";

const ImageCard = ({ image, onDelete }) => {
  return (
    <div className="rounded-xl border border-amber-200 bg-white overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={image.url}
          alt={image.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-amber-950 text-sm sm:text-base">
              {image.name}
            </h3>
            <div className="mt-1 flex flex-col gap-1 text-xs text-gray-600 sm:flex-row sm:gap-3">
              <span>{formatDate(image.createdAt)}</span>
              <span>{formatSize(image.size)}</span>
            </div>
          </div>

          <button
            onClick={() => onDelete(image._id, image.name)}
            className="shrink-0 rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-100 hover:text-red-700"
            title="Delete image"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
