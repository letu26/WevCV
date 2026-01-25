import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import { STORAGE_KEYS, APP_CONFIG } from '@/config';
import AppRoutes from '@/routes/AppRoutes';

function App() {
  const [language, setLanguage] = useState<'vi' | 'en'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return (saved as 'vi' | 'en') || APP_CONFIG.DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <AppRoutes language={language} setLanguage={setLanguage} />
    </BrowserRouter>
  );
}

export default App;