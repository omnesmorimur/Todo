import { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import tasksPermaAPI from '@/shared/api/tasks/tasksPermaAPI';

export const PermaTasksContext = createContext({});

export const PermaTasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tasksPermaAPI.getAll().then((data) => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  const addTask = useCallback((title, onSuccess) => {
    const newTask = { title, isDone: false };
    tasksPermaAPI.add(newTask).then((added) => {
      setTasks((prev) => [...prev, added]);
      onSuccess?.();
    });
  }, []);

  const deleteTask = useCallback((id) => {
    tasksPermaAPI.delete(id).then(() => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    });
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      loading,
      addTask,
      deleteTask,
    }),
    [tasks, loading, addTask, deleteTask]
  );

  return (
    <PermaTasksContext.Provider value={value}>
      {children}
    </PermaTasksContext.Provider>
  );
};