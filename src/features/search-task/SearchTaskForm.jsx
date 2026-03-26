import { useContext, useState, memo, useCallback } from 'react';
import { TasksContext } from '@/entities/todo';
import Field from '@/shared/ui/Field';

const SearchTaskForm = memo(({ styles }) => {
  const { setSearchQuery } = useContext(TasksContext);
  const [value, setValue] = useState('');

  const onInput = useCallback(
    (e) => {
      const newValue = e.target.value;
      setValue(newValue);
      setSearchQuery(newValue);
    },
    [setSearchQuery]
  );

  return (
    <div className={styles.search}>
      <Field
        className={styles.field}
        label="Поиск задач"
        id="search-task"
        value={value}
        onInput={onInput}
      />
    </div>
  );
});

export default SearchTaskForm;