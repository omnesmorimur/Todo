import Router from "./routing/Router"
import TaskPage from "@/pages/TaskPage"
import PermaTaskPage from "@/pages/PermaTaskPage"
import TasksPage from "@/pages/TasksPage"
import KotletanPage from "@/pages/EasterEgg"
import './styles'

const App2 = () => {
  const routes = {
    '/': TasksPage,
    '/tasks/:id': TaskPage,
    '/perma/:id': PermaTaskPage,
    '/Kotletan': KotletanPage,
    '*': () => <div>404 Page not found</div>
  }
  return (
    <Router routes={routes}/>
  )
}

export default App2