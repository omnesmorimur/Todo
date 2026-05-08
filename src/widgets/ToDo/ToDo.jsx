import { useContext, memo, useCallback } from 'react';
import AddTaskForm from '@/features/add-task';
import SearchTaskForm from '@/features/search-task';
import ToDoInfo from '@/features/stats/ToDoInfo';
import { ToDoList, TasksContext } from '@/entities/todo';
import RouterLink from '@/shared/ui/RouterLink';
import Button2 from '@/shared/ui/Button';
import styles from './Todo.module.scss';

const MemoToDoInfo = memo(ToDoInfo);

const ToDo = memo(() => {
  const { firstIncompleteTaskRef } = useContext(TasksContext);

  const scrollToIncomplete = useCallback(() => {
    firstIncompleteTaskRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [firstIncompleteTaskRef]);

  return (
    <div className={styles.todo}>
      <h1 className={styles.title}>To Do List</h1>
      <AddTaskForm styles={styles} />
      <SearchTaskForm styles={styles} />
      <MemoToDoInfo styles={styles} />
      
      <div className={styles.archiveLink}>
        <RouterLink to="/archive">
          <Button2 variant="outline" size="small">
            Перейти к архиву
          </Button2>
        </RouterLink>
      </div>

      <Button2 variant="primary" size="large" onClick={scrollToIncomplete}>
        Невыполненные задачи
      </Button2>
      <ToDoList styles={styles} />
    </div>
  );
});

export default ToDo;