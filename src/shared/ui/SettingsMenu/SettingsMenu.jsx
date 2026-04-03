import { useState, useEffect, useRef } from 'react'
import styles from './SettingsMenu.module.scss'

const SettingsMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSmoothScroll, setIsSmoothScroll] = useState(() => {
    const saved = localStorage.getItem('smoothScroll')
    return saved !== null ? saved === 'true' : false
  })
  const menuRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('smoothScroll', isSmoothScroll)
    // Меняем поведение прокрутки для всей страницы
    document.documentElement.style.scrollBehavior = isSmoothScroll ? 'smooth' : 'auto'
  }, [isSmoothScroll])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
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
            <span>🔄 Плавная прокрутка</span>
          </label>
        </div>
      )}
    </div>
  )
}

export default SettingsMenu