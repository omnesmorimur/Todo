import Router from "./routing/Router";
import HomePage from "@/pages/HomePage";
import TaskPage from "@/pages/TaskPage";
import PermaTaskPage from "@/pages/PermaTaskPage";
import TasksPage from "@/pages/TasksPage";
import ArchivePage from "@/pages/ArchivePage";
import ArchivedTaskPage from "@/pages/ArchivedTaskPage";
import KotletanPage from "@/pages/EasterEgg";
import ScrollToTop from "@/shared/ui/ScrollToTop";
import Header from "@/shared/ui/Header";
import { useRoute } from "./routing/Router";
import { ThemeProvider } from "@/shared/context";
import './styles';

const App2 = () => {
  const routes = {
    '/': HomePage,
    '/tasks': TasksPage, 
    '/tasks/:id': TaskPage,
    '/perma/:id': PermaTaskPage,
    '/archive': ArchivePage,
    '/archive/:id': ArchivedTaskPage,
    '/Kotletan': KotletanPage,
    '*': () => <div>404 Page not found</div>
  };
  
  const path = useRoute();
  
  const isTaskPage = path.startsWith('/tasks/');
  const isPermaTaskPage = path.startsWith('/perma/');
  const isArchivedTaskPage = path.startsWith('/archive/') && path !== '/archive';
  const isTaskListPage = path === '/tasks';
  const isHomePage = path === '/';
  const showHeader = !isTaskPage && !isPermaTaskPage && !isArchivedTaskPage && !isHomePage;
  
  return (
    <ThemeProvider>
      {showHeader && <Header />}
      <div className={showHeader ? "appContent" : "appContentFull"}>
        <Router routes={routes} />
        <ScrollToTop />
      </div>
    </ThemeProvider>
  );
};

export default App2;