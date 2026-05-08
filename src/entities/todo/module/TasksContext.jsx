import { createContext, useState, useMemo } from 'react';
import useTasks from './useTasks';
import useIncompleteTaskScroll from './useIncompleteTaskScroll';

export const TasksContext = createContext({});

export const TasksProvider = (props) => {
  const { children } = props;
  const [searchTerm, setSearchTerm] = useState('');

  const {
    tasks,
    filteredTasks,
    archiveTask,           // ← было deleteTask
    archiveAllTasks,      // ← было deleteAllTasks
    toggleTaskComplete,
    searchQuery,
    setSearchQuery,
    newTaskInputRef,
    addTask,
    disappearingTaskId,
    appearingTaskId,
  } = useTasks();

  const {
    firstIncompleteTaskRef,
    firstIncompleteTaskId,
  } = useIncompleteTaskScroll(tasks);

  const value = useMemo(
    () => ({
      tasks,
      filteredTasks,
      archiveTask,           // ← было deleteTask
      archiveAllTasks,      // ← было deleteAllTasks
      toggleTaskComplete,
      searchQuery,
      setSearchQuery,
      newTaskInputRef,
      addTask,
      disappearingTaskId,
      appearingTaskId,
      firstIncompleteTaskRef,
      firstIncompleteTaskId,
      setSearchTerm,
    }),
    [
      tasks,
      filteredTasks,
      archiveTask,           // ← было deleteTask
      archiveAllTasks,      // ← было deleteAllTasks
      toggleTaskComplete,
      searchQuery,
      setSearchQuery,
      newTaskInputRef,
      addTask,
      disappearingTaskId,
      appearingTaskId,
      firstIncompleteTaskRef,
      firstIncompleteTaskId,
      setSearchTerm,
    ]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};