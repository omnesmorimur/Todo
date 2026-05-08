import { useEffect, useState } from "react";
import archiveAPI from '@/shared/api/tasks/archiveAPI';
import Button2 from "@/shared/ui/Button";
import RouterLink from '@/shared/ui/RouterLink';
import styles from '../TaskPage/TaskPage.module.scss';

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString([], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ArchivedTaskPage = (props) => {
  const { params } = props;
  const taskId = params.id;

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    archiveAPI.getById(taskId)
      .then((taskData) => {
        setTask(taskData);
        setHasError(false);
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [taskId]);

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (hasError) {
    return <div className={styles.error}>Задача не найдена в архиве</div>;
  }

  return (
    <div className={styles.taskPage}>
      <h1 className={styles.title}>{task.title}</h1>

      <div className={styles.status}>
        <span className={`${styles.statusBadge} ${task.isDone ? styles.completed : styles.pending}`}>
          {task.isDone ? '✓ Задача выполнена' : '○ Задача не выполнена'}
        </span>
        {task.createdAt && (
          <div className={styles.createdAt}>
            📅 Создана: {formatDate(task.createdAt)}
          </div>
        )}
        {task.archivedAt && (
          <div className={styles.archivedAt}>
            📦 Архивирована: {formatDate(task.archivedAt)}
          </div>
        )}
      </div>

      <div className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>Комментарии</h2>
        <textarea
          className={styles.commentsTextarea}
          value={task.comments || ''}
          readOnly
          placeholder="Комментариев нет"
          rows="6"
        />
      </div>

      <div className={styles.actionsRow}>
        <RouterLink to="/archive">
          <Button2 variant="secondary" size="small">
            ← Назад к архиву
          </Button2>
        </RouterLink>
      </div>
    </div>
  );
};

export default ArchivedTaskPage;