import { useContext } from "react"
import AddTaskForm from "@/features/add-task"
import SearchTaskForm from "@/features/search-task"
import ToDoInfo from "@/features/stats/ToDoInfo"
import { ToDoList } from "@/entities/todo"
import Button from "@/shared/ui/Button"
import { TasksContext } from "@/entities/todo"
import styles from './Todo.module.scss'
import Button2 from "../../shared/ui/Button/Button"

const ToDo = () => {
    const { firstIncompleteTaskRef } = useContext(TasksContext)

    return (
        <div className={styles.todo}>
            <h1 className={styles.title}>To Do List</h1>
            <AddTaskForm styles={styles} />
            <SearchTaskForm styles={styles} />
            <ToDoInfo styles={styles} />
            <Button2
                variant="primary"
                size="large"
                onClick={() => firstIncompleteTaskRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
                Невыполненые задачи
            </Button2>
            <ToDoList styles={styles} />
        </div>
    )
}

export default ToDo