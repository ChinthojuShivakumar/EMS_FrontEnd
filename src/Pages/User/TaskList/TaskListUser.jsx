import { useCallback, useEffect, useState } from "react"
import Header from "../../../Components/Navbar/Header"
import SideMenu from "../../../Components/Navbar/SideMenu"
import { fetchApiV1, patchApiV1, postApiV1 } from "../../../Components/Constant/Network"
import { TASK } from "../../../Components/Constant/EndPoints"
import Modal from "../../../Components/Constant/Modal"
import {  Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import Pagination from "../../../Components/Pagination/Pagination"



const TaskListUser = () => {
  const [taskList, setTaskList] = useState([])
  // const [employeeList, setEmployeeList] = useState([])
  const userId = JSON.parse(localStorage.getItem("user"))._id
  const [isOpen, setIsOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(taskList.length / itemsPerPage)
  const currentRows = taskList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const initialState = {
    taskStage: "",
    assignTo: [],
  }
  const [inputs, setInputs] = useState(initialState)
  const style = { width: "500px", height: "auto", display: "flex", flexDirection: "column", gap: "50px", justifyContent: "center", alignItems: "center" }
  const handleChangeInputs = (e, nV, type) => {
    e.preventDefault()
    if (type === "title") {
      setInputs({ ...inputs, title: e.target.value })
      return
    }
    if (type === "taskStage") {
      setInputs({ ...inputs, taskStage: e.target.value })
      return
    }
    if (type === "priorityLevel") {
      setInputs({ ...inputs, priorityLevel: e.target.value })
      return
    }
    if (type === "taskDate") {
      setInputs({ ...inputs, taskDate: e.target.value })
      return
    }
    if (type === "assignTo") {
      setInputs({ ...inputs, assignTo: nV })
      return
    }
    if (type === "files") {
      setInputs({ ...inputs, files: e.target.files })
      return
    }
  }
  const handleEditTask = (e, _id) => {
    e.preventDefault()
    const findTask = taskList.find((task) => task?._id === _id)
    setInputs({
      ...inputs,
      assignTo: findTask.assignTo,
      taskStage: findTask.taskStage,
      _id: findTask?._id
    })
    setEditMode(true)
    setIsOpen(true)
  }
  // console.log(inputs);

  const fetchTaskList = useCallback(async () => {
    try {
      const response = await fetchApiV1(TASK.replace("/task", `/user/task/${userId}`))
      if (response.status === 200) {
        setTaskList(response?.data?.taskList)
      } else {
        setTaskList([])
        throw response
      }
    } catch (error) {
      throw new Error(error)
    }
  }, [userId])
  // const fetchEmployeeList = async () => {
  //   try {
  //     const response = await fetchApiV1(USER)
  //     if (response.status === 200) {
  //       setEmployeeList(response?.data?.usersList)
  //     } else {
  //       setEmployeeList([])
  //       throw response
  //     }
  //   } catch (error) {
  //     throw new Error(error)
  //   }
  // }
  const postTask = async () => {
    const fD = new FormData()
    fD.append("title", inputs.title)
    fD.append("taskStage", inputs.taskStage)
    fD.append("priorityLevel", inputs.priorityLevel)
    fD.append("taskDate", inputs.taskDate)

    inputs.assignTo?.map((item) => {
      return fD.append("assignTo", item?._id)
    })
    const fileArray = Object.values(inputs.files); // Convert to array if needed
    fileArray?.forEach((file) => {
      if (file) {
        fD.append("files", file);  // Appending each file
      }
    });

    try {
      const response = await postApiV1(TASK, fD, true)
      if (response.status == 201) {
        clearInputs()
        fetchTaskList()
      }
    } catch (error) {
      clearInputs()
      throw new Error(error)
    }
  }
  const updateTask = async () => {
    try {
      const response = await patchApiV1(`${TASK}/${inputs?._id}`, inputs, true)
      if (response.status == 202) {
        clearInputs()
        fetchTaskList()
      }
    } catch (error) {
      clearInputs()
      throw new Error(error)
    }
  }
  // const deleteTask = async (_id) => {
  //   try {
  //     const response = await deleteApiV1(`${TASK}/${_id}`)
  //     if (response.status == 200) {
  //       clearInputs()
  //       fetchTaskList()
  //     }
  //   } catch (error) {
  //     throw new Error(error)
  //   }
  // }
  const clearInputs = () => {
    try {
      setInputs(initialState)
      setIsOpen(false)
      setEditMode(false)
    } catch (error) {
      setIsOpen(false)
      setEditMode(false)
      throw new Error(error)
    }
  }
  useEffect(() => {
    fetchTaskList()
    // fetchEmployeeList()
  }, [fetchTaskList])
  return (
    <div>
      <Header />
      <div className="w-full font-roboto font-medium">
        <div className="w-[15%] fixed top-20">
          <SideMenu />
        </div>
        <div className="ml-[15%] px-5 mt-24 w-[85%] ">
          <div className="w-full">
            <div className="w-full flex justify-end items-end">
              {/* <button type="button" className="w-52 text-white bg-green-700 py-3" onClick={() => setIsOpen(true)}>Add task</button> */}
            </div>
            <div className="w-full mt-10 overflow-x-auto custom-scrollbar shadow-sm">
              <table className="w-full">
                <thead className="bg-green-300">
                  <tr className="">
                    <th className="py-2 border-r-2">Task Name</th>
                    <th className="py-2 border-r-2">Image</th>
                    <th className="py-2 border-r-2">Priority</th>
                    <th className="py-2 border-r-2">Task created</th>
                    <th className="py-2 border-r-2">Task deadline</th>
                    <th className="py-2 border-r-2">Task Updated</th>
                    <th className="py-2 border-r-2">Task Status</th>
                    <th className="py-2 border-r-2">Assigned To</th>
                    <th className="py-2 border-r-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    currentRows.map((task) => {
                      return (
                        <tr className="text-center font-thin border-2 border-opacity-85" key={task?._id}>
                          <td className="py-2 border-r-2">{task?.title}</td>
                          <td className="py-2 border-r-2 flex  flex-col gap-5">{
                            task.files?.map((taskImage, i) => {
                              return (
                                <img key={i} src={taskImage} alt={taskImage?._id} className="w-32 h-20" />
                              )
                            })
                          }</td>

                          <td className="py-2 border-r-2">{task?.priorityLevel}</td>
                          <td className="py-2 border-r-2">{task?.taskDate.split("T")[0]}</td>
                          <td className="py-2 border-r-2">{task?.createdAt.split("T")[0]}</td>
                          <td className="py-2 border-r-2">{task?.updatedAt.split("T")[0]}</td>
                          <td className="py-2 border-r-2">{task?.taskStage}</td>
                          <td className="py-2 border-r-2">{
                            task.assignTo?.map((user) => {
                              return (
                                <ul key={user?._id}>
                                  <li className="list-disc w-fit ml-10">{user?.fullName}</li>
                                </ul>
                              )
                            })
                          }</td>
                          <td className="py-2 border-r-2">
                            <div className="w-full flex justify-center items-center gap-5">
                              <button type="button" className="bg-yellow-500 text-white w-24 rounded-sm h-10" onClick={(e) => handleEditTask(e, task?._id)}>Edit</button>
                              {/* <button type="button" className="bg-red-500 text-white w-24 rounded-sm h-10" onClick={() => deleteTask(task?._id)}>Delete</button> */}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  }
                  <tr className="text-center font-thin border-2 border-opacity-85">
                    <td colSpan={8} className="px-4 py-4 bg-gray-100 text-end">
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
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        style={style}
      >
        <div className="font-roboto w-full font-semibold">
          <div className="flex justify-between items-center py-5">
            <h1>{editMode ? "Update" : "Add"} Task</h1>
            <Button color="error" onClick={() => setIsOpen(false)}>close</Button>
          </div>
          <Box sx={{ width: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* <TextField
              label="Title"
              name="title"
              onChange={(e) => handleChangeInputs(e, null, "title")}
              value={inputs.title}
            /> */}
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Task Stage</InputLabel>
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
              {/* <InputLabel id="demo-simple-select-label">Priority Level</InputLabel>
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
              </Select> */}
              {/* <input
                type="date"
                name="date"
                id="date"
                value={inputs.taskDate}
                className="border-2 py-2 px-2 my-3 rounded-md"
                onChange={(e) => handleChangeInputs(e, null, "taskDate")}
              /> */}
              {/* <Autocomplete
                disablePortal
                options={employeeList}
                getOptionLabel={(option) => option?.fullName || ""}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                fullWidth
                multiple
                readOnly
                value={inputs.assignTo}
                renderInput={(params) => <TextField {...params} label="Assign To" />}
                onChange={(e, nV) => handleChangeInputs(e, nV, "assignTo")}
              /> */}
              {/* <input
                type="file"
                name="file"
                id="file"
                multiple
                className="fileInput"
                onChange={(e, nV) => handleChangeInputs(e, nV, "files")}
              /> */}
            </FormControl>
            <Button onClick={editMode ? updateTask : postTask} className="w-32" variant="contained">{editMode ? "Update" : "Add"} Task</Button>
          </Box>
        </div>
      </Modal>
    </div>
  )
}

export default TaskListUser