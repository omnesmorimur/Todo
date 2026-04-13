import Field from "@/shared/ui/Field";
import { useContext, useState, useCallback } from "react";
import { TasksContext } from "@/entities/todo";
import Button2 from "../../shared/ui/Button/Button";

const AddTaskForm = (props) => {
  const { styles } = props;
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [error, setError] = useState('');
  const { addTask, newTaskInputRef } = useContext(TasksContext);

  const trimmedTitle = newTaskTitle.trim();
  const isTitleEmpty = trimmedTitle.length === 0;

  const onSubmit = useCallback((event) => {
    event.preventDefault();
    if (isTitleEmpty) return;
    addTask(trimmedTitle, () => setNewTaskTitle(''));
  }, [addTask, trimmedTitle, isTitleEmpty]);

  const onInput = useCallback((event) => {
    const { value } = event.target;
    const hasOnlySpaces = value.length > 0 && value.trim().length === 0;
    setNewTaskTitle(value);
    setError(hasOnlySpaces ? 'Задача не может быть пустой' : '');
  }, []);

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Field
        className={styles.field}
        label="Новая задача"
        id="new-task"
        ref={newTaskInputRef}
        value={newTaskTitle}
        error={error}
        onInput={onInput}
        autoComplete="off"
      />
      <Button2
        type="submit"
        variant="primary"
        size="medium"
        isDisabled={isTitleEmpty}
      >
        Добавить
      </Button2>
    </form>
  );
};

export default AddTaskForm;