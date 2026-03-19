import ToDo from "./components/ToDo"
import ToDoDaily from "./components/ToDoDaily"
import { TasksProvider } from "./context/TasksContext"


const App = () => {

  return (
    <TasksProvider>
      <div className="main__wrapper">
        <ToDo />
        <ToDoDaily />
      </div>
    </TasksProvider>
  )
}

export default App
