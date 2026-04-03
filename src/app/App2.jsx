import Router from "./routing/Router"
import TaskPage from "@/pages/TaskPage"
import PermaTaskPage from "@/pages/PermaTaskPage"
import TasksPage from "@/pages/TasksPage"
import KotletanPage from "@/pages/EasterEgg"
import ScrollToTop from "@/shared/ui/ScrollToTop"
import Header from "@/shared/ui/Header"
import { useRoute } from "./routing/Router"
import './styles'

const App2 = () => {
  const routes = {
    '/': TasksPage,
    '/tasks/:id': TaskPage,
    '/perma/:id': PermaTaskPage,
    '/Kotletan': KotletanPage,
    '*': () => <div>404 Page not found</div>
  }
  
  const path = useRoute()
  const isMainPage = path === '/'
  
  return (
    <>
      {isMainPage && <Header />}
      <div className={isMainPage ? "appContent" : "appContentFull"}>
        <Router routes={routes} />
        <ScrollToTop />
      </div>
    </>
  )
}

export default App2