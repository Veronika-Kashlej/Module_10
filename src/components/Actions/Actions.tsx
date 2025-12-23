import { useState } from "react";
import "./Actions.css";
import { useAuth } from "../../store/contexts/AuthContext";
import { useNavigate } from "react-router";
import { Notification } from "../Notification/Notification";

export function Actions() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <div className="actions-section">
      <h3>Actions</h3>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
      {error && <Notification message={error} />}
    </div>
  );
}
