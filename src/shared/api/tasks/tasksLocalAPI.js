const TASKS_STORAGE_KEY = 'tasks'

const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

const tasksLocalAPI = {
  getAll: () => {
    return new Promise((resolve) => {
      const tasks = localStorage.getItem(TASKS_STORAGE_KEY)
      resolve(tasks ? JSON.parse(tasks) : [])
    })
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      const tasks = localStorage.getItem(TASKS_STORAGE_KEY)
      const parsedTasks = tasks ? JSON.parse(tasks) : []
      const task = parsedTasks.find(t => t.id === id)

      if (task) {
        resolve(task)
      } else {
        reject(new Error('Task not found'))
      }
    })
  },

  delete: (id) => {
    return new Promise((resolve) => {
      const tasks = localStorage.getItem(TASKS_STORAGE_KEY)
      const parsedTasks = tasks ? JSON.parse(tasks) : []

      const updatedTasks = parsedTasks.filter(task => task.id !== id)
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks))

      resolve()
    })
  },


  restore: (task) => {
    return new Promise((resolve) => {
      const tasks = localStorage.getItem(TASKS_STORAGE_KEY)
      const parsedTasks = tasks ? JSON.parse(tasks) : []

      // Проверяем, нет ли уже такой задачи
      const existingIndex = parsedTasks.findIndex(t => t.id === task.id)
      if (existingIndex !== -1) {
        // Если есть — обновляем
        parsedTasks[existingIndex] = task
      } else {
        // Если нет — добавляем
        parsedTasks.push(task)
      }

      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(parsedTasks))
      resolve(task)
    })
  },

  restore: (task) => {
    return new Promise((resolve) => {
      const tasks = localStorage.getItem(TASKS_STORAGE_KEY)
      const parsedTasks = tasks ? JSON.parse(tasks) : []

      const existingIndex = parsedTasks.findIndex(t => t.id === task.id)
      if (existingIndex !== -1) {
        parsedTasks[existingIndex] = task
      } else {
        parsedTasks.push(task)
      }

      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(parsedTasks))
      resolve(task)
    })
  },
  
  add: (task) => {
    return new Promise((resolve) => {
      const tasks = localStorage.getItem(TASKS_STORAGE_KEY)
      const parsedTasks = tasks ? JSON.parse(tasks) : []

      const newTask = {
        ...task,
        id: generateId(),
        comments: task.comments || '',
        createdAt: new Date().toISOString()
      }

      const updatedTasks = [...parsedTasks, newTask]
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks))

      resolve(newTask)
    })
  },

  delete: (id) => {
    return new Promise((resolve) => {
      const tasks = localStorage.getItem(TASKS_STORAGE_KEY)
      const parsedTasks = tasks ? JSON.parse(tasks) : []

      const updatedTasks = parsedTasks.filter(task => task.id !== id)
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks))

      resolve()
    })
  },

  deleteAll: (tasks) => {
    return new Promise((resolve) => {
      const allTasks = localStorage.getItem(TASKS_STORAGE_KEY)
      const parsedAllTasks = allTasks ? JSON.parse(allTasks) : []

      const taskIdsToDelete = new Set(tasks.map(t => t.id))
      const updatedTasks = parsedAllTasks.filter(task => !taskIdsToDelete.has(task.id))

      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks))
      resolve()
    })
  },

  toggleComplete: (id, isDone) => {
    return new Promise((resolve) => {
      const tasks = localStorage.getItem(TASKS_STORAGE_KEY)
      const parsedTasks = tasks ? JSON.parse(tasks) : []

      const updatedTasks = parsedTasks.map(task =>
        task.id === id ? { ...task, isDone } : task
      )

      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks))
      resolve()
    })
  },

  updateComments: (id, comments) => {
    return new Promise((resolve) => {
      const tasks = localStorage.getItem(TASKS_STORAGE_KEY)
      const parsedTasks = tasks ? JSON.parse(tasks) : []

      const updatedTasks = parsedTasks.map(task =>
        task.id === id ? { ...task, comments } : task
      )

      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks))
      resolve()
    })
  }
}

export default tasksLocalAPI