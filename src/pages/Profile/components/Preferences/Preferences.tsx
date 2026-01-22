import { Switcher } from '../../../../components/Switcher/Switcher';
import { useTheme } from '../../../../store/contexts/ThemeContext';
import './Preferences.css';

export function Preferences() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <section className="preferences-section">
            <h3>Preferences</h3>
            <label className="theme-container">
                <Switcher onClick={toggleTheme} />
                <p className="theme-name">{isDark ? 'Dark' : 'Light'} theme</p>
            </label>
        </section>
    );
}
