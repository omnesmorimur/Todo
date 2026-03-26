import { useRef, useEffect, memo } from 'react';
import styles from './Clock.module.scss';

const Clock = memo(() => {
  const timeRef = useRef(null);
  const dateRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateString = now.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });

      if (timeRef.current) timeRef.current.textContent = timeString;
      if (dateRef.current) dateRef.current.textContent = dateString;
    };

    updateClock(); // сразу показываем текущее время
    const interval = setInterval(updateClock, 1000); // обновление каждую секунду
    // const interval = setInterval(updateClock, 60000); // обновление каждую минуту если понадобится + нужно убрать будет second из toLocaleTimeString

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.clock}>
      <div className={styles.time} ref={timeRef} />
      <div className={styles.date} ref={dateRef} />
    </div>
  );
});

export default Clock;