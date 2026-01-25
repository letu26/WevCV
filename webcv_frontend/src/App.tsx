import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import AppRoutes from '@/routes/AppRoutes';
import { STORAGE_KEYS, APP_CONFIG } from '@/config';

function App() {
  const [language, setLanguage] = useState<'vi' | 'en'>(APP_CONFIG.DEFAULT_LANGUAGE);

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as 'vi' | 'en' | null;
    if (savedLanguage && APP_CONFIG.SUPPORTED_LANGUAGES.includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: 'vi' | 'en') => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  };

  return (
    <BrowserRouter>
      <Toaster position="bottom-right" richColors />
      <AppRoutes language={language} setLanguage={handleSetLanguage} />
    </BrowserRouter>
  );
}

export default App;
