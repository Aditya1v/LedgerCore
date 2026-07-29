import { useContext } from "react";
import { Navigate,Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);


  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
