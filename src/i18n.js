import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_name": "CyberLearn Pro",
      "nav_home": "Home",
      "nav_theory": "Theory Base",
      "nav_interview": "Interview Prep",
      "hero_title": "Master Cyber Security",
      "hero_subtitle": "Your ultimate resource for learning, revision, and interview preparation. Available in English and Russian.",
      "start_learning": "Start Learning",
      "theory_title": "Cyber Security Theory",
      "theory_ports": "Common Ports & Protocols",
      "theory_threats": "Threats & Vulnerabilities",
      "theory_apps": "Useful Security Apps",
      "theory_osint": "OSINT Frameworks",
      "theory_ctf": "CTF Strategies",
      "interview_title": "Interview Simulator (2000+ Questions)",
      "question": "Question",
      "next": "Next Question",
      "check": "Check Answer",
      "correct": "Correct!",
      "incorrect": "Incorrect. Try again.",
      "type_answer": "Type your answer here...",
      "select_answer": "Select the correct option:",
      "score": "Score",
      "ports_desc": "Learn about TCP/UDP ports, FTP, SSH, HTTP, and more.",
      "threats_desc": "Understand malware, phishing, DDoS, SQLi, XSS.",
      "apps_desc": "Nmap, Wireshark, Metasploit, Burp Suite, etc.",
      "osint_desc": "Open Source Intelligence gathering techniques.",
      "ctf_desc": "Capture The Flag tips, reverse engineering, forensics.",
      "tab_choice": "Multiple Choice",
      "tab_text": "Text Questions",
      "category_label": "Categories",
      "category_all": "All Categories",
      "topic_general": "General",
      "topic_tools": "Tools",
      "topic_ports": "Ports & Protocols",
      "topic_network": "Networking",
      "topic_threats": "Threats",
      "topic_web": "Web Security",
      "topic_malware": "Malware",
      "topic_crypto": "Cryptography",
      "show_answer": "Show Answer",
      "hide_answer": "Hide Answer",
      "correct_answer": "Correct Answer",
      "prev_page": "Prev",
      "next_page": "Next",
      "page_info": "Page {{page}} of {{total}}",
      "page_size": "Per page",
      "showing_range": "Showing {{from}}–{{to}} of {{total}}",
      "loading_questions": "Loading questions…"
    }
  },
  ru: {
    translation: {
      "app_name": "CyberLearn Pro",
      "nav_home": "Главная",
      "nav_theory": "Теория",
      "nav_interview": "Собеседование",
      "hero_title": "Освойте Кибербезопасность",
      "hero_subtitle": "Ваш главный ресурс для изучения, повторения и подготовки к собеседованиям. Доступен на английском и русском.",
      "start_learning": "Начать обучение",
      "theory_title": "Теория Кибербезопасности",
      "theory_ports": "Общие Порты и Протоколы",
      "theory_threats": "Угрозы и Уязвимости",
      "theory_apps": "Полезные Приложения",
      "theory_osint": "Методология OSINT",
      "theory_ctf": "Стратегии CTF",
      "interview_title": "Симулятор Собеседования (2000+ Вопросов)",
      "question": "Вопрос",
      "next": "Следующий Вопрос",
      "check": "Проверить Ответ",
      "correct": "Правильно!",
      "incorrect": "Неправильно. Попробуйте еще раз.",
      "type_answer": "Введите ваш ответ здесь...",
      "select_answer": "Выберите правильный вариант:",
      "score": "Счет",
      "ports_desc": "Узнайте о портах TCP/UDP, FTP, SSH, HTTP и других.",
      "threats_desc": "Понимание вредоносных программ, фишинга, DDoS, SQLi, XSS.",
      "apps_desc": "Nmap, Wireshark, Metasploit, Burp Suite и др.",
      "osint_desc": "Методы сбора информации из открытых источников.",
      "ctf_desc": "Советы по Capture The Flag, реверс-инжиниринг, криминалистика.",
      "tab_choice": "Множественный Выбор",
      "tab_text": "Текстовые Вопросы",
      "category_label": "Категории",
      "category_all": "Все Категории",
      "topic_general": "Общее",
      "topic_tools": "Инструменты",
      "topic_ports": "Порты и Протоколы",
      "topic_network": "Сети",
      "topic_threats": "Угрозы",
      "topic_web": "Веб-Безопасность",
      "topic_malware": "Вредоносное ПО",
      "topic_crypto": "Криптография",
      "show_answer": "Показать Ответ",
      "hide_answer": "Скрыть Ответ",
      "correct_answer": "Правильный Ответ",
      "prev_page": "Назад",
      "next_page": "Вперёд",
      "page_info": "Страница {{page}} из {{total}}",
      "page_size": "На странице",
      "showing_range": "Показано {{from}}–{{to}} из {{total}}",
      "loading_questions": "Загрузка вопросов…"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
