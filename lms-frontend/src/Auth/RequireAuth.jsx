import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/denied" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
