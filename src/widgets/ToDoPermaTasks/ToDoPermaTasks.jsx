import { useContext, useState } from 'react'
import { PermaTasksProvider, PermaTasksContext } from '@/entities/permaTasks'
import { PermaTaskList } from '@/entities/permaTasks'
import Field from '@/shared/ui/Field'
import Button2 from '@/shared/ui/Button'
import styles from './ToDoPermaTasks.module.scss'

const ToDoPermaTasksContent = () => {
  const { addTask } = useContext(PermaTasksContext)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [error, setError] = useState('')

  const trimmedTitle = newTaskTitle.trim()
  const isTitleEmpty = trimmedTitle.length === 0

  const onSubmit = (event) => {
    event.preventDefault()
    
    addTask(trimmedTitle, () => {
      setNewTaskTitle('')
      setError('')
    })
  }

  const onInput = (event) => {
    const { value } = event.target
    const hasOnlySpaces = value.length > 0 && value.trim().length === 0
    
    setNewTaskTitle(value)
    if (hasOnlySpaces) {
      setError('Название заметки не может состоять только из пробелов')
    } else {
      setError('')
    }
  }

  return (
    <div className={styles.perma}>
      <div className={styles.header}>
        <h2 className={styles.title}>📝 Постоянные заметки</h2>
      </div>

      <form className={styles.form} onSubmit={onSubmit}>
        <Field
          className={styles.field}
          label="Новая заметка"
          id="new-perma-task"
          value={newTaskTitle}
          error={error}
          onInput={onInput}
        />
        <Button2 
          type="submit" 
          variant="primary" 
          size="medium"
          isDisabled={isTitleEmpty}
        >
          Добавить
        </Button2>
      </form>

      <PermaTaskList styles={styles} />
    </div>
  )
}

const ToDoPermaTasks = () => {
  return (
    <PermaTasksProvider>
      <ToDoPermaTasksContent />
    </PermaTasksProvider>
  )
}

export default ToDoPermaTasks