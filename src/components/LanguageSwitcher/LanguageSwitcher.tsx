import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en');
    };

    const currentLang = i18n.language;

    return (
        <button onClick={toggleLanguage}>
            {currentLang === 'en' ? 'RU' : 'EN'}
        </button>
    );
};

export default LanguageSwitcher;
