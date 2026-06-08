import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-5">

      <h1 className="text-2xl font-bold mb-8">
        ResumeRank AI
      </h1>

      <nav className="flex flex-col gap-4">

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/jobs">
          Jobs
        </Link>

        <Link to="/analytics">
          Analytics
        </Link>

        <button
          onClick={handleLogout}
          className="text-left"
        >
          Logout
        </button>

      </nav>

    </div>
  );
}