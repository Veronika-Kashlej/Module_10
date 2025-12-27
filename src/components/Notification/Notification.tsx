import { useState } from "react";
import "./Notification.css";
import { Portal } from "../Portal/Portal";

interface NotificationProps {
  message: string;
}

export function Notification({ message }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  const closeModal = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Portal>
      <div className="notification-container">
        <p>{message}</p>
        <p className="close-natification-btn" onClick={closeModal}>
          ×
        </p>
      </div>
    </Portal>
  );
}
