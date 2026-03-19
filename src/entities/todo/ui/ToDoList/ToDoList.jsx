import { memo, useContext } from 'react'
import { ToDoItem, TasksContext} from "@/entities/todo"

const ToDoList = (props) => {
  const { styles } = props
  const {
    tasks,
    filteredTasks
  } = useContext(TasksContext)

  const hasTask = tasks.length > 0
  const isEmptyFiltredTasks = filteredTasks?.length === 0

  if (!hasTask) {
    return <div className={styles.emptyMessage}>Ещё нет заметок</div>
  }

  if (hasTask && isEmptyFiltredTasks) {
    return <div className={styles.emptyMessage}>Заметка не найдена</div>
  }

  return (
    <ul className={styles.list}>
      {(filteredTasks ?? tasks).map((task) => (
        <ToDoItem
          className={styles.item}
          key={task.id}
          {...task}
        />
      ))}
    </ul>
  )
}

export default memo(ToDoList)