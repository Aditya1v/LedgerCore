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
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-8">
      <h1 className="text-2xl font-bold text-white">
        LedgerCore
      </h1>

      <button
        onClick={handleLogout}
        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700"
      >
        Logout
      </button>
    </header>
  );
}

export default Navbar;