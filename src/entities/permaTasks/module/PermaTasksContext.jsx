import { createContext, useMemo } from 'react'
import usePermaTasks from './usePermaTasks'

export const PermaTasksContext = createContext({})

export const PermaTasksProvider = ({ children }) => {
  const {
    tasks,
    deleteTask,
    addTask,
    disappearingTaskId,
  } = usePermaTasks()

  const value = useMemo(() => ({
    tasks,
    deleteTask,
    addTask,
    disappearingTaskId,
  }), [tasks, deleteTask, addTask, disappearingTaskId])

  return (
    <PermaTasksContext.Provider value={value}>
      {children}
    </PermaTasksContext.Provider>
  )
}