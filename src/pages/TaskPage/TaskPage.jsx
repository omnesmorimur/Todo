import { useEffect, useState } from "react"
import tasksLocalAPI from '@/shared/api/tasks/tasksLocalAPI'
import Button2 from "@/shared/ui/Button"
import styles from './TaskPage.module.scss'

const TaskPage = (props) => {
    const { params } = props
    const taskId = params.id

    const [task, setTask] = useState(null)
    const [comments, setComments] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    useEffect(() => {
        tasksLocalAPI.getById(taskId)
            .then((taskData) => {
                setTask(taskData)
                setComments(taskData.comments || '')
                setHasError(false)
            })
            .catch(() => {
                setHasError(true)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [taskId])

    const saveComments = () => {
        setIsSaving(true)
        tasksLocalAPI.updateComments(taskId, comments)
            .then(() => {
                setSaveSuccess(true)
                setTimeout(() => setSaveSuccess(false), 2000)
            })
            .finally(() => {
                setIsSaving(false)
            })
    }

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>
    }

    if (hasError) {
        return <div className={styles.error}>Task not found!</div>
    }

    return (
        <div className={styles.taskPage}>
            <h1 className={styles.title}>{task.title}</h1>

            <div className={styles.status}>
                <span className={`${styles.statusBadge} ${task.isDone ? styles.completed : styles.pending}`}>
                    {task.isDone ? '✓ Задача выполнена' : '○ Задача не выполнена'}
                </span>
            </div>

            <div className={styles.commentsSection}>
                <h2 className={styles.commentsTitle}>Комментарии</h2>
                <textarea
                    className={styles.commentsTextarea}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Добавьте комментарий к задаче..."
                    rows="6"
                />

                <div className={styles.actionsRow}>
                    <div className={styles.backLink}>
                        <a href="/" onClick={(e) => {
                            e.preventDefault()
                            window.history.back()
                        }}>
                            <Button2
                                variant="outline"
                                size="small"
                            >
                                ← Назад к списку задач
                            </Button2>
                        </a>
                    </div>

                    <Button2
                        variant="primary"
                        size="medium"
                        className={styles.saveButton}
                        onClick={saveComments}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Сохранение...' : 'Сохранить комментарий'}
                    </Button2>
                </div>


                {saveSuccess && (
                    <div className={styles.successRow}>
                        <span className={styles.saveSuccess}>
                            ✓ Сохранено!
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TaskPage