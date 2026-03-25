import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/useContext";
const AdminRoute = () => {
  const { user } = useUser();

  // Not logged in
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in but NOT admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin allowed
  return <Outlet />;
};

export default AdminRoute;
