import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ROUTES } from './constants/routes';

// Pages
import DashboardPage from './pages/dashboard';

function App() {

  return (
    <>
      <Router>
        <Routes>
          {/* Public routes */}

          <Route
            path="/"
            element={
              <Navigate to={ROUTES.DASHBOARD} />
            }
          />
          <Route
            path="*"
            element={
              <Navigate to={ROUTES.DASHBOARD} />
            }
          />
          {/* Redirect to dashboard if no route is found */}
          {/* Protected routes */}
          {/* Dashboard */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <DashboardPage />
            }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
