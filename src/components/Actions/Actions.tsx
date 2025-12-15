import { useContext, useState } from "react";
import { authService } from "../../api/authService";
import "./Actions.css";
import { AuthContext } from "../../store/contexts/AuthContext";
import { useNavigate } from "react-router";
import { Notification } from "../Notification/Notification";

export function Actions() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    try {
      await authService.signOut();
      setIsAuthenticated(false);
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <div>
      <h3>Actions</h3>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
      {error && <Notification message={error} />}
    </div>
  );
}
