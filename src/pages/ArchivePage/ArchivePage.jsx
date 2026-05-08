import { useState, useEffect } from 'react';
import archiveAPI from '@/shared/api/tasks/archiveAPI';
import tasksLocalAPI from '@/shared/api/tasks/tasksLocalAPI';
import Button2 from '@/shared/ui/Button';
import RouterLink from '@/shared/ui/RouterLink';
import styles from './ArchivePage.module.scss';

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

const ArchivePage = () => {
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    archiveAPI.getAll().then((tasks) => {
      setArchivedTasks(tasks);
      setIsLoading(false);
    });
  }, []);

  const restoreTask = (task) => {
    setRestoringId(task.id);

    tasksLocalAPI.restore(task).then(() => {
      archiveAPI.restoreTask(task.id).then(() => {
        setArchivedTasks(prev => prev.filter(t => t.id !== task.id));
        setRestoringId(null);
      });
    }).catch(() => {
      setRestoringId(null);
    });
  };

  const deletePermanently = (id) => {
    if (confirm('Удалить задачу навсегда? Это действие нельзя отменить.')) {
      setDeletingId(id);
      archiveAPI.deletePermanently(id).then(() => {
        setArchivedTasks(prev => prev.filter(t => t.id !== id));
        setDeletingId(null);
      });
    }
  };

  const clearAllArchive = () => {
    if (confirm('Очистить весь архив? Все задачи будут удалены безвозвратно.')) {
      archiveAPI.clearArchive().then(() => {
        setArchivedTasks([]);
      });
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка архива...</div>;
  }

  return (
    <div className={styles.archivePage}>
      <div className={styles.header}>
        <h1 className={styles.title}>📦 Архив задач</h1>
        <div className={styles.controls}>

          <Button2 variant="outline" size="small" onClick={clearAllArchive}>
            🗑️ Очистить архив
          </Button2>
            <RouterLink to="/">
              <Button2 variant="secondary" size="small">
                ← Назад к задачам
              </Button2>
            </RouterLink>
          
        </div>
      </div>

      {archivedTasks.length === 0 ? (
        <div className={styles.empty}>
          <p>Архив пуст</p>
          <RouterLink to="/">
            <Button2 variant="primary" size="medium">
              Перейти к задачам
            </Button2>
          </RouterLink>
        </div>
      ) : (
        <>


          <ul className={styles.list}>
            {archivedTasks.map((task) => (
              <li key={task.id} className={styles.item}>
                <div className={styles.content}>
                  <RouterLink to={`/archive/${task.id}`} className={styles.titleLink}>
                    {task.title}
                  </RouterLink>
                  <div className={styles.meta}>
                    <span>Создана: {formatDate(task.createdAt)}</span>
                    <span>Архивирована: {formatDate(task.archivedAt)}</span>
                  </div>
                </div>
                <div className={styles.actions}>
                  <button
                    className={styles.restoreButton}
                    onClick={() => restoreTask(task)}
                    disabled={restoringId === task.id}
                  >
                    {restoringId === task.id ? '...' : '↩️ Восстановить'}
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deletePermanently(task.id)}
                    disabled={deletingId === task.id}
                  >
                    {deletingId === task.id ? '...' : '🗑️ Удалить навсегда'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ArchivePage;