import Router from "./routing/Router"
import TaskPage from "@/pages/TaskPage"
import TasksPage from "@/pages/TasksPage"
import './styles'

const App2 = () => {
    const routes = {
        '/':TasksPage,
        '/tasks/:id': TaskPage,
        '*': () => <div>404 Page not found</div>
    }
    return (
        <Router routes={routes}/>
    )
  }
  
  export default App2
