import { Route, Routes } from "react-router-dom"

import UsersList from "../../Pages/Admin/User/UsersList"
import TaskList from "../../Pages/Admin/Task/TaskList"
import WorkReportList from "../../Pages/Admin/WorkReport/WorkReportList"
import LeaveList from "../../Pages/Admin/Leaves/LeaveList"
import Dashboard from "../../Pages/Admin/Dashboard"
import Project from "../../Pages/Admin/Project/Project"
import Department from "../../Pages/Admin/Department/Department"
import JobRoles from "../../Pages/Admin/JobRoles/JobRoles"
import Chat from "../../Pages/Admin/Chat/Chat"
import AdminUsers from "../../Pages/Admin/AdminUsers/AdminUsers"
import SingleProject from "../../Pages/Admin/Project/SingleProject"
import UserModal from "../../Pages/Admin/AdminUsers/UserModal"
import Teams from "../../Pages/Admin/Teams/Teams"
import TeamAction from "../../Pages/Admin/Teams/Action"
import Profile from "../../Pages/Admin/User/Profile"


const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Dashboard />}
      />
      <Route
        path="/users"
        element={<UsersList />}
      />
      <Route
        path="/tasks"
        element={<TaskList />}
      />
      <Route
        path="/work-report"
        element={<WorkReportList />}
      />
      <Route
        path="/leaves"
        element={<LeaveList />}
      />
      <Route
        path="/projects"
        element={<Project />}
      />
      <Route
        path="/project"
        element={<SingleProject />}
      />
      <Route
        path="/departments"
        element={<Department />}
      />
      <Route
        path="/job-roles"
        element={<JobRoles />}
      />
      <Route
        path="/chat-admin"
        element={<Chat />}
      />
      <Route
        path="/roles"
        element={<AdminUsers />}
      />
      <Route
        path="/roles/:action"
        element={<UserModal />}
      />
      <Route
        path="/teams"
        element={<Teams />}
      />
      <Route
        path="/team/:action"
        element={<TeamAction />}
      />
      <Route
        path="/profile"
        element={<Profile />}
      />
    </Routes>
  )
}

export default AdminRoutes