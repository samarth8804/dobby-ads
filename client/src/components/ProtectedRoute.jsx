import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { accessToken, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) {
    return (
      <div className="grid min-h-screen place-items-center bg-amber-50">
        <Loader label="Restoring your session..." />
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
