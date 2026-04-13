const PERMA_TASKS_STORAGE_KEY = 'permaTasks'

const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

const tasksPermaAPI = {
  getAll: () => {
    return new Promise((resolve) => {
      const tasks = localStorage.getItem(PERMA_TASKS_STORAGE_KEY)
      resolve(tasks ? JSON.parse(tasks) : [])
    })
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      const tasks = localStorage.getItem(PERMA_TASKS_STORAGE_KEY)
      const parsedTasks = tasks ? JSON.parse(tasks) : []
      const task = parsedTasks.find(t => t.id === id)
      
      if (task) {
        resolve(task)
      } else {
        reject(new Error('Task not found'))
      }
    })
  },

add: (task) => {
  return new Promise((resolve) => {
    const tasks = localStorage.getItem(PERMA_TASKS_STORAGE_KEY)
    const parsedTasks = tasks ? JSON.parse(tasks) : []
    
    const newTask = {
      ...task,
      id: generateId(),
      comments: task.comments || '',
      createdAt: new Date().toISOString() 
    }
    
    const updatedTasks = [...parsedTasks, newTask]
    localStorage.setItem(PERMA_TASKS_STORAGE_KEY, JSON.stringify(updatedTasks))
    
    resolve(newTask)
  })
},

  delete: (id) => {
    return new Promise((resolve) => {
      const tasks = localStorage.getItem(PERMA_TASKS_STORAGE_KEY)
      const parsedTasks = tasks ? JSON.parse(tasks) : []
      
      const updatedTasks = parsedTasks.filter(task => task.id !== id)
      localStorage.setItem(PERMA_TASKS_STORAGE_KEY, JSON.stringify(updatedTasks))
      
      resolve()
    })
  },

  updateComments: (id, comments) => {
    return new Promise((resolve) => {
      const tasks = localStorage.getItem(PERMA_TASKS_STORAGE_KEY)
      const parsedTasks = tasks ? JSON.parse(tasks) : []
      
      const updatedTasks = parsedTasks.map(task => 
        task.id === id ? { ...task, comments } : task
      )
      
      localStorage.setItem(PERMA_TASKS_STORAGE_KEY, JSON.stringify(updatedTasks))
      resolve()
    })
  }
}

export default tasksPermaAPI