import { memo, useContext } from 'react'
import { PermaTasksContext } from '@/entities/permaTasks'
import PermaTaskItem from '../PermaTaskItem/PermaTaskItem'

const PermaTaskList = ({ styles: parentStyles }) => {
  const { tasks } = useContext(PermaTasksContext)
  const hasTasks = tasks.length > 0

  if (!hasTasks) {
    return <div className={parentStyles.emptyMessage}>Нет постоянных заметок</div>
  }

  return (
    <ul className={parentStyles.list}>
      {tasks.map((task) => (
        <PermaTaskItem
          className={parentStyles.item}
          key={task.id}
          {...task}
        />
      ))}
    </ul>
  )
}

export default memo(PermaTaskList)