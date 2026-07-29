import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { logoutUser } from "../../services/authService";

function Navbar() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();

      setUser(null);

      navigate("/login");
    } catch (error) {
      console.error(error);
      // toast.error("Logout failed");
    }
  };
  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">LedgerCore</h1>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}

export default Navbar;
