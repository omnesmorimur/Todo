import { memo, useContext, useMemo } from 'react'
import { TasksContext } from '@/entities/todo'

const ToDoInfo = (props) => {
  const {styles} = props
  const {
    tasks,
    archiveCompletedTasks,  // ← было archiveAllTasks
  } = useContext(TasksContext)

  const total = tasks.length
  const hasCompletedTasks = tasks.some(({isDone}) => isDone === true)
  const done = useMemo(() => {
    return tasks.filter(({isDone}) => isDone).length
  }, [tasks])

  return (
    <div className={styles.info}>
      <div className={styles.totalTasks}>
        Выполнено {done} из {total}
      </div>
      {hasCompletedTasks && (
        <button
          className={styles.archiveCompletedButton}
          type="button"
          onClick={archiveCompletedTasks}
        >
          📦 Архивировать выполненные
        </button>
      )}
    </div>
  )
}

export default memo(ToDoInfo)