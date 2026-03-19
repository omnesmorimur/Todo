import Field from "@/shared/ui/Field"
import { useContext, useState } from "react"
import { TasksContext } from "@/entities/todo"
import Button2 from "../../shared/ui/Button/Button"

const AddTaskForm = (props) => {
    const { styles } = props

    const [newTaskTitle, setNewTaskTitle] = useState('')

    const {
        addTask,
        newTaskInputRef,
    } = useContext(TasksContext)

    const onSubmit = (event) => {
        event.preventDefault()

        if (!isNewTaskTitleEmpty) {
            addTask(
                clearNewTaskTitle,
                () => setNewTaskTitle(''))
        }
    }

    const onInput = (event) => {
        const { value } = event.target
        const clearValue = value.trim()
        const hasOnlySpaces = value.length > 0 && clearValue.length === 0

        setNewTaskTitle(value)
        setError(hasOnlySpaces ? 'The task cannot be empty' : '')
    }

    const [error, setError] = useState('')

    const clearNewTaskTitle = newTaskTitle.trim()
    const isNewTaskTitleEmpty = clearNewTaskTitle.length === 0

    return (

        <form className={styles.form} onSubmit={onSubmit}>
            <Field
                className={styles.field}
                label="Новая задача"
                id="nex-task"
                ref={newTaskInputRef}
                value={newTaskTitle}
                error={error}
                onInput={onInput}
            />
            <Button2
                type="submit"
                variant="primary"
                size="medium"
                isDisabled={isNewTaskTitleEmpty}
            >
                Добавить
            </Button2>
        </form>)
}
export default AddTaskForm