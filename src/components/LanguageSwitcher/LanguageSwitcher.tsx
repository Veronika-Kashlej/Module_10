import React from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components';

const SwitchButton = styled.button`
    width: 48px;
    height: 24px;
    padding: 0;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
        opacity: 0.9;
    }
`;

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'ru' : 'en');
    };

    const currentLang = i18n.language;

    return (
        <SwitchButton onClick={toggleLanguage} aria-label="change language">
            {currentLang === 'en' ? 'RU' : 'EN'}
        </SwitchButton>
    );
};

export default LanguageSwitcher;
