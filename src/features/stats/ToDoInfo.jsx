import { memo, useContext, useMemo } from 'react'
import { TasksContext } from '@/entities/todo'

const ToDoInfo = (props) => {
  const {styles} = props
  const {
    tasks,
    deleteAllTasks,
  } = useContext(TasksContext)

  const total = tasks.length
  const hasTasks = total > 0
  const done = useMemo(() => {
    return tasks.filter(({isDone}) => isDone).length
  }, [tasks])

  return (
    <div className={styles.info}>
      <div className={styles.totalTasks}>
        Выполнено {done} из {total}
      </div>
      {hasTasks && (
        <button
          className={styles.deleteAllButton}
          type="button"
          onClick={deleteAllTasks}
        >
          Удалить всё
        </button>
      )}
    </div>
  )
}

export default memo(ToDoInfo)