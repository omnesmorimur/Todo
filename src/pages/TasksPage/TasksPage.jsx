import ToDo from "@/widgets/ToDo"
import ToDoDaily from "@/shared/ui/ToDoDaily/ToDoDaily"
import { TasksProvider } from "@/entities/todo"


const TasksPage = () => {

    return (
        <TasksProvider>
            <div className="mainWrapper">
                <ToDo />
                <ToDoDaily />
            </div>
        </TasksProvider>
    )
}

export default TasksPage