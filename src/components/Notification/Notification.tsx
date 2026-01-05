import { useState } from "react";
import "./Notification.css";
import { Portal } from "../Portal/Portal";
import { CustomNotificationProps } from "../../store/types";

export function CustomNotification({ message, type }: CustomNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  const closeModal = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <Portal>
      <div
        className={`notification-container ${type === "success" ? "" : "error"}`}
      >
        <p>{message}</p>
        <p className="close-natification-btn" onClick={closeModal}>
          ×
        </p>
      </div>
    </Portal>
  );
}
