import { memo, useContext } from 'react'
import { TasksContext } from '@/entities/todo'
import RouterLink from '@/shared/ui/RouterLink'
import styles from './ToDoItem.module.scss'

const ToDoItem = (props) => {
  const {
    className = '',
    id,
    title,
    isDone,
  } = props

  const {
    firstIncompleteTaskRef,
    firstIncompleteTaskId,
    deleteTask,
    toggleTaskComplete,
    disappearingTaskId,
    appearingTaskId,
  } = useContext(TasksContext)

  const handleLinkClick = () => {
    sessionStorage.setItem('returnToTaskId', id)
    sessionStorage.setItem('returnToScrollY', window.scrollY)
  }

  return (
    <li 
      id={id}
      className={`
        ${styles.todoItem}
        ${className} 
        ${disappearingTaskId === id ? styles.isDisappearing : ''}
        ${appearingTaskId === id ? styles.isAppearing : ''}
      `}
      ref={id === firstIncompleteTaskId ? firstIncompleteTaskRef : null}
    >
      <label className={styles.label}>
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={isDone}
          onChange={({ target }) => toggleTaskComplete(id, target.checked)}
        />
        <span className="visually-hidden">{title}</span>
      </label>
      <RouterLink to={`tasks/${id}`} onClick={handleLinkClick} aria-label="Task detail page">
        {title}
      </RouterLink>
      <button
        className={styles.deleteButton}
        aria-label="Delete"
        title="Delete"
        onClick={() => deleteTask(id)}
      >
        <svg
          width="20"
          height="20"
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
  )
}
export default memo(ToDoItem)