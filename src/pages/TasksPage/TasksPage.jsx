import { useEffect, useContext, useRef } from 'react'
import ToDo from "@/widgets/ToDo"
import ToDoDaily from "@/shared/ui/ToDoDaily/ToDoDaily"
import ToDoPermaTasks from "@/widgets/ToDoPermaTasks"
import { TasksProvider, TasksContext } from "@/entities/todo"

const TasksPageContent = () => {
  const { tasks } = useContext(TasksContext)
  const hasRestored = useRef(false)

  // Отключаем авто-восстановление браузера
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  // Восстанавливаем прокрутку после загрузки задач
  useEffect(() => {
    if (tasks.length === 0 || hasRestored.current) return

    const savedScrollY = sessionStorage.getItem('returnToScrollY')
    if (savedScrollY !== null) {
      window.scrollTo({ top: parseInt(savedScrollY), behavior: 'auto' })
      sessionStorage.removeItem('returnToScrollY')
      sessionStorage.removeItem('returnToTaskId')
    }
    
    hasRestored.current = true
  }, [tasks])

  return (
    <div className="mainWrapper">
      <ToDo />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <ToDoDaily />
        <ToDoPermaTasks />
      </div>
    </div>
  )
}

const TasksPage = () => {
  return (
    <TasksProvider>
      <TasksPageContent />
    </TasksProvider>
  )
}

export default TasksPage