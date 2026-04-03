import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.scss';

const Header = () => {
  const headerRef = useRef(null);
  const lastScroll = useRef(0);
  const showPosition = useRef(0);
  const fullHideOffset = 10;

  // --- Настройки плавной прокрутки ---
  const [isOpen, setIsOpen] = useState(false);
  const [isSmoothScroll, setIsSmoothScroll] = useState(() => {
    const saved = localStorage.getItem('smoothScroll');
    return saved !== null ? saved === 'true' : false;
  });
  const menuRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('smoothScroll', isSmoothScroll);
    document.documentElement.style.scrollBehavior = isSmoothScroll ? 'smooth' : 'auto';
  }, [isSmoothScroll]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Скролл-эффекты для шапки (скрытие/показ) ---
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const scrollPosition = () => window.scrollY || document.documentElement.scrollTop;
    const containHide = () => header.classList.contains(styles.hide);
    
    const handleScroll = () => {
      const currentScroll = scrollPosition();
      const scrollDelta = currentScroll - lastScroll.current;
      const scrollingDown = scrollDelta > 0;
      
      if (scrollingDown && currentScroll > 0) {
        if (!containHide()) {
          header.classList.remove(styles.show);
          header.classList.add(styles.hide);
          showPosition.current = currentScroll; 
        }

        if (currentScroll > showPosition.current + fullHideOffset) {
          header.classList.add(styles.fullhide);
        }
      } else if (!scrollingDown) {
        header.classList.remove(styles.hide, styles.fullhide);
        header.classList.add(styles.show);
        showPosition.current = currentScroll; 
      }

      lastScroll.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Хамелеон (изменение цвета шапки в зависимости от секции) ---
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const sections = document.querySelectorAll('.content-block');
    if (sections.length === 0) return;

    const handleChameleon = () => {
      const scrollPosition = window.scrollY;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          const bgColor = getComputedStyle(section).backgroundColor;
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            header.style.backgroundColor = bgColor;
          }
        }
      });
    };

    window.addEventListener('scroll', handleChameleon);
    return () => window.removeEventListener('scroll', handleChameleon);
  }, []);

  return (
    <header className={`${styles.header} ${styles.show}`} ref={headerRef}>
      <div className={styles.logo}>ToDo List</div>
      
      <div className={styles.settings} ref={menuRef}>
        <button 
          className={styles.settingsButton} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Настройки"
        >
          ⚙️ Настройки
        </button>
        
        {isOpen && (
          <div className={styles.dropdown}>
            <label className={styles.option}>
              <input
                type="checkbox"
                checked={isSmoothScroll}
                onChange={(e) => setIsSmoothScroll(e.target.checked)}
              />
              <span>Плавная прокрутка</span>
            </label>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;