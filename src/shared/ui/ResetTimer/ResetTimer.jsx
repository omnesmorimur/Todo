import { useEffect, memo, useRef } from 'react';
import styles from './ResetTimer.module.scss';

const ResetTimer = memo(({ resetHour, resetMinute, lastResetDate }) => {
  const timeDisplayRef = useRef(null);
  const hintRef = useRef(null);
  const intervalRef = useRef(null);

  // Получить текущее время в МСК
  const getCurrentMSKTime = () => {
    const now = new Date();
    const mskTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    return {
      hours: mskTime.getUTCHours(),
      minutes: mskTime.getUTCMinutes(),
      seconds: mskTime.getUTCSeconds(),
      date: mskTime.toISOString().split('T')[0],
      fullDate: mskTime
    };
  };

  const updateTimer = () => {
    const { hours, minutes, seconds, date: currentDate, fullDate: nowMSK } = getCurrentMSKTime();
    
    // Строим целевую дату (сегодня в время сброса)
    let targetMSK = new Date(nowMSK);
    targetMSK.setUTCHours(resetHour, resetMinute, 0, 0);
    let isToday;
    
    // Если сброс уже был сегодня, следующий сброс завтра
    if (lastResetDate === currentDate) {
      targetMSK.setUTCDate(targetMSK.getUTCDate() + 1);
      isToday = false;
    } else {
      // Если сегодня ещё не сбрасывали
      if (hours > resetHour || (hours === resetHour && minutes >= resetMinute)) {
        targetMSK.setUTCDate(targetMSK.getUTCDate() + 1);
        isToday = false;
      } else {
        isToday = true;
      }
    }
    
    const diffMs = targetMSK.getTime() - nowMSK.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const remainingMinutes = diffMinutes % 60;
    const remainingSeconds = diffSeconds % 60;
    
    const timeString = `${diffHours}ч ${remainingMinutes}м ${remainingSeconds}с`;
    const hintString = `${isToday ? 'сегодня' : 'завтра'} в ${resetHour.toString().padStart(2, '0')}:${resetMinute.toString().padStart(2, '0')} MSK`;
    
    if (timeDisplayRef.current) timeDisplayRef.current.textContent = timeString;
    if (hintRef.current) hintRef.current.textContent = hintString;
  };

  useEffect(() => {
    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalRef.current);
  }, [resetHour, resetMinute, lastResetDate]); // пересоздаём интервал при изменении зависимостей

  return (
    <div className={styles.timer}>
      <span className={styles.label}>Следующий сброс через:</span>
      <span className={styles.time} ref={timeDisplayRef} />
      <span className={styles.hint} ref={hintRef} />
    </div>
  );
});

export default ResetTimer;