import { useContext } from "react";
import { Switcher } from "../Switcher/Switcher";
import "./Preferences.css";
import { ThemeContext } from "../../store/contexts/ThemeContext";

export function Preferences() {
  const { theme, setTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  function changeTheme() {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  return (
    <div className="preferences-section">
      <h3>Preferences</h3>
      <div className="theme-container">
        <Switcher onClick={changeTheme} />
        <p className="theme-name">{isDark ? "Dark" : "Light"} theme</p>
      </div>
    </div>
  );
}
