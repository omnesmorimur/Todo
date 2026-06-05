import { useEffect, useState } from "react"
import tasksPermaAPI from '@/shared/api/tasks/tasksPermaAPI'
import Button2 from "@/shared/ui/Button"
import styles from '@/pages/TaskPage/TaskPage.module.scss'
import RouterLink from '@/shared/ui/RouterLink'

const formatDate = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString([], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const PermaTaskPage = (props) => {
  const { params } = props
  const taskId = params.id

  const [task, setTask] = useState(null)
  const [comments, setComments] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    tasksPermaAPI.getById(taskId)
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
    tasksPermaAPI.updateComments(taskId, comments)
      .then(() => {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 2000)
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  if (isLoading) return <div className={styles.loading}>Loading...</div>
  if (hasError) return <div className={styles.error}>Заметка не найдена!</div>

  const formattedDate = formatDate(task.createdAt)

  return (
    <div className={styles.taskPage}>
      <h1 className={styles.title}>{task.title}</h1>

      {formattedDate && (
        <div className={styles.createdAt}>
          Создана: {formattedDate}
        </div>
      )}

      <div className={styles.commentsSection}>
        <h2 className={styles.commentsTitle}>Комментарии</h2>
        <textarea
          className={styles.commentsTextarea}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Добавьте комментарий к заметке..."
          rows="6"
        />

        <div className={styles.actionsRow}>
          <div className={styles.backLink}>
            <RouterLink to="/tasks">
              <Button2 variant="secondary" size="small">
                ← Назад к списку
              </Button2>
            </RouterLink>
          </div>

          <Button2
            variant="primary"
            size="medium"
            onClick={saveComments}
            disabled={isSaving}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить комментарий'}
          </Button2>
        </div>

        {saveSuccess && (
          <div className={styles.successRow}>
            <span className={styles.saveSuccess}>✓ Сохранено!</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default PermaTaskPage