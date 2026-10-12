import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function Interview() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'ru' ? 'ru' : 'en';
  const [questionsData, setQuestionsData] = useState(null);
  const [activeTab, setActiveTab] = useState('choice'); // 'choice' or 'text'
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [visibleAnswers, setVisibleAnswers] = useState(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const listTopRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    import('../data/questions.json').then((mod) => {
      if (mounted) setQuestionsData(mod.default);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const topics = useMemo(() => {
    const counts = new Map();
    (questionsData || []).forEach((q) => {
      const key = q.topic || 'general';
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [questionsData]);

  const questions = useMemo(() => {
    const filtered =
      category === 'all'
        ? questionsData || []
        : (questionsData || []).filter((q) => (q.topic || 'general') === category);
    const choice = [];
    const text = [];
    filtered.forEach((q) => {
      if (q.type === 'choice') choice.push(q);
      else text.push(q);
    });
    return { choice, text };
  }, [questionsData, category]);

  const currentList = activeTab === 'choice' ? questions.choice : questions.text;
  const totalPages = Math.max(1, Math.ceil(currentList.length / pageSize));

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return currentList.slice(start, start + pageSize);
  }, [currentList, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, category, lang, pageSize]);

  const toggleAnswer = (id) => {
    setVisibleAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleOptionClick = (questionId, option) => {
    if (selectedAnswers[questionId]) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const goToPage = (target) => {
    setPage(Math.min(Math.max(1, target), totalPages));
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getTopic = (q) => t(`topic_${q.topic || 'general'}`);
  const getText = (q) => (lang === 'ru' && q.text_ru ? q.text_ru : q.text);
  const getAnswer = (q) => (lang === 'ru' && q.answer_ru ? q.answer_ru : q.answer);
  const getOptions = (q) =>
    lang === 'ru' && q.options_ru ? q.options_ru : q.options || [];

  const startIndex = (page - 1) * pageSize;

  return (
    <div className="container interview-container" style={{ maxWidth: '1000px' }}>
      <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '20px' }}>
        {t('interview_title')}
      </h1>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'choice' ? 'active' : ''}`}
          onClick={() => setActiveTab('choice')}
        >
          {t('tab_choice')} ({questions.choice.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          {t('tab_text')} ({questions.text.length})
        </button>
      </div>

      {questionsData && (
        <div className="category-filter">
          <span className="category-label">{t('category_label')}:</span>
          <button
            className={`category-chip ${category === 'all' ? 'active' : ''}`}
            onClick={() => setCategory('all')}
          >
            {t('category_all')} ({questionsData.length})
          </button>
          {topics.map(([key, count]) => (
            <button
              key={key}
              className={`category-chip ${category === key ? 'active' : ''}`}
              onClick={() => setCategory(key)}
            >
              {t(`topic_${key}`)} ({count})
            </button>
          ))}
        </div>
      )}

      <div ref={listTopRef} />

      {!questionsData ? (
        <div className="glass-panel interview-loading">{t('loading_questions')}</div>
      ) : (
        <>
          <div className="pagination">
            <button
              className="btn-secondary"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
            >
              ← {t('prev_page')}
            </button>
            <span className="page-info">
              {t('page_info', { page, total: totalPages })}
            </span>
            <button
              className="btn-secondary"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
            >
              {t('next_page')} →
            </button>
            <label className="page-size">
              {t('page_size')}
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="page-range">
            {t('showing_range', {
              from: currentList.length === 0 ? 0 : startIndex + 1,
              to: startIndex + pageItems.length,
              total: currentList.length,
            })}
          </p>

          <div className="questions-list">
            {pageItems.map((q, index) => {
              const answer = getAnswer(q);
              const options = getOptions(q);
              const isAnswered = selectedAnswers[q.id];
              const isCorrect = isAnswered && selectedAnswers[q.id] === answer;

              return (
                <div key={q.id} className="glass-panel question-list-item">
                  <div className="q-number">#{startIndex + index + 1}</div>
                  <div className="q-content">
                    <span className="q-topic">{getTopic(q)}</span>
                    <p className="q-text">{getText(q)}</p>

                    {q.type === 'choice' && (
                      <div className="options-grid" style={{ marginBottom: '20px' }}>
                        {options.map((opt, i) => {
                          let btnClass = 'option-btn';
                          if (isAnswered) {
                            if (opt === answer) btnClass += ' correct';
                            else if (opt === selectedAnswers[q.id]) btnClass += ' incorrect';
                          }

                          return (
                            <button
                              key={i}
                              className={btnClass}
                              onClick={() => handleOptionClick(q.id, opt)}
                              disabled={!!isAnswered}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {isAnswered && (
                      <div
                        className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}
                        style={{ marginBottom: '16px' }}
                      >
                        {isCorrect ? t('correct') : t('incorrect')}
                      </div>
                    )}

                    <div className="q-actions">
                      <button
                        className="btn-secondary"
                        onClick={() => toggleAnswer(q.id)}
                      >
                        {visibleAnswers.has(q.id) ? t('hide_answer') : t('show_answer')}
                      </button>
                    </div>

                    {visibleAnswers.has(q.id) && (
                      <div className="q-answer glass-panel correct">
                        <strong>{t('correct_answer')}:</strong> {answer}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination pagination-bottom">
              <button
                className="btn-secondary"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
              >
                ← {t('prev_page')}
              </button>
              <span className="page-info">
                {t('page_info', { page, total: totalPages })}
              </span>
              <button
                className="btn-secondary"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
              >
                {t('next_page')} →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
