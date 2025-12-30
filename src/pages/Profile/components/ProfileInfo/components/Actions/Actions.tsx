import { useState } from "react";
import "./Actions.css";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../../../store/contexts/AuthContext";
import { Notification } from "../../../../../../components/Notification/Notification";

export function Actions() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    try {
      await signOut;
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
