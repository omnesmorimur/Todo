import ToDo from "@/widgets/ToDo"
import ToDoDaily from "@/shared/ui/ToDoDaily/ToDoDaily"
import ToDoPermaTasks from "@/widgets/ToDoPermaTasks"
import { TasksProvider } from "@/entities/todo"

const TasksPage = () => {
  return (
    <TasksProvider>
      <div className="mainWrapper">
        <ToDo />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <ToDoDaily />
          <ToDoPermaTasks />
        </div>
      </div>
    </TasksProvider>
  )
}

export default TasksPage