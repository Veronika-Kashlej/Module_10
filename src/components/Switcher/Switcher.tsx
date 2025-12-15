import { useState } from "react";
import "./Switcher.css";

export function Switcher() {
  const [isActive, setIsActive] = useState(false);
  return (
    <button onClick={() => setIsActive(!isActive)} className="switcher">
      <div className={`circle ${isActive ? "active" : ""}`}></div>
    </button>
  );
}
