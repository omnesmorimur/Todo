import {
    useState,
    useRef,
    useMemo,
    useCallback,
    useEffect,
    useReducer
} from 'react'
import tasksLocalAPI from '@/shared/api/tasks/tasksLocalAPI'
import archiveAPI from '@/shared/api/tasks/archiveAPI'

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

const tasksReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ALL': {
            return Array.isArray(action.task) ? action.task : state
        }
        case 'ADD': {
            return [...state, action.task]
        }
        case 'TOGGLE_COMPLETE': {
            const { id, isDone } = action
            return state.map((task) => {
                return task.id === id ? { ...task, isDone } : task
            })
        }
        case 'DELETE': {
            return state.filter((task) => task.id !== action.id)
        }
        case 'DELETE_COMPLETED': {
            return state.filter((task) => task.isDone !== true)
        }
        case 'DELETE_ALL': {
            return []
        }
        default: {
            return state
        }
    }
}

const useTasks = () => {
    const [tasks, dispatch] = useReducer(tasksReducer, [])
    const [searchQuery, setSearchQuery] = useState('')
    const [disappearingTaskId, setDisappearingTaskId] = useState(null)
    const [appearingTaskId, setAppearingTaskId] = useState(null)

    const newTaskInputRef = useRef(null)

    const archiveTask = useCallback((taskId) => {
        const taskToArchive = tasks.find(t => t.id === taskId)
        if (!taskToArchive) return

        setDisappearingTaskId(taskId)
        
        tasksLocalAPI.delete(taskId)
            .then(() => {
                return archiveAPI.archiveTask(taskToArchive)
            })
            .then(() => {
                setTimeout(() => {
                    dispatch({ type: 'DELETE', id: taskId })
                    setDisappearingTaskId(null)
                }, 400)
            })
            .catch((error) => {
                console.error('Ошибка при архивации:', error)
                setDisappearingTaskId(null)
            })
    }, [tasks])

    const archiveAllTasks = useCallback(() => {
        const isConfirmed = confirm('Переместить все задачи в архив? Их можно будет восстановить.')
        if (!isConfirmed) return

        Promise.all(tasks.map(task => 
            tasksLocalAPI.delete(task.id).then(() => task)
        )).then((deletedTasks) => {
            return Promise.all(deletedTasks.map(task => archiveAPI.archiveTask(task)))
        }).then(() => {
            dispatch({ type: 'DELETE_ALL' })
        }).catch((error) => {
            console.error('Ошибка при архивации всех задач:', error)
        })
    }, [tasks])

    const archiveCompletedTasks = useCallback(() => {
        const completedTasks = tasks.filter(task => task.isDone === true)
        
        if (completedTasks.length === 0) {
            alert('Нет выполненных задач для архивации')
            return
        }
        
        const isConfirmed = confirm(`Переместить ${completedTasks.length} выполненных задач в архив? Их можно будет восстановить.`)
        if (!isConfirmed) return
      
        Promise.all(completedTasks.map(task => 
            tasksLocalAPI.delete(task.id).then(() => task)
        )).then((deletedTasks) => {
            return Promise.all(deletedTasks.map(task => archiveAPI.archiveTask(task)))
        }).then(() => {
            dispatch({ type: 'DELETE_COMPLETED' })
        }).catch((error) => {
            console.error('Ошибка при архивации выполненных задач:', error)
        })
    }, [tasks])

    const toggleTaskComplete = useCallback((taskId, isDone) => {
        tasksLocalAPI.toggleComplete(taskId, isDone).then(() => {
            dispatch({ type: 'TOGGLE_COMPLETE', id: taskId, isDone })
        })
    }, [])

    const addTask = useCallback((title, callbackAfterAdding) => {
        const newTask = {
            title,
            isDone: false,
            comments: '',
            createdAt: new Date().toISOString()
        }

        tasksLocalAPI.add(newTask)
            .then((addedTask) => {
                dispatch({ type: 'ADD', task: addedTask })
                callbackAfterAdding()
                setSearchQuery('')
                if (!isMobile) {
                    newTaskInputRef.current?.focus()
                }
                setAppearingTaskId(addedTask.id)
                setTimeout(() => {
                    setAppearingTaskId(null)
                }, 400)
            })
    }, [])

    useEffect(() => {
        if (!isMobile) {
            newTaskInputRef.current?.focus()
        }
        tasksLocalAPI.getAll().then((serverTasks) => {
            dispatch({ type: 'SET_ALL', task: serverTasks })
        })
    }, [])

    const filteredTasks = useMemo(() => {
        const clearSearchQuery = searchQuery.trim().toLowerCase()
        return clearSearchQuery.length > 0
            ? tasks.filter(({ title }) => title.toLowerCase().includes(clearSearchQuery))
            : null
    }, [searchQuery, tasks])

    return {
        tasks,
        filteredTasks,
        archiveTask,
        archiveAllTasks,
        archiveCompletedTasks,
        toggleTaskComplete,
        searchQuery,
        setSearchQuery,
        newTaskInputRef,
        addTask,
        disappearingTaskId,
        appearingTaskId,
    }
}

export default useTasks