import { useCallback, useEffect, useState } from "react";
import Header from "../../../Components/Navbar/Header";
import SideMenu from "../../../Components/Navbar/SideMenu";
import {
  deleteApiV1,
  fetchApiV1,
  patchApiV1,
  postApiV1,
} from "../../../Components/Constant/Network";
import { TASK, USER } from "../../../Components/Constant/EndPoints";
import Modal from "../../../Components/Constant/Modal";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Pagination from "../../../Components/Pagination/Pagination";
import ReactQuill from "react-quill";
import {
  getPermissionList,
  getUserId,
  getUserRole,
} from "../../../Utils/Functions";
import { fetchApiV2 } from "../../../Components/Constant/Network.V2";

const TaskList = () => {
  const { menusList, submenuList } = getPermissionList();
  const MENU = "Tasks";
  const isMenuMatched = menusList.filter((item) => item.title === MENU);
  const listedPermissions = submenuList.filter(
    (item) => item.menuId === isMenuMatched[0]._id
  );
  const isEdit = listedPermissions.some((edit) => edit.title === "edit");
  const isDelete = listedPermissions.some(
    (remove) => remove.title === "delete"
  );
  const isAdd = listedPermissions.some((add) => add.title === "post");
  const userRole = getUserRole();
  const userId = JSON.parse(localStorage.getItem("user"))._id;

  const [teamList, setTeamList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [phaseList, setPhaseList] = useState([]);
  const adminId = getUserId();

  // const user = JSON.parse(localStorage.getItem("user"))
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const initialState = {
    title: "",
    taskStage: "",
    priorityLevel: "",
    taskDate: "",
    assignTo: [],
    files: [],
    description: "",
    projectId: "",
    phaseId: "",
    managerId: "",
    teamId: "",
  };
  const [inputs, setInputs] = useState(initialState);
  const [assigneeList, setAssigneeList] = useState([]);
  const [userList, setUserList] = useState([]);
  const style = {
    width: 700,
    height: 650,
    display: "flex",
    flexDirection: "column",
    gap: "50px",
    justifyContent: "center",
    alignItems: "center",
    overflowY: "scroll",
    position: "relative",
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(taskList.length / itemsPerPage);
  const currentRows = taskList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleChangeInputs = (e, nV, type) => {
    e.preventDefault();
    if (type === "title") {
      setInputs({ ...inputs, title: e.target.value });
      return;
    }
    if (type === "taskStage") {
      setInputs({ ...inputs, taskStage: e.target.value });
      return;
    }
    if (type === "priorityLevel") {
      setInputs({ ...inputs, priorityLevel: e.target.value });
      return;
    }
    if (type === "taskDate") {
      setInputs({ ...inputs, taskDate: e.target.value });
      return;
    }
    if (type === "projectId") {
      // setInputs({ ...inputs, projectId: e.target.value })
      fetchPhasesByProject(e.target.value);
      const findManager = userList.find(
        (manager) => manager._id === e.target.value
      );
      setInputs({
        ...inputs,
        managerId: findManager.managerId._id,
        projectId: e.target.value,
      });
      return;
    }
    if (type === "assignTo") {
      setInputs({ ...inputs, assignTo: nV });
      return;
    }
    if (type === "files") {
      setInputs({ ...inputs, files: e.target.files });
      return;
    }
    if (type === "phaseId") {
      setInputs({ ...inputs, phaseId: e.target.value });
      return;
    }

    if (type === "teamId") {
      // setInputs({ ...inputs, teamId: nV._id })
      const findManager = teamList.find(
        (manager) => manager.managerId._id === nV.managerId._id
      );
      // console.log(teamList);
      // console.log(nV.managerId._id);
      // console.log(findManager);
      setAssigneeList(findManager.teamMembers);
      setInputs({
        ...inputs,
        managerId: findManager.managerId._id,
        teamId: nV._id,
      });
      return;
    }
    if (type === "managerId") {
      setInputs({ ...inputs, managerId: nV._id });
      return;
    }
  };
  console.log(inputs);

  const handleEditTask = (e, _id) => {
    e.preventDefault();
    const findTask = taskList.find((task) => task?._id === _id);
    // console.log(findTask);

    setInputs({
      ...inputs,
      title: findTask.title,
      priorityLevel: findTask.priorityLevel,
      taskDate: findTask.taskDate?.split("T")[0] || "",
      assignTo: findTask.assignTo,
      taskStage: findTask.taskStage,
      files: findTask.files,
      _id: findTask?._id,
      description: findTask?.description,
      projectId: findTask?.projectId?._id,
      phaseId: findTask?.phaseId,
      managerId: findTask.teamId.managerId,
      teamId: findTask.teamId._id,
    });
    setEditMode(true);
    setIsOpen(true);
    fetchPhasesByProject(findTask.projectId?._id);
  };
  // console.log(assigneeList);

  const fetchTaskList = useCallback(async () => {
    try {
      const FINAL_END_POINT =
        userRole === "USER" ? `/user/task/${userId}` : TASK;
      const response = await fetchApiV1(FINAL_END_POINT);
      if (response.status === 200) {
        const userRole = getUserRole();
        if (userRole === "MANAGER") {
          const filterManagerProjects = response.data.taskList.filter(
            (managerId) => managerId.projectId.managerId === userId
          );
          // console.log(filterManagerProjects);

          return setTaskList(filterManagerProjects);
        }
        // setProjectsList(response.data.projectList)
        setTaskList(response?.data?.taskList);
      } else {
        setTaskList([]);
        throw response;
      }
    } catch (error) {
      throw new Error(error);
    }
  }, [userId, userRole]);
  const fetchEmployeeList = async () => {
    try {
      const response = await fetchApiV1(USER);
      if (response.status === 200) {
        setEmployeeList(response?.data?.usersList);
        const findManagers = response?.data?.usersList.filter(
          (user) => user.role.name === "MANAGER"
        );
        setManagerList(findManagers);
      } else {
        setEmployeeList([]);
        throw response;
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const postTask = async () => {
    const fD = new FormData();
    fD.append("title", inputs.title);
    fD.append("taskStage", inputs.taskStage);
    fD.append("priorityLevel", inputs.priorityLevel);
    fD.append("taskDate", inputs.taskDate);
    fD.append("description", inputs.description);
    fD.append("projectId", inputs.projectId);
    fD.append("phaseId", inputs.phaseId);
    fD.append("managerId", inputs.managerId);
    fD.append("teamId", inputs.teamId);

    inputs.assignTo?.map((item) => {
      return fD.append("assignTo", item?._id);
    });
    const fileArray = Object.values(inputs.files); // Convert to array if needed
    fileArray?.forEach((file) => {
      if (file) {
        fD.append("files", file); // Appending each file
      }
    });

    try {
      const response = await postApiV1(TASK, fD, true);
      if (response.status == 201) {
        clearInputs();
        fetchTaskList();
      }
    } catch (error) {
      clearInputs();
      throw new Error(error);
    }
  };
  const updateTask = async () => {
    const fD = new FormData();
    fD.append("title", inputs.title);
    fD.append("taskStage", inputs.taskStage);
    fD.append("priorityLevel", inputs.priorityLevel);
    fD.append("taskDate", inputs.taskDate);
    fD.append("description", inputs.description);
    fD.append("projectId", inputs.projectId);
    fD.append("managerId", inputs.managerId);
    fD.append("teamId", inputs.teamId);

    inputs.assignTo?.map((item) => {
      return fD.append("assignTo", item?._id);
    });
    const fileArray = inputs?.files ? Object.values(inputs.files) : []; // Convert to array if needed
    fileArray?.forEach((file) => {
      if (file) {
        fD.append("files", file); // Appending each file
      }
    });

    try {
      const response = await patchApiV1(`${TASK}/${inputs?._id}`, fD, true);
      if (response.status == 202) {
        clearInputs();
        fetchTaskList();
      }
    } catch (error) {
      clearInputs();
      throw new Error(error);
    }
  };
  const deleteTask = async (_id) => {
    try {
      const response = await deleteApiV1(`${TASK}/${_id}`);
      if (response.status == 200) {
        clearInputs();
        fetchTaskList();
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const fetchProjects = async () => {
    try {
      const response = await fetchApiV1(`/projects?adminId=${adminId}`);
      if (response.status === 200) {
        setUserList(response.data.projectList);
      } else {
        throw new Error(response);
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const fetchPhasesByProject = async (projectId) => {
    try {
      const filters = new URLSearchParams();
      filters.append("projectId", projectId);
      const adminId = await getUserId();
      const response = await fetchApiV1(
        `/phase?adminId=${adminId}&${filters.toString()}`
      );
      if (response.status === 200) {
        setPhaseList(response.data.phaseList);
      } else {
        throw new Error(response);
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const fetchTeamList = useCallback(async () => {
    try {
      const response = await fetchApiV2(`/team?adminId=${adminId}`);
      if (response.status === 200) {
        setTeamList(response.data.teamList);
      } else {
        throw response;
      }
    } catch (error) {
      console.error(error);
    }
  }, [adminId]);
  useEffect(() => {
    fetchTeamList();
  }, [fetchTeamList]);
  useEffect(() => {
    userRole != "USER" && fetchProjects();
  }, [userRole]);
  const clearInputs = () => {
    try {
      setInputs(initialState);
      setIsOpen(false);
      setIsOpen(false);
    } catch (error) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    fetchTaskList();
    fetchEmployeeList();
  }, [fetchTaskList]);
  return (
    <div>
      <Header />
      <div className="w-full font-roboto font-medium">
        <div className="w-[15%] fixed top-20">
          <SideMenu />
        </div>
        <div className={`ml-[15%] px-5 mt-24 w-[85%]`}>
          <div className="w-full">
            {isAdd && (
              <div className="w-full flex justify-end items-end">
                <button
                  type="button"
                  className="w-52 text-white bg-green-700 py-3"
                  onClick={() => {
                    setIsOpen(true);
                    setEditMode(false);
                  }}
                >
                  Add task
                </button>
              </div>
            )}
            <div
              className={`w-full mt-10 overflow-x-auto custom-scrollbar shadow-sm ${
                userRole === "USER" && "mt-12"
              }`}
            >
              <table className="w-full">
                <thead className="bg-green-300">
                  <tr className="">
                    <th className="py-2 border-r-2">Project Name</th>
                    <th className="py-2 border-r-2">Task Name</th>
                    {/* <th className="py-2 border-r-2">Task Description</th> */}
                    {/* <th className="py-2 border-r-2">Image</th> */}
                    <th className="py-2 border-r-2">Priority</th>
                    <th className="py-2 border-r-2">Task Created</th>
                    <th className="py-2 border-r-2">Task Updated</th>
                    <th className="py-2 border-r-2">Action</th>
                    <th className="py-2 border-r-2">Assigned To</th>
                    <th className="py-2 border-r-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows?.length === 0 && (
                    <tr className="py-2 border-r-2">
                      <td colSpan={10} className="py-5 text-center">
                        No Record Found
                      </td>
                    </tr>
                  )}
                  {currentRows.map((task) => {
                    return (
                      <tr
                        className="text-center font-thin border-2 border-opacity-85"
                        key={task?._id}
                      >
                        <td className="py-2 border-r-2">
                          {task?.projectId?.title}
                        </td>
                        <td className="py-2 border-r-2">{task?.title}</td>
                        {/* <td className="py-2 border-r-2"><div dangerouslySetInnerHTML={{ __html: task?.description }}></div></td> */}
                        {/* <td className="py-2 border-r-2 flex  flex-col gap-5">{
                            task.files?.map((taskImage, i) => {
                              return (
                                <img key={i} src={taskImage} alt={taskImage?._id} className="w-32 h-20" />
                              )
                            })
                          }</td> */}

                        <td className="py-2 border-r-2">
                          {task?.priorityLevel}
                        </td>
                        <td className="py-2 border-r-2">
                          {task?.taskDate?.split("T")[0]}
                        </td>
                        <td className="py-2 border-r-2">
                          {task?.updatedAt?.split("T")[0]}
                        </td>
                        <td className="py-2 border-r-2">{task?.taskStage}</td>
                        <td className="py-2 border-r-2">
                          {task.assignTo?.map((user) => {
                            return (
                              <ul key={user?._id}>
                                <li className="list-disc w-fit ml-10">
                                  {user?.fullName}
                                </li>
                              </ul>
                            );
                          })}
                        </td>
                        <td className="py-2 border-r-2">
                          <div className="w-full flex justify-center items-center gap-5">
                            {isEdit && (
                              <button
                                type="button"
                                className="bg-yellow-500 text-white w-24 rounded-sm h-10"
                                onClick={(e) => handleEditTask(e, task?._id)}
                              >
                                Edit
                              </button>
                            )}
                            {isDelete && (
                              <button
                                type="button"
                                className="bg-red-500 text-white w-24 rounded-sm h-10"
                                onClick={() => deleteTask(task?._id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="text-center font-thin border-2 border-opacity-85">
                    <td colSpan={10} className="px-4 py-4 bg-gray-100">
                      <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} style={style}>
        <div className="font-roboto w-full font-semibold absolute top-0 px-5 py-5">
          <div className="flex justify-between items-center py-2">
            <h1>{editMode ? "Update" : "Add"} Task</h1>
            <Button
              color="error"
              onClick={() => {
                setIsOpen(false);
                clearInputs();
              }}
            >
              close
            </Button>
          </div>
          <Box>
            <div className="w-full grid grid-cols-2 gap-5 my-4">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Project Name
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={inputs.projectId}
                  label="Project Name"
                  onChange={(e) => handleChangeInputs(e, null, "projectId")}
                >
                  {userList?.map((project) => (
                    <MenuItem key={project?._id} value={project?._id}>
                      {project?.title}
                    </MenuItem>
                  ))}
                  {/* <MenuItem value={"TODO"}>Todo</MenuItem>
                <MenuItem value={"IN PROGRESS"}>In Progress</MenuItem>
                <MenuItem value={"COMPLETED"}>Completed</MenuItem> */}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Phase Name
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={inputs.phaseId}
                  label="Project Name"
                  onChange={(e) => handleChangeInputs(e, null, "phaseId")}
                >
                  {phaseList?.map((project) => (
                    <MenuItem key={project?._id} value={project?._id}>
                      {project?.title}
                    </MenuItem>
                  ))}
                  {/* <MenuItem value={"TODO"}>Todo</MenuItem>
                <MenuItem value={"IN PROGRESS"}>In Progress</MenuItem>
                <MenuItem value={"COMPLETED"}>Completed</MenuItem> */}
                </Select>
              </FormControl>
              <TextField
                label="Title"
                name="title"
                onChange={(e) => handleChangeInputs(e, null, "title")}
                value={inputs.title}
              />
              <div className="col-span-2">
                <ReactQuill
                  onChange={(value) =>
                    setInputs({ ...inputs, description: value })
                  }
                  placeholder="task description"
                  value={inputs.description}
                />
              </div>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Task Stage
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={inputs.taskStage}
                  label="Task Stage"
                  onChange={(e) => handleChangeInputs(e, null, "taskStage")}
                >
                  <MenuItem value={"TODO"}>Todo</MenuItem>
                  <MenuItem value={"IN PROGRESS"}>In Progress</MenuItem>
                  <MenuItem value={"COMPLETED"}>Completed</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Priority Level
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={inputs.priorityLevel}
                  label="Priority Level"
                  onChange={(e) => handleChangeInputs(e, null, "priorityLevel")}
                >
                  <MenuItem value={"NORMAL"}>Normal</MenuItem>
                  <MenuItem value={"MEDIUM"}>Medium</MenuItem>
                  <MenuItem value={"HIGH"}>High</MenuItem>
                </Select>
              </FormControl>

              <input
                type="date"
                name="date"
                id="date"
                value={inputs.taskDate}
                className="border-2 py-2 px-2 my-3 rounded-md"
                onChange={(e) => handleChangeInputs(e, null, "taskDate")}
              />

              <Autocomplete
                disablePortal
                options={teamList || []}
                getOptionLabel={(option) => option?.teamName || ""}
                fullWidth
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                renderInput={(params) => <TextField {...params} label="Team" />}
                value={
                  teamList?.find((item) => item._id === inputs.teamId) || null
                }
                onChange={(e, nV) => handleChangeInputs(e, nV, "teamId")}
              />
              <Autocomplete
                disablePortal
                options={managerList || []}
                getOptionLabel={(option) => option?.fullName || ""}
                fullWidth
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                renderInput={(params) => (
                  <TextField {...params} label="Manager" />
                )}
                value={
                  managerList?.find((item) => item._id === inputs.managerId) ||
                  null
                }
                onChange={(e, nV) => handleChangeInputs(e, nV, "managerId")}
              />
              <Autocomplete
                disablePortal
                options={assigneeList}
                getOptionLabel={(option) => option?.fullName || ""}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                fullWidth
                multiple
                value={inputs.assignTo}
                renderInput={(params) => (
                  <TextField {...params} label="Assign To" />
                )}
                onChange={(e, nV) => handleChangeInputs(e, nV, "assignTo")}
              />
              <input
                type="file"
                name="file"
                id="file"
                multiple
                className="fileInput"
                onChange={(e, nV) => handleChangeInputs(e, nV, "files")}
              />
            </div>
            <Button
              onClick={editMode ? updateTask : postTask}
              className="w-32 "
              variant="contained"
            >
              {editMode ? "Update" : "Add"} Task
            </Button>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default TaskList;
