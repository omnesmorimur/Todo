import { memo, useCallback, useContext } from 'react';
import RouterLink from '@/shared/ui/RouterLink';
import { PermaTasksContext } from '../../module/PermaTasksContext';
import styles from './PermaTaskItem.module.scss';

const PermaTasksItem = memo(({ task }) => {
  const { deleteTask } = useContext(PermaTasksContext);

  const handleDelete = useCallback(() => {
    if (confirm('Удалить эту заметку?')) {
      deleteTask(task.id);
    }
  }, [deleteTask, task.id]);

  const handleLinkClick = () => {
    // Сохраняем ID задачи и текущую позицию прокрутки
    sessionStorage.setItem('returnToTaskId', task.id)
    sessionStorage.setItem('returnToScrollY', window.scrollY)
  }

  return (
    <li id={task.id} className={styles.permaItem}>
      <RouterLink 
        to={`/perma/${task.id}`} 
        className={styles.link}
        onClick={handleLinkClick}
      >
        {task.title}
      </RouterLink>
      <button
        className={styles.deleteButton}
        onClick={handleDelete}
        aria-label="Удалить заметку"
      >
        ✕
      </button>
    </li>
  );
});

export default PermaTasksItem;