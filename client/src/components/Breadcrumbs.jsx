import { FaChevronRight } from "react-icons/fa";

const Breadcrumbs = ({ breadcrumbs, onNavigate }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onNavigate(null)}
        className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors whitespace-nowrap"
      >
        Root
      </button>

      {breadcrumbs &&
        breadcrumbs.map((crumb, index) => (
          <div key={crumb._id} className="flex items-center gap-2">
            <FaChevronRight className="text-gray-400 text-xs shrink-0" />
            <button
              onClick={() => onNavigate(crumb._id)}
              className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors whitespace-nowrap"
            >
              {crumb.name}
            </button>
          </div>
        ))}
    </div>
  );
};

export default Breadcrumbs;
