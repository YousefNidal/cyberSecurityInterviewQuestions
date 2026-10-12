import React, { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import theoryData from '../data/theory.json';
import { Search, X, Menu, ChevronRight, Network, Skull, Globe, Key, Flag, Terminal, BookOpen, Server, Shield } from 'lucide-react';

const CATEGORY_ICONS = {
  "Networking Fundamentals": <Network size={18} />,
  "Threats & Attacks": <Skull size={18} />,
  "Web Application Security": <Globe size={18} />,
  "Cryptography": <Key size={18} />,
  "Penetration Testing": <Terminal size={18} />,
  "OSINT": <Globe size={18} />,
  "CTF & Reverse Engineering": <Flag size={18} />,
  "Cloud Security": <Server size={18} />,
  "Security Operations": <Shield size={18} />,
  "Security Tools": <Terminal size={18} />,
  "MITRE ATT&CK": <Shield size={18} />,
  "Additional References": <BookOpen size={18} />,
};

// Ordered categories for sidebar
const CATEGORY_ORDER = [
  "Networking Fundamentals",
  "Threats & Attacks",
  "Web Application Security",
  "Cryptography",
  "Penetration Testing",
  "OSINT",
  "CTF & Reverse Engineering",
  "Cloud Security",
  "Security Operations",
  "Security Tools",
  "MITRE ATT&CK",
  "Additional References",
];

export default function Theory() {
  const { t, i18n } = useTranslation();
  const [activeTopicId, setActiveTopicId] = useState(theoryData[0]?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState(new Set(['MITRE ATT&CK', 'Additional References']));
  const mainRef = useRef(null);

  // Group data by category
  const groupedData = useMemo(() => {
    const groups = {};
    theoryData.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, []);

  const activeTopic = useMemo(() => {
    return theoryData.find(t => t.id === activeTopicId);
  }, [activeTopicId]);

  const activeSections = useMemo(() => {
    if (!activeTopic) return [];
    if (i18n.language === 'ru' && activeTopic.sections_ru && activeTopic.sections_ru.length > 0) {
      return activeTopic.sections_ru;
    }
    return activeTopic.sections || [];
  }, [activeTopic, i18n.language]);

  const toggleCategory = (cat) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleTopicSelect = (id) => {
    setActiveTopicId(id);
    setIsSidebarOpen(false);
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter topics by search
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groupedData;
    const q = searchQuery.toLowerCase();
    const filtered = {};
    Object.entries(groupedData).forEach(([cat, items]) => {
      const matches = items.filter(item => {
        const sectionsToSearch = (i18n.language === 'ru' && item.sections_ru && item.sections_ru.length > 0) ? item.sections_ru : (item.sections || []);
        return item.title.toLowerCase().includes(q) ||
        sectionsToSearch.some(s => s.body.toLowerCase().includes(q) || s.heading.toLowerCase().includes(q));
      });
      if (matches.length > 0) filtered[cat] = matches;
    });
    return filtered;
  }, [groupedData, searchQuery, i18n.language]);

  const orderedCategories = CATEGORY_ORDER.filter(c => filteredGroups[c]);

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 999, backdropFilter: 'blur(4px)'
          }}
        />
      )}

      <div className="doc-layout">
        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsSidebarOpen(true)}>
          <Menu size={18} /> Browse Topics
        </button>

        {/* Sidebar */}
        <aside className={`doc-sidebar glass-panel ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>{t('theory_title')}</h2>
            <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="search-box">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="sidebar-content">
            {orderedCategories.map(category => {
              const items = filteredGroups[category] || [];
              const isCollapsed = collapsedCategories.has(category) && !searchQuery;
              return (
                <div key={category} className="sidebar-category">
                  <h3
                    onClick={() => toggleCategory(category)}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', userSelect: 'none' }}
                  >
                    <span style={{ opacity: 0.7 }}>{CATEGORY_ICONS[category]}</span>
                    <span style={{ flex: 1 }}>{category}</span>
                    <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>{items.length}</span>
                    <ChevronRight
                      size={14}
                      style={{
                        transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
                        transition: 'transform 0.2s ease',
                        opacity: 0.5
                      }}
                    />
                  </h3>
                  {!isCollapsed && (
                    <ul>
                      {items.map(item => (
                        <li key={item.id}>
                          <button
                            className={activeTopicId === item.id ? 'active' : ''}
                            onClick={() => handleTopicSelect(item.id)}
                          >
                            {item.title.replace(/_/g, ' ')}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main ref={mainRef} className="doc-content glass-panel">
          {activeTopic ? (
            <article className="doc-article">
              <div className="doc-breadcrumb">
                {CATEGORY_ICONS[activeTopic.category]}
                <span>{activeTopic.category}</span>
              </div>
              <h1 className="doc-title">{activeTopic.title.replace(/_/g, ' ')}</h1>

              <div className="doc-toc glass-panel">
                <strong>📋 Sections</strong>
                <ol>
                  {activeSections.map((s, i) => (
                    <li key={i}>
                      <a href={`#section-${i}`} className="toc-link">{s.heading}</a>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="doc-body">
                {activeSections.map((section, i) => (
                  <section id={`section-${i}`} key={i} className="doc-section">
                    <h2>{section.heading}</h2>
                    <div className="doc-text">
                      {section.body.split('\n').map((line, li) => {
                        // Code-like lines (starting with nmap, sqlmap, specific chars)
                        const isCodeLine = line.match(/^(nmap|sqlmap|msf|msfconsole|python|curl|dig|nc|whois|find|sudo|cat|echo|airmon|aireplay|hashcat|hydra|\$|#|>|<|{|}|\[)/) || line.match(/--[a-zA-Z]/);
                        const isHeadingLine = line.match(/^[A-Z][A-Z\s&()/-]{5,}:$/) || (i18n.language === 'ru' && line.match(/^[А-Я][А-Я\s&()/-]{5,}:$/));

                        if (isHeadingLine) {
                          return <p key={li} style={{ fontWeight: 700, color: 'var(--primary)', marginTop: '16px', marginBottom: '4px' }}>{line}</p>;
                        }
                        if (isCodeLine || line.startsWith('• ') === false && line.trim().startsWith('$')) {
                          return (
                            <code key={li} style={{
                              display: 'block',
                              background: 'rgba(0,0,0,0.4)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              margin: '4px 0',
                              fontFamily: 'monospace',
                              fontSize: '0.9rem',
                              color: 'var(--primary)',
                              wordBreak: 'break-all'
                            }}>
                              {line}
                            </code>
                          );
                        }
                        if (line.trim() === '') return <br key={li} />;
                        if (line.startsWith('• ')) {
                          return (
                            <li key={li} style={{ marginLeft: '20px', marginBottom: '6px', color: 'var(--text-muted)' }}>
                              {line.slice(2)}
                            </li>
                          );
                        }
                        return <p key={li}>{line}</p>;
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          ) : (
            <div className="empty-state">Select a topic from the sidebar to start reading.</div>
          )}
        </main>
      </div>
    </>
  );
}
