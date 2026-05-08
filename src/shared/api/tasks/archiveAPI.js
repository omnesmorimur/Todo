const ARCHIVE_STORAGE_KEY = 'archiveTasks'

const archiveAPI = {
  getAll: () => {
    return new Promise((resolve) => {
      const tasks = localStorage.getItem(ARCHIVE_STORAGE_KEY)
      resolve(tasks ? JSON.parse(tasks) : [])
    })
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      const tasks = localStorage.getItem(ARCHIVE_STORAGE_KEY)
      const parsedTasks = tasks ? JSON.parse(tasks) : []
      const task = parsedTasks.find(t => t.id === id)
      
      if (task) {
        resolve(task)
      } else {
        reject(new Error('Archived task not found'))
      }
    })
  },

  archiveTask: (task) => {
    return new Promise(async (resolve) => {
      const archivedTasks = localStorage.getItem(ARCHIVE_STORAGE_KEY)
      const parsedArchive = archivedTasks ? JSON.parse(archivedTasks) : []
      
      const archivedTask = {
        ...task,
        archivedAt: new Date().toISOString()
      }
      
      const updatedArchive = [...parsedArchive, archivedTask]
      localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(updatedArchive))
      
      resolve(archivedTask)
    })
  },

  restoreTask: (id) => {
    return new Promise((resolve, reject) => {
      const tasks = localStorage.getItem(ARCHIVE_STORAGE_KEY)
      const parsedTasks = tasks ? JSON.parse(tasks) : []
      
      const taskToRestore = parsedTasks.find(t => t.id === id)
      if (!taskToRestore) {
        reject(new Error('Task not found in archive'))
        return
      }
      
      const updatedArchive = parsedTasks.filter(task => task.id !== id)
      localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(updatedArchive))
      
      resolve(taskToRestore)
    })
  },

  deletePermanently: (id) => {
    return new Promise((resolve) => {
      const tasks = localStorage.getItem(ARCHIVE_STORAGE_KEY)
      const parsedTasks = tasks ? JSON.parse(tasks) : []
      
      const updatedTasks = parsedTasks.filter(task => task.id !== id)
      localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(updatedTasks))
      
      resolve()
    })
  },

  clearArchive: () => {
    return new Promise((resolve) => {
      localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify([]))
      resolve()
    })
  }
}

export default archiveAPI