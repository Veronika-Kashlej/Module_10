import { Switcher } from "../Switcher/Switcher";
import "./Preferences.css";
import { useTheme } from "../../store/contexts/ThemeContext";

export function Preferences() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="preferences-section">
      <h3>Preferences</h3>
      <div className="theme-container">
        <Switcher onClick={toggleTheme} />
        <p className="theme-name">{isDark ? "Dark" : "Light"} theme</p>
      </div>
    </div>
  );
}
