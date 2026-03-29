import { useState, useEffect, memo, useCallback } from 'react';
import styles from './ToDoDaily.module.scss';
import Button2 from '@/shared/ui/Button';
import Field from '@/shared/ui/Field';
import Clock from '@/shared/ui/Clock';

// --- Форма добавления задачи (мемоизирована) ---
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

// --- Список задач (мемоизирован) ---
const DailyList = memo(({ tasks, onToggle, onDelete }) => (
  <ul className={styles.dailyList}>
    {tasks.map((task) => (
      <li key={task.id} className={styles.dailyItem}>
        <label className={styles.dailyLabel} htmlFor={task.id}>
          <input
            className={styles.dailyCheckbox}
            id={task.id}
            type="checkbox"
            checked={task.isDone}
            onChange={({ target }) => onToggle(task.id, target.checked)}
          />
          {task.title}
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
        </label>
      </li>
    ))}
  </ul>
));

// --- Основной компонент ---
const ToDoDaily = memo(() => {
  const defaultDailyTasks = [];
  const RESET_HOUR_MSK = 7;
  const RESET_MINUTE = 0;

  const getCurrentMSKDate = () => {
    const now = new Date();
    const mskTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    return mskTime.toISOString().split('T')[0];
  };

  const getCurrentMSKHour = () => {
    const now = new Date();
    const mskTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    return mskTime.getUTCHours();
  };

  // Функция для проверки, нужно ли сбрасывать задачи
  const shouldResetTasks = (lastResetDate) => {
    const currentDate = getCurrentMSKDate();
    const currentHour = getCurrentMSKHour();

    // Если дата последнего сброса не сегодня И уже прошло 7 утра
    return lastResetDate !== currentDate && currentHour >= RESET_HOUR_MSK;
  };

  const [dailyTasks, setDailyTasks] = useState(() => {
    const saved = localStorage.getItem('dailyTasks');
    const lastReset = localStorage.getItem('dailyTasksLastReset');

    if (!saved) {
      return defaultDailyTasks;
    }

    const parsed = JSON.parse(saved);

    // Если нужно сбросить — сбрасываем isDone, но сохраняем задачи
    if (shouldResetTasks(lastReset)) {
      const resetTasks = parsed.map((task) => ({ ...task, isDone: false }));
      localStorage.setItem('dailyTasksLastReset', getCurrentMSKDate());
      return resetTasks;
    }

    return parsed;
  });

  // Сохраняем задачи при каждом изменении
  useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  // Проверка при монтировании (на случай, если нужно сбросить)
  useEffect(() => {
    const lastReset = localStorage.getItem('dailyTasksLastReset');

    if (shouldResetTasks(lastReset)) {
      setDailyTasks((prev) => {
        const resetTasks = prev.map((task) => ({ ...task, isDone: false }));
        localStorage.setItem('dailyTasksLastReset', getCurrentMSKDate());
        return resetTasks;
      });
    }
  }, []);

  // Таймер сброса
  useEffect(() => {
    const scheduleReset = () => {
      const now = new Date();
      const mskNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);

      let nextResetMSK = new Date(
        Date.UTC(
          mskNow.getUTCFullYear(),
          mskNow.getUTCMonth(),
          mskNow.getUTCDate(),
          RESET_HOUR_MSK,
          RESET_MINUTE,
          0,
          0
        )
      );

      if (mskNow >= nextResetMSK) {
        nextResetMSK.setUTCDate(nextResetMSK.getUTCDate() + 1);
      }

      const nextResetUTC = new Date(nextResetMSK.getTime() - 3 * 60 * 60 * 1000);
      const timeUntilReset = nextResetUTC.getTime() - now.getTime();

      const timer = setTimeout(() => {
        const currentDate = getCurrentMSKDate();
        setDailyTasks((prev) => {
          const resetTasks = prev.map((task) => ({ ...task, isDone: false }));
          localStorage.setItem('dailyTasksLastReset', currentDate);
          return resetTasks;
        });
        scheduleReset();
      }, timeUntilReset);

      return timer;
    };

    const timer = scheduleReset();
    return () => clearTimeout(timer);
  }, []);

  const toggleTask = useCallback((id, isDone) => {
    setDailyTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isDone } : task))
    );
  }, []);

  const deleteTask = useCallback((id) => {
    if (confirm('Удалить эту задачу?')) {
      setDailyTasks((prev) => prev.filter((task) => task.id !== id));
    }
  }, []);

  const addTask = useCallback((title) => {
    const newTask = {
      id: `daily-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      isDone: false,
    };
    setDailyTasks((prev) => [...prev, newTask]);
  }, []);

  const forceReset = useCallback(() => {
    if (confirm('Принудительно сбросить отметки о выполнении задач?')) {
      const currentDate = getCurrentMSKDate();
      setDailyTasks((prev) => prev.map((task) => ({ ...task, isDone: false })));
      localStorage.setItem('dailyTasksLastReset', currentDate);
    }
  }, []);

  const completedCount = dailyTasks.filter((task) => task.isDone).length;

  return (
    <div className={styles.daily}>
      <Clock />
      <div className={styles.dailyHeader}>
        <h2 className={styles.dailyTitle}>Ежедневные задачи</h2>
        <span className={styles.dailyProgress}>
          {completedCount} из {dailyTasks.length} выполнено
        </span>
      </div>

      <DailyFormWrapper onAddTask={addTask} />

      {dailyTasks.length > 0 ? (
        <DailyList tasks={dailyTasks} onToggle={toggleTask} onDelete={deleteTask} />
      ) : (
        <div className={styles.dailyEmpty}>Нет ежедневных задач</div>
      )}

      <div className={styles.dailyFooter}>
        <span className={styles.dailyResetInfo}>
          <p>Отметки сбрасываются каждый день в 7.00 MSK</p>
        </span>
        <Button2 variant="primary" size="medium" onClick={forceReset}>
          🔄 Принудительный сброс отметок
        </Button2>
      </div>
    </div>
  );
});

export default ToDoDaily;