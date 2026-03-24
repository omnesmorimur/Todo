import { useState, useReducer, useCallback, useEffect } from 'react'
import tasksPermaAPI from '@/shared/api/tasks/tasksPermaAPI'

const permaTasksReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ALL':
      return Array.isArray(action.tasks) ? action.tasks : state
    case 'ADD':
      return [...state, action.task]
    case 'DELETE':
      return state.filter(task => task.id !== action.id)
    default:
      return state
  }
}

const usePermaTasks = () => {
  const [tasks, dispatch] = useReducer(permaTasksReducer, [])
  const [disappearingTaskId, setDisappearingTaskId] = useState(null)

  const deleteTask = useCallback((taskId) => {
    tasksPermaAPI.delete(taskId).then(() => {
      setDisappearingTaskId(taskId)
      setTimeout(() => {
        dispatch({ type: 'DELETE', id: taskId })
        setDisappearingTaskId(null)
      }, 400)
    })
  }, [])

  const addTask = useCallback((title, callbackAfterAdding) => {
    const newTask = { title, comments: '' }
    tasksPermaAPI.add(newTask).then((addedTask) => {
      dispatch({ type: 'ADD', task: addedTask })
      callbackAfterAdding()
    })
  }, [])

  useEffect(() => {
    tasksPermaAPI.getAll().then((serverTasks) => {
      dispatch({ type: 'SET_ALL', tasks: serverTasks })
    })
  }, [])

  return {
    tasks,
    deleteTask,
    addTask,
    disappearingTaskId,
  }
}

export default usePermaTasks