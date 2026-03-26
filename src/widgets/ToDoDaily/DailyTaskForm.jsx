import { memo, useState } from 'react';
import Field from '@/shared/ui/Field';
import Button2 from '@/shared/ui/Button/Button';
import styles from './ToDoDaily.module.scss';

const DailyTaskForm = memo(({ onAddTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [error, setError] = useState('');

  const trimmedTitle = newTaskTitle.trim();
  const isTitleEmpty = trimmedTitle.length === 0;

  const onSubmit = (e) => {
    e.preventDefault();
    if (isTitleEmpty) return;
    onAddTask(trimmedTitle);
    setNewTaskTitle('');
    setError('');
  };

  const onInput = (e) => {
    const { value } = e.target;
    const hasOnlySpaces = value.length > 0 && value.trim().length === 0;
    setNewTaskTitle(value);
    setError(hasOnlySpaces ? 'Название задачи не может состоять только из пробелов' : '');
  };

  return (
    <form className={styles.dailyForm} onSubmit={onSubmit}>
      <Field
        className={styles.field}
        label="Новая задача"
        id="new-daily-task"
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

export default DailyTaskForm;