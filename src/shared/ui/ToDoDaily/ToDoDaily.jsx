import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import styles from './ToDoDaily.module.scss';
import Button2 from '@/shared/ui/Button';
import Field from '@/shared/ui/Field';
import Clock from '@/shared/ui/Clock';
import ResetTimer from '@/shared/ui/ResetTimer';

const DailyFormWrapper = memo(({ onAddTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [error, setError] = useState('');

  const trimmedTitle = newTaskTitle.trim();
  const isTitleEmpty = trimmedTitle.length === 0;

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!trimmedTitle) return;
      onAddTask(trimmedTitle);
      setNewTaskTitle('');
      setError('');
    },
    [trimmedTitle, onAddTask]
  );

  const onInput = useCallback((e) => {
    const { value } = e.target;
    const hasOnlySpaces = value.length > 0 && value.trim().length === 0;
    setNewTaskTitle(value);
    setError(hasOnlySpaces ? 'Название задачи не может состоять только из пробелов' : '');
  }, []);

  return (
    <form className={styles.dailyForm} onSubmit={onSubmit}>
      <Field
        className={styles.field}
        label="Новая задача"
        id="new-daily-task"
        value={newTaskTitle}
        error={error}
        onInput={onInput}
      />
      <Button2 type="submit" variant="primary" size="medium" isDisabled={isTitleEmpty}>
        Добавить
      </Button2>
    </form>
  );
});

const DailyList = memo(({ tasks, onToggle, onDelete }) => (
  <ul className={styles.dailyList}>
    {tasks.map((task) => (
      <li key={task.id} className={styles.dailyItem}>
        <input
          className={styles.dailyCheckbox}
          id={task.id}
          type="checkbox"
          checked={task.isDone}
          onChange={({ target }) => onToggle(task.id, target.checked)}
        />
        <label className={styles.dailyLabel} htmlFor={task.id}>
          {task.title}
        </label>
        <button
          className={styles.dailyDeleteButton}
          onClick={() => onDelete(task.id)}
          aria-label="Удалить задачу"
          title="Удалить"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="#757575"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </li>
    ))}
  </ul>
));

const ResetTimeSettings = memo(({ resetHour, resetMinute, onSave }) => {
  const [hour, setHour] = useState(resetHour);
  const [minute, setMinute] = useState(resetMinute);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSave(hour, minute);
    setIsOpen(false);
  };

  return (
    <div className={styles.settingsWrapper}>
      <Button2
        variant="secondary"
        size="small"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.settingsButton}
      >
        ⚙️ Настройка времени
      </Button2>

      {isOpen && (
        <div className={styles.settingsPanel}>
          <h3 className={styles.settingsTitle}>Время ежедневного сброса (МСК)</h3>
          <div className={styles.timeInputs}>
            <div className={styles.timeInputGroup}>
              <label>Часы:</label>
              <input
                type="number"
                min="0"
                max="23"
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className={styles.timeInput}
              />
            </div>
            <div className={styles.timeInputGroup}>
              <label>Минуты:</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                className={styles.timeInput}
              />
            </div>
          </div>
          <div className={styles.settingsActions}>
            <Button2 variant="primary" size="small" onClick={handleSave}>
              Сохранить
            </Button2>
            <Button2 variant="outline" size="small" onClick={() => setIsOpen(false)}>
              Отмена
            </Button2>
          </div>
        </div>
      )}
    </div>
  );
});

// --- Основной компонент ---
const ToDoDaily = memo(() => {
  const defaultDailyTasks = [];

  // Загрузка сохранённых настроек времени
  const loadResetTime = () => {
    const savedHour = localStorage.getItem('dailyTasksResetHour');
    const savedMinute = localStorage.getItem('dailyTasksResetMinute');
    return {
      hour: savedHour !== null ? parseInt(savedHour) : 7,
      minute: savedMinute !== null ? parseInt(savedMinute) : 0
    };
  };

  const [resetHour, setResetHour] = useState(loadResetTime().hour);
  const [resetMinute, setResetMinute] = useState(loadResetTime().minute);
  const [lastReset, setLastReset] = useState(() => 
    localStorage.getItem('dailyTasksLastReset')
  );

  const getCurrentMSKTime = useCallback(() => {
    const now = new Date();
    const mskTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    return {
      hours: mskTime.getUTCHours(),
      minutes: mskTime.getUTCMinutes(),
      seconds: mskTime.getUTCSeconds()
    };
  }, []);

  const getCurrentMSKDate = useCallback(() => {
    const now = new Date();
    const mskTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    return mskTime.toISOString().split('T')[0];
  }, []);

  const shouldReset = useCallback(() => {
    const currentDate = getCurrentMSKDate();
    const { hours, minutes } = getCurrentMSKTime();
    
    if (lastReset !== currentDate) {
      if (hours > resetHour) return true;
      if (hours === resetHour && minutes >= resetMinute) return true;
    }
    return false;
  }, [lastReset, resetHour, resetMinute, getCurrentMSKDate, getCurrentMSKTime]);

  const loadTasks = useCallback(() => {
    const saved = localStorage.getItem('dailyTasks');
    const lastResetFromStorage = localStorage.getItem('dailyTasksLastReset');

    if (!saved) return defaultDailyTasks;
    
    const parsed = JSON.parse(saved);
    
    if (lastResetFromStorage !== getCurrentMSKDate() && shouldReset()) {
      const resetTasks = parsed.map(task => ({ ...task, isDone: false }));
      localStorage.setItem('dailyTasksLastReset', getCurrentMSKDate());
      setLastReset(getCurrentMSKDate());
      return resetTasks;
    }
    
    return parsed;
  }, [shouldReset, getCurrentMSKDate, defaultDailyTasks]);

  const [dailyTasks, setDailyTasks] = useState(loadTasks);

  useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  useEffect(() => {
    localStorage.setItem('dailyTasksResetHour', resetHour);
    localStorage.setItem('dailyTasksResetMinute', resetMinute);
  }, [resetHour, resetMinute]);

  const performReset = useCallback(() => {
    const currentDate = getCurrentMSKDate();
    setDailyTasks(prev => {
      const resetTasks = prev.map(task => ({ ...task, isDone: false }));
      localStorage.setItem('dailyTasksLastReset', currentDate);
      setLastReset(currentDate);
      return resetTasks;
    });
  }, [getCurrentMSKDate]);

  useEffect(() => {
    const checkReset = () => {
      if (shouldReset()) {
        performReset();
      }
    };
    
    const interval = setInterval(checkReset, 1000);
    return () => clearInterval(interval);
  }, [shouldReset, performReset]);

  useEffect(() => {
    const checkAndReset = () => {
      if (shouldReset()) {
        performReset();
      }
    };

    checkAndReset();

    const handlePageShow = (event) => {
      if (event.persisted) {
        checkAndReset();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndReset();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [shouldReset, performReset]);

  const toggleTask = useCallback((id, isDone) => {
    setDailyTasks(prev =>
      prev.map(task => task.id === id ? { ...task, isDone } : task)
    );
  }, []);

  const deleteTask = useCallback((id) => {
    if (confirm('Удалить эту задачу?')) {
      setDailyTasks(prev => prev.filter(task => task.id !== id));
    }
  }, []);

  const addTask = useCallback((title) => {
    const newTask = {
      id: `daily-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      isDone: false,
    };
    setDailyTasks(prev => [...prev, newTask]);
  }, []);

  const forceReset = useCallback(() => {
    if (confirm('Принудительно сбросить отметки о выполнении задач?')) {
      const currentDate = getCurrentMSKDate();
      setDailyTasks(prev => prev.map(task => ({ ...task, isDone: false })));
      localStorage.setItem('dailyTasksLastReset', currentDate);
      setLastReset(currentDate);
    }
  }, [getCurrentMSKDate]);

  const handleResetTimeSave = useCallback((hour, minute) => {
    setResetHour(hour);
    setResetMinute(minute);
    if (shouldReset()) {
      performReset();
    }
  }, [shouldReset, performReset]);

  const completedCount = useMemo(() => 
    dailyTasks.filter(task => task.isDone).length,
    [dailyTasks]
  );

  return (
    <div className={styles.daily}>
      <Clock />
      <div className={styles.dailyHeader}>
        <h2 className={styles.dailyTitle}>Ежедневные задачи</h2>
        <span className={styles.dailyProgress}>
          {completedCount} из {dailyTasks.length} выполнено
        </span>
      </div>

      <ResetTimeSettings 
        resetHour={resetHour} 
        resetMinute={resetMinute} 
        onSave={handleResetTimeSave} 
      />

      <ResetTimer 
        resetHour={resetHour} 
        resetMinute={resetMinute} 
        lastResetDate={lastReset}
      />

      <DailyFormWrapper onAddTask={addTask} />

      {dailyTasks.length > 0 ? (
        <DailyList tasks={dailyTasks} onToggle={toggleTask} onDelete={deleteTask} />
      ) : (
        <div className={styles.dailyEmpty}>Нет ежедневных задач</div>
      )}

      <div className={styles.dailyFooter}>
        <Button2 variant="primary" size="medium" onClick={forceReset}>
          🔄 Принудительный сброс отметок
        </Button2>
      </div>
    </div>
  );
});

export default ToDoDaily;