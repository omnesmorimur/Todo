import { useContext, memo } from 'react';
import { PermaTasksContext } from '../../module/PermaTasksContext';
import PermaTasksItem from '../PermaTaskItem/PermaTaskItem';
import styles from './PermaTasksList.module.scss';

const PermaTasksList = memo(() => {
  const { tasks } = useContext(PermaTasksContext);

  if (!tasks.length) {
    return <div className={styles.empty}>Нет постоянных заметок</div>;
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <PermaTasksItem key={task.id} task={task} />
      ))}
    </ul>
  );
});

export default PermaTasksList;