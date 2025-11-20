/* Simple client-side data store with localStorage persistence.
   - getData() -> returns current data object
   - saveData(data) -> saves to localStorage
   - resetToDefaults() -> restores built-in defaults
   - exportJSON() -> returns JSON string
   - importJSON(json) -> parses and saves
   - onChange(callback) -> register change listeners
*/
(function(window){
  const STORAGE_KEY = 'portfolioData_v1';

  const defaultData = {
    projects: [
      {
        id: cryptoRandomId(),
        title: 'Gradus App',
        tech: ['Flutter','Puppeteer.js','Python','Golang'],
        description: 'A collaborative Flutter mobile application that securely scrapes data from Katy ISD\'s grade center. Clean UI and custom Puppeteer API.',
        links: []
      },
      {
        id: cryptoRandomId(),
        title: 'PlatoAI',
        tech: ['Flask','JavaScript','PostgreSQL','OAuth v2'],
        description: 'AI-powered college essay guidance platform built with Flask and JavaScript. Helped 4,000+ students internationally.',
        links: []
      },
      {
        id: cryptoRandomId(),
        title: 'NASA Space Apps Challenge',
        tech: ['Streamlit','AI/ML','APIs'],
        description: 'Competitions in 2023 & 2024 with awards and honors. Built realtime tools leveraging APIs and ML.',
        links: []
      }
    ],
    experience: [
      {
        id: cryptoRandomId(),
        title: 'Texas A&M University',
        date: 'Aug 2025 - May 2029',
        description: 'BS in Computer Science & Mathematics',
        bullets: []
      },
      {
        id: cryptoRandomId(),
        title: 'Obra D. Tompkins High School',
        date: '2021 - 2025',
        description: 'High School Diploma; numerous AP and Honors courses',
        bullets: []
      }
    ]
  };

  let listeners = [];

  function cryptoRandomId() {
    // simple id
    return 'id_' + Math.random().toString(36).slice(2,10);
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(defaultData));
      return JSON.parse(raw);
    } catch (e) {
      console.error('data-store load error', e);
      return JSON.parse(JSON.stringify(defaultData));
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      listeners.forEach(cb => { try { cb(data); } catch(e){}});
    } catch (e) {
      console.error('data-store save error', e);
    }
  }

  function getData() {
    return load();
  }

  function saveData(data) {
    save(data);
  }

  function resetToDefaults() {
    save(JSON.parse(JSON.stringify(defaultData)));
  }

  function exportJSON() {
    return JSON.stringify(getData(), null, 2);
  }

  function importJSON(json) {
    try {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json;
      save(parsed);
      return true;
    } catch (e) {
      console.error('importJSON parse error', e);
      return false;
    }
  }

  function onChange(cb) {
    listeners.push(cb);
  }

  // expose
  window.PortfolioStore = {
    getData,
    saveData,
    resetToDefaults,
    exportJSON,
    importJSON,
    onChange,
    _defaultData: defaultData
  };

})(window);
