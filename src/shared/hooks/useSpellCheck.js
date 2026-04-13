import { useState, useEffect } from 'react';

const useSpellCheck = () => {
  const [isSpellCheck, setIsSpellCheck] = useState(() => {
    const saved = localStorage.getItem('spellCheck');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'spellCheck') {
        setIsSpellCheck(e.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return isSpellCheck;
};

export default useSpellCheck;