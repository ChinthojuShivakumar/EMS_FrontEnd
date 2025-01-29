import { Route, Routes } from "react-router-dom"
import UserWorkReportList from "../../Pages/User/WorkReport/WorkReportList"
import TaskListUser from "../../Pages/User/TaskList/TaskListUser"
import LeaveListUser from "../../Pages/User/Leaves/LeaveList"
import Dashboard from "../../Pages/Admin/Dashboard"


const UserRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Dashboard />}
      />
      <Route
        path="/tasks"
        element={<TaskListUser />}
      />
      <Route
        path="/work-report"
        element={<UserWorkReportList />}
      />
      <Route
        path="/leaves"
        element={<LeaveListUser />}
      />
    </Routes>
  )
}

export default UserRoutes