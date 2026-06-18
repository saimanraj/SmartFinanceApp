import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import LendingPage from "./pages/LendingPage"
import WalletHistoryPage from "./pages/WalletHistoryPage"
import ExpenseHistoryPage from "./pages/ExpenseHistoryPage"
import ReminderPage from "./pages/ReminderPage"

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lending"
           element={<LendingPage />}
        />
        <Route
  path="/wallet-history"
  element={<WalletHistoryPage />}
/>


<Route

  path="/expense-history"

  element={
    <ExpenseHistoryPage />
  }

/>
<Route

  path="/reminders"

  element={
    <ReminderPage />
  }

/>

      </Routes>
          

    </BrowserRouter>
  )
}

export default App