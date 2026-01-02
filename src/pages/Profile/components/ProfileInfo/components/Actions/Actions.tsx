import { useState } from "react";
import "./Actions.css";
import { Notification } from "../../../../../../components/Notification/Notification";
import { useAuth } from "../../../../../../store/contexts/AuthContext";
import { useNavigate } from "react-router";

export function Actions() {
  const [error, setError] = useState<string | null>(null);
  const { signOut } = useAuth();
  const navigate = useNavigate();

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
    <section className="actions-section">
      <h3>Actions</h3>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
      {error && <Notification message={error} />}
    </section>
  );
}
