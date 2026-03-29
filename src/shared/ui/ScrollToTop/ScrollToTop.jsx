import React, { useState, useEffect } from 'react';
import styles from './ScrollToTop.module.scss';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 34) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          className={styles.scrollButton}
          onClick={scrollToTop}
          title="Scroll To Top Button"
        >
          ↑ Наверх
        </button>
      )}
    </>
  );
};

export default ScrollToTop;