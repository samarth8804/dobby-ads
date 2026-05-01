import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { MdOutlineFolderOpen } from "react-icons/md";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { accessToken } = useSelector((state) => state.auth);
  const { logout } = useAuth();
  const isAuthenticated = Boolean(accessToken);
  const appName = import.meta.env.VITE_APP_NAME || "Dobby Drive";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-amber-200 bg-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-amber-700 to-amber-900 sm:h-10 sm:w-10">
            <MdOutlineFolderOpen className="text-base text-white sm:text-lg" />
          </div>
          <span className="hidden text-lg font-bold text-amber-900 sm:inline sm:text-xl">
            {appName}
          </span>
        </Link>

        {!isAuthenticated ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-100 sm:px-4 sm:text-sm"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-linear-to-r from-amber-700 to-amber-900 px-4 py-2 text-xs font-medium text-white transition-all hover:shadow-lg hover:shadow-amber-700/30 sm:px-6 sm:text-sm"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/keys"
              className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-50 sm:px-4 sm:text-sm"
            >
              API Keys
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-linear-to-r from-amber-700 to-amber-900 px-4 py-2 text-xs font-medium text-white transition-all hover:shadow-lg hover:shadow-amber-700/30 sm:px-6 sm:text-sm"
            >
              <FiLogOut className="text-sm sm:text-base" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
