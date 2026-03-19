import { useState, useEffect } from 'react'
import styles from './ToDoDaily.module.scss'
import Button2 from '../Button/Button'

const ToDoDaily = () => {
  const defaultDailyTasks = []

  const RESET_HOUR = 9
  const RESET_MINUTE = 0

  const getCurrentLocalDate = () => {
    const now = new Date()
    return now.toDateString()
  }

  const resetDailyTasks = () => {
    const currentDate = getCurrentLocalDate()
    setDailyTasks(prevTasks =>
      prevTasks.map(task => ({ ...task, isDone: false }))
    )
    localStorage.setItem('dailyTasksLastReset', currentDate)
  }

  const [dailyTasks, setDailyTasks] = useState(() => {
    const savedDailyTasks = localStorage.getItem('dailyTasks')
    const savedLastReset = localStorage.getItem('dailyTasksLastReset')
    const currentDate = getCurrentLocalDate()

    if (savedDailyTasks) {
      const parsedTasks = JSON.parse(savedDailyTasks)
      if (savedLastReset !== currentDate) {
        return parsedTasks.map(task => ({ ...task, isDone: false }))
      }
      return parsedTasks
    }
    return defaultDailyTasks
  })

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks))
  }, [dailyTasks])

  useEffect(() => {
    const savedLastReset = localStorage.getItem('dailyTasksLastReset')
    const currentDate = getCurrentLocalDate()
    
    if (savedLastReset !== currentDate) {
      resetDailyTasks()
    }
  }, [])

  useEffect(() => {
    const now = new Date()
    const nextReset = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      RESET_HOUR,
      RESET_MINUTE,
      0,
      0
    )

    if (now > nextReset) {
      nextReset.setDate(nextReset.getDate() + 1)
    }

    const timeUntilReset = nextReset.getTime() - now.getTime()
    const timer = setTimeout(() => {
      resetDailyTasks()
    }, timeUntilReset)

    return () => clearTimeout(timer)
  }, [RESET_HOUR, RESET_MINUTE])

  const toggleDailyTask = (taskId, isDone) => {
    setDailyTasks(
      dailyTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, isDone }
        }
        return task
      })
    )
  }

  const addDailyTask = (e) => {
    e.preventDefault()
    const trimmedTitle = newTaskTitle.trim()
    if (!trimmedTitle) {
      setError('Название задачи не может быть пустым')
      return
    }

    const newTask = {
      id: `daily-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: trimmedTitle,
      isDone: false
    }

    setDailyTasks([...dailyTasks, newTask])
    setNewTaskTitle('')
    setError('')
  }

  const deleteDailyTask = (taskId) => {
    if (confirm('Удалить эту задачу?')) {
      setDailyTasks(dailyTasks.filter(task => task.id !== taskId))
    }
  }

  const completedCount = dailyTasks.filter(task => task.isDone).length

  const formatResetTime = () => {
    const hours = RESET_HOUR.toString().padStart(2, '0')
    const minutes = RESET_MINUTE.toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const forceReset = () => {
    if (confirm('Принудительно сбросить отметки о выполнении задач?')) {
      resetDailyTasks()
    }
  }

  return (
    <div className={styles.daily}>
      <div className={styles.dailyHeader}>
        <h2 className={styles.dailyTitle}>Ежедневные задачи</h2>
        <span className={styles.dailyProgress}>
          {completedCount} из {dailyTasks.length} выполнено
        </span>
      </div>

      <form onSubmit={addDailyTask} className={styles.dailyForm}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => {
            setNewTaskTitle(e.target.value)
            setError('')
          }}
          placeholder="Новая ежедневная задача..."
          className={styles.dailyInput}
        />
        <Button2
          type="submit"
          variant="primary"
          size="medium"
        >
          Добавить
        </Button2>
        {error && <span className={styles.dailyError}>{error}</span>}
      </form>

      {dailyTasks.length > 0 ? (
        <ul className={styles.dailyList}>
          {dailyTasks.map((task) => (
            <li key={task.id} className={styles.dailyItem}>
              <input
                className={styles.dailyCheckbox}
                id={task.id}
                type="checkbox"
                checked={task.isDone}
                onChange={({ target }) => {
                  toggleDailyTask(task.id, target.checked)
                }}
              />
              <label
                className={styles.dailyLabel}
                htmlFor={task.id}
              >
                {task.title}
              </label>
              <button
                className={styles.dailyDeleteButton}
                onClick={() => deleteDailyTask(task.id)}
                aria-label="Удалить задачу"
                title="Удалить"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
      ) : (
        <div className={styles.dailyEmpty}>Нет ежедневных задач</div>
      )}

      <div className={styles.dailyFooter}>
        <span className={styles.dailyResetInfo}>
          <p>Отметки сбрасываются каждый день в {formatResetTime()}</p>
        </span>
        <Button2
          variant="primary"
          size="small"
          onClick={forceReset}
        >
          🔄 Принудительный сброс отметок
        </Button2>
      </div>
    </div>
  )
}

export default ToDoDaily