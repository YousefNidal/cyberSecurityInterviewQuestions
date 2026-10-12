import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield } from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="navbar container">
      <Link to="/" className="navbar-brand">
        <Shield size={32} color="var(--primary)" />
        <span className="text-gradient">{t('app_name')}</span>
      </Link>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>{t('nav_home')}</Link>
        <Link to="/theory" className={`nav-link ${location.pathname === '/theory' ? 'active' : ''}`}>{t('nav_theory')}</Link>
        <Link to="/interview" className={`nav-link ${location.pathname === '/interview' ? 'active' : ''}`}>{t('nav_interview')}</Link>
      </div>
      <button className="lang-switch" onClick={toggleLanguage}>
        {i18n.language === 'en' ? 'RU' : 'EN'}
      </button>
    </nav>
  );
}
