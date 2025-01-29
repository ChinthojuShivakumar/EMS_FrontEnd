
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import LoginPage from './Pages/Auth/LoginPage';
import UnProtectedRoute from './Utils/UnProtectedRoute';
import ProtectedRoute from './Utils/ProtectedRoute';
import ErrorBoundary from './Utils/ErrorBoundary';
import AdminRoutes from './Routes/Admin/AdminRoutes';
import UserRoutes from './Routes/User/UserRoutes';
import 'react-quill/dist/quill.snow.css';
import HtmlErrorPage from './Utils/Html.Error';
function App() {
  // const getUserRole = () => {
  //   const userType = JSON.parse(localStorage.getItem('role'))
  //   return userType;
  // };
  // const getDefaultRoute = () => {
  //   const userType = getUserRole();
  //   if (userType === 'SUPERADMIN' || userType === "ADMIN") return '/admin';
  //   if (userType === 'USER') return '/user';
  //   return '/login';
  // };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Navigate to={getDefaultRoute()} />} /> */}
          <Route
            path='/*'
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <AdminRoutes />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path='/user/*'
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <UserRoutes />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path='/login'
            element={
              <UnProtectedRoute>
                <ErrorBoundary>
                  <LoginPage />
                </ErrorBoundary>
              </UnProtectedRoute>
            }
          />
          <Route path="/html-error" element={<HtmlErrorPage />} />
        </Routes>
        <ToastContainer
          limit={2}
        />
      </BrowserRouter>

    </div>
  )
}

export default App
