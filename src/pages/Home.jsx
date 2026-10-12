import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, UserCheck } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="container">
      <header className="hero">
        <h1><span className="text-gradient">{t('hero_title')}</span></h1>
        <p>{t('hero_subtitle')}</p>
        <Link to="/theory" className="btn-primary">{t('start_learning')}</Link>
      </header>

      <div className="theory-grid">
        <div className="theory-card glass-panel">
          <h3><ShieldCheck color="var(--primary)" /> Security First</h3>
          <p>Learn the latest practices in securing web apps, networks, and infrastructure against modern threats.</p>
        </div>
        <div className="theory-card glass-panel">
          <h3><BookOpen color="var(--primary)" /> Comprehensive Theory</h3>
          <p>Deep dive into ports, protocols, malware types, and open-source intelligence gathering.</p>
        </div>
        <div className="theory-card glass-panel">
          <h3><UserCheck color="var(--primary)" /> Interview Ready</h3>
          <p>Test your knowledge with our extensive 2000+ question bank simulating real job interviews.</p>
        </div>
      </div>
    </div>
  );
}
