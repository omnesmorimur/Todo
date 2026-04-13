import { useState, useEffect, useRef } from 'react';
import Field from '@/shared/ui/Field';
import Button2 from '@/shared/ui/Button';
import styles from './Timer.module.scss';

const Timer = () => {
  const [title, setTitle] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef(null);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  const handleHourFocus = () => {
    if (hours === 0) setHours('');
  };

  const handleHourBlur = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value === '') {
      setHours(0);
    } else {
      setHours(Math.min(23, Math.max(0, value)));
    }
  };

  const handleMinuteFocus = () => {
    if (minutes === 0) setMinutes('');
  };

  const handleMinuteBlur = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value === '') {
      setMinutes(0);
    } else {
      setMinutes(Math.min(59, Math.max(0, value)));
    }
  };

  const handleSecondFocus = () => {
    if (seconds === 0) setSeconds('');
  };

  const handleSecondBlur = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value === '') {
      setSeconds(0);
    } else {
      setSeconds(Math.min(59, Math.max(0, value)));
    }
  };

  const playSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      const playBeep = (frequency, duration) => {
        return new Promise((resolve) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = frequency;
          gainNode.gain.value = 0.45;

          oscillator.start();
          gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration);
          oscillator.stop(audioContext.currentTime + duration);

          setTimeout(resolve, duration * 1000);
        });
      };

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      playBeep(1760, 1.1).then(() => {
        return new Promise(resolve => setTimeout(resolve, 200));
      }).then(() => {
        return playBeep(440, 0.2);
      }).then(() => {
        return new Promise(resolve => setTimeout(resolve, 200));
      }).then(() => {
        return playBeep(1760, 0.25);
      }).then(() => {
        return new Promise(resolve => setTimeout(resolve, 200));
      }).then(() => {
        return playBeep(440, 0.2);
      }).then(() => {
        return new Promise(resolve => setTimeout(resolve, 200));
      }).then(() => {
        return playBeep(880, 0.3);
      });

    } catch (e) {
      console.log('Web Audio API не поддерживается');
    }
  };

  const showNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('⏰ Таймер завершён!', {
        body: title || 'Время вышло',
        icon: '/Todo/icon-192.png',
        silent: false
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const startTimer = () => {
    if (totalSeconds === 0) {
      alert('Установите время');
      return;
    }
    setIsActive(true);
    setIsCompleted(false);
    setTimeLeft(totalSeconds);

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const stopTimer = () => {
    setIsActive(false);
    setIsCompleted(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeLeft(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTitle('');
  };

  const resetTimer = () => {
    setIsCompleted(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTitle('');
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsActive(false);
            setIsCompleted(true);
            playSound();
            showNotification();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const formatTime = (total) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`${styles.timer} ${isCompleted ? styles.completed : ''}`}>
      <h3 className={styles.title}> Таймер</h3>

      {isCompleted ? (
        <>
          <div className={styles.completedMessage}>
            <span className={styles.completedIcon}>✓</span>
            <span>Таймер завершён!</span>
          </div>
          {title && <div className={styles.completedTitle}>{title}</div>}
          <Button2 variant="primary" size="medium" onClick={resetTimer}>
            Новый таймер
          </Button2>
        </>
      ) : !isActive ? (
        <>
          <Field
            className={styles.field}
            label="Что делаем?"
            id="timer-title"
            value={title}
            onInput={(e) => setTitle(e.target.value)}
          />
          <div className={styles.timeInputs}>
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => setHours(Math.min(23, Math.max(0, Number(e.target.value) || 0)))}
              onFocus={handleHourFocus}
              onBlur={handleHourBlur}
              className={styles.timeInput}
            />
            <span>:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(Math.min(59, Math.max(0, Number(e.target.value) || 0)))}
              onFocus={handleMinuteFocus}
              onBlur={handleMinuteBlur}
              className={styles.timeInput}
            />
            <span>:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(Math.min(59, Math.max(0, Number(e.target.value) || 0)))}
              onFocus={handleSecondFocus}
              onBlur={handleSecondBlur}
              className={styles.timeInput}
            />
          </div>
          <Button2
            variant="primary"
            size="medium"
            onClick={startTimer}
            isDisabled={totalSeconds === 0}
          >
            Старт
          </Button2>
        </>
      ) : (
        <>
          <div className={styles.display}>{formatTime(timeLeft)}</div>
          {title && <div className={styles.taskTitle}>{title}</div>}
          <Button2 variant="secondary" size="medium" onClick={stopTimer}>
            Отмена
          </Button2>
        </>
      )}
    </div>
  );
};

export default Timer;