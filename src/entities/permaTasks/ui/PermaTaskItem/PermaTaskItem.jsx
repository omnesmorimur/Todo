import { memo, useContext } from 'react'
import { PermaTasksContext } from '@/entities/permaTasks'
import RouterLink from '@/shared/ui/RouterLink'
import styles from './PermaTaskItem.module.scss'

const PermaTaskItem = (props) => {
  const { className = '', id, title } = props
  const { deleteTask, disappearingTaskId } = useContext(PermaTasksContext)

  const handleDelete = () => {
    if (confirm('Удалить эту заметку?')) {
      deleteTask(id)
    }
  }

  return (
    <li className={`
      ${styles.permaItem}
      ${className}
      ${disappearingTaskId === id ? styles.isDisappearing : ''}
    `}>
      <RouterLink to={`perma/${id}`} className={styles.link}>
        {title}
      </RouterLink>
      <button
        className={styles.deleteButton}
        aria-label="Delete"
        title="Delete"
        onClick={handleDelete}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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

export default memo(PermaTaskItem)