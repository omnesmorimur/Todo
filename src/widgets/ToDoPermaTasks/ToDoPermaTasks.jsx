import { useContext, useState, memo, useCallback } from 'react';
import { PermaTasksProvider, PermaTasksContext, PermaTaskList } from '@/entities/permaTasks';
import Field from '@/shared/ui/Field';
import Button2 from '@/shared/ui/Button';
import styles from './ToDoPermaTasks.module.scss';

// Форма добавления заметки (управляет своим состоянием)
const PermaForm = memo(({ onAddTask }) => {
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
    setError(hasOnlySpaces ? 'Название заметки не может состоять только из пробелов' : '');
  }, []);

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Field
        className={styles.field}
        label="Новая заметка"
        id="new-perma-task"
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

// Внутренний компонент, использующий контекст
const ToDoPermaTasksContent = () => {
  const { addTask } = useContext(PermaTasksContext);

  const addTaskHandler = useCallback(
    (title) => {
      addTask(title, () => {});
    },
    [addTask]
  );

  return (
    <div className={styles.perma}>
      <div className={styles.header}>
        <h2 className={styles.title}>📝 Постоянные заметки</h2>
      </div>
      <PermaForm onAddTask={addTaskHandler} />
      <PermaTaskList />
    </div>
  );
};

// Основной компонент (обёрнут в memo)
const ToDoPermaTasks = memo(() => {
  return (
    <PermaTasksProvider>
      <ToDoPermaTasksContent />
    </PermaTasksProvider>
  );
});

export default ToDoPermaTasks;