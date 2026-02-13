import { Switcher } from '../../../../components/Switcher/Switcher';
import { useTheme } from '../../../../store/contexts/ThemeContext';
import './Preferences.css';
import { useTranslation } from 'react-i18next';

export function Preferences() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const { t } = useTranslation();

    return (
        <section className="preferences-section">
            <h3>{t('pages.profile.preferences.title')}</h3>
            <label className="theme-container">
                <Switcher onClick={toggleTheme} />
                <p className="theme-name">
                    {isDark
                        ? t('pages.profile.preferences.themes.dark')
                        : t('pages.profile.preferences.themes.light')}
                </p>
            </label>
        </section>
    );
}
