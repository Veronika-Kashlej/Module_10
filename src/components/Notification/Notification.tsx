import { useEffect, useState } from "react";
import "./Notification.css";

interface NotificationProps {
  message: string;
}

export function Notification({ message }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(closeModal, 4000);
    return () => clearTimeout(timer);
  });

  function closeModal() {
    setIsVisible(false);
  }

  if (!isVisible) return null;

  return (
    <div className="notification-container">
      <p>{message}</p>
      <p className="close-natification-btn" onClick={closeModal}>
        ×
      </p>
    </div>
  );
}
