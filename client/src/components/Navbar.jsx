import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {

    logout();

    navigate("/login");

  };

  return (
    <div className="flex justify-between items-center p-4 border-b">

      <h1 className="font-bold text-xl">
        ResumeRank AI
      </h1>

      <div className="flex gap-4 items-center">

        <span>
          {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>

    </div>
  );
}