import { useLocation } from "react-router-dom";
import {
  deleteApiV1,
  fetchApiV1,
  patchApiV1,
  postApiV1,
  putApiV1,
} from "../../../Components/Constant/Network";
import { useCallback, useEffect, useRef, useState } from "react";
import { getManagerId, getUserId, getUserRole } from "../../../Utils/Functions";
import Header from "../../../Components/Navbar/Header";
import SideMenu from "../../../Components/Navbar/SideMenu";
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
import { fetchApiV2 } from "../../../Components/Constant/Network.V2";
import { TASK } from "../../../Components/Constant/EndPoints";

const SingleProject = () => {
  const location = useLocation();
  const [project, setProject] = useState({});
  const adminId = getUserId();
  const [phaseP, setPhaseP] = useState("Phase 1");
  const [hoverIndex, setHoveredIndex] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tsModal, setTsModal] = useState(false);
  const fileRef = useRef();
  const [employeeList, setEmployeeList] = useState([]);
  const userRole = getUserRole();
  const manager = getManagerId();
  const [manager_id, setManager_id] = useState("");

  const initialState = {
    title: "",
    projectId: "",
  };
  const [inputs, setInputs] = useState(initialState);
  const style = {
    width: "auto",
    height: "auto",
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
  const totalPages = Math.ceil(project?.taskList?.length / itemsPerPage);
  const currentRows = project?.taskList?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChangeInputs = (e, nV, type) => {
    e.preventDefault();

    if (type == "title") {
      setInputs({ ...inputs, title: e.target.value });
      return;
    }
  };

  const handleEdit = (phaseId, phase) => {
    // console.log(phase);

    setInputs((prevInputs) => ({
      ...prevInputs,
      title: phase.name,
      projectId: phase.projectId,
      _id: phase._id,
    }));
    setEditMode(true);
    setIsOpen(true);
  };

  const postPhase = async () => {
    try {
      const response = await postApiV1(`/phase?adminId=${adminId}`, inputs);
      if (response.status === 201) {
        clearInputs();
        fetchSingleProject();
      }
    } catch (error) {
      clearInputs();
      console.error(error);
    }
  };

  const updatePhase = async (_id) => {
    try {
      const response = await putApiV1(
        `/phase/${_id}?adminId=${adminId}`,
        inputs
      );
      if (response.status === 202) {
        clearInputs();
        fetchSingleProject();
      }
    } catch (error) {
      clearInputs();
      console.error(error);
    }
  };

  const deletePhase = async (_id) => {
    try {
      const response = await deleteApiV1(`/phase/${_id}?adminId=${adminId}`);
      if (response.status === 202) {
        setIsOpen(false);
        fetchSingleProject();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(hoverIndex);

  const fetchSingleProject = useCallback(async () => {
    try {
      const params = new URLSearchParams(location.search);
      phaseP && params.append("phaseName", phaseP);
      const response = await fetchApiV1(
        `/project/single?${params.toString()}&adminId=${adminId}`
      );
      if (response.status === 200) {
        setProject(response.data.project);
        setInputs((prev) => ({
          ...prev,
          projectId: response.data.project._id,
        }));
      } else {
        throw response;
      }
    } catch (error) {
      console.error(error);
    }
  }, [adminId, location.search, phaseP]);
  useEffect(() => {
    fetchSingleProject();
  }, [fetchSingleProject]);

  const clearInputs = () => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      title: "",
    }));
    setIsOpen(false);
    setEditMode(false);
  };

  const handleChangeFile = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      try {
        const fD = new FormData();
        fD.append("file", file);
        const response = await postApiV1(`/task/import`, fD, true);
        if (response.status === 200) {
          return;
        } else {
          throw response;
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const tStyle = {
    width: "500px",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "50px",
    justifyContent: "center",
    alignItems: "center",
  };

  const tInitialState = {
    assignedTo: [],
    taskStage: "",
  };

  const [tInputs, setTInputs] = useState(tInitialState);

  const fetchTeamList = useCallback(async () => {
    try {
      const response = await fetchApiV2(`/team?adminId=${adminId}`);
      if (response.status === 200) {
        const managerList = response.data.teamList.filter((team) =>
          team.projectId.some((proj) => proj._id === project._id)
        );
        const finalData = managerList[0];
        // setTInputs((prevInputs) => ({
        //   ...prevInputs,
        //   assignedTo: finalData?.teamMembers,
        //   // taskStage: project?.status,
        // }));
        // console.log(finalData.teamMembers);

        setEmployeeList(finalData?.teamMembers);
      } else {
        throw response;
      }
    } catch (error) {
      // setError(error.data.message || "An unexpected error occurred.");
      console.error(error);
    }
  }, [adminId, project._id]);
  // console.log(tInputs);

  useEffect(() => {
    fetchTeamList();
  }, [fetchTeamList]);

  const updateTask = async () => {
    try {
      const response = await patchApiV1(`${TASK}/${tInputs?._id}`, tInputs);
      if (response.status == 202) {
        setTsModal(false);
        // clearInputs();
        fetchSingleProject();
      }
    } catch (error) {
      clearInputs();
      throw new Error(error);
    }
  };

  const handleEditTask = (e, _id, type) => {
    e.preventDefault();
    setTsModal(true);
    setEditMode(true);

    const setTaskToInputs = project.taskList?.find((task) => task._id === _id);
    setTInputs({
      ...tInputs,
      taskStage: setTaskToInputs?.taskStage,
      _id: setTaskToInputs._id,
      assignedTo: setTaskToInputs.assignTo,
    });
  };
  console.log(tInputs);

  return (
    <div>
      <Header />
      <div className="w-full font-roboto font-medium">
        <div className="w-[15%] fixed top-20">
          <SideMenu />
        </div>
        <div className="ml-[15%] px-5 mt-24 w-[85%] ">
          <div>
            <h1 className="text-2xl">{project.title}</h1>
            {userRole !== "USER" && (
              <div className="w-full flex justify-end items-center gap-5">
                <button
                  type="button"
                  className="w-52 text-white bg-green-700 py-3"
                  onClick={() => fileRef.current.click()}
                >
                  Import
                </button>
                <input
                  type="file"
                  name="file"
                  id="file"
                  ref={fileRef}
                  className="hidden"
                  onChange={handleChangeFile}
                />
              </div>
            )}
            <div className=" w-full flex mt-5 gap-2">
              <button
                type="button"
                className=" text-black bg-green-300 py-3 rounded-full w-32"
                onClick={() => setIsOpen(true)}
              >
                Add Phase
              </button>
              <div className="w-full grid grid-cols-7 gap-5">
                {project.phaseList?.map((phase) => {
                  return (
                    <div key={phase._id}>
                      <h5
                        className={`bg-green-300 hover:cursor-pointer hover:bg-green-700 hover:text-white text-center py-3 rounded-full relative`}
                        onClick={() => setPhaseP(phase.title)}
                        onMouseEnter={() => setHoveredIndex(phase._id)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {phase.title}
                        {hoverIndex === phase._id && (
                          <div className="w-full flex justify-between items-center px-1-5 absolute top-0 text-black">
                            <button
                              onClick={() => handleEdit(phase._id, phase)}
                              className="hover:text-blue-500 bg-white"
                            >
                              Edit
                            </button>
                            <button
                              className="hover:text-red-500 bg-white"
                              onClick={() => deletePhase(phase._id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </h5>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="w-full mt-10 overflow-x-auto custom-scrollbar shadow-sm">
            <table className="w-full">
              <thead className="bg-green-300">
                <tr className="">
                  <th className="py-2 border-r-2">Task Name</th>
                  <th className="py-2 border-r-2">Task Description</th>
                  <th className="py-2 border-r-2">Image</th>
                  <th className="py-2 border-r-2">Priority</th>
                  <th className="py-2 border-r-2">Task Created</th>
                  <th className="py-2 border-r-2">Task Updated</th>
                  <th className="py-2 border-r-2">Action</th>
                  <th className="py-2 border-r-2">Assigned To</th>
                  <th className="py-2 border-r-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {project.taskList?.length === 0 && (
                  <tr className="py-2 border-r-2">
                    <td colSpan={8} className="py-5">
                      No Task Found
                    </td>
                  </tr>
                )}
                {currentRows?.map((task) => {
                  return (
                    <tr className="py-2 border-r-2" key={task?._id}>
                      <td>{task.title}</td>
                      <td className="py-2 border-r-2">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: task?.description,
                          }}
                        ></div>
                      </td>
                      <td className="py-2 border-r-2 flex  flex-col gap-5">
                        {task.files?.map((taskImage, i) => {
                          return (
                            <img
                              key={i}
                              src={taskImage}
                              alt={taskImage?._id}
                              className="w-32 h-20"
                            />
                          );
                        })}
                      </td>
                      <td>{task.priorityLevel}</td>
                      <td>{task.createdAt.split("T")[0]}</td>
                      <td>{task.updatedAt.split("T")[0]}</td>
                      <td>{task.taskStage}</td>
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
                      <td>
                        <div className="w-full flex gap-5 justify-center items-center">
                          <button
                            type="button"
                            className="bg-yellow-500 text-white w-24 rounded-sm h-10"
                            onClick={(e) => handleEditTask(e, task?._id)}
                          >
                            Edit
                          </button>
                          {/* <button
                          type="button"
                          className="bg-red-500 text-white w-24 rounded-sm h-10"
                          onClick={() => deleteTask(task?._id)}
                        >
                          Assign
                        </button> */}
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
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} style={style}>
        <Box>
          <div className="w-full font-roboto">
            <div className="flex justify-between items-center py-2">
              <h1>{editMode ? "Update" : "Add"} Project Phase</h1>
              <Button color="error" onClick={clearInputs}>
                close
              </Button>
            </div>
            <div className="w-full grid grid-cols-2 gap-6 justify-center items-center">
              <TextField
                label="Title"
                name="title"
                onChange={(e) => handleChangeInputs(e, null, "title")}
                value={inputs.title}
                fullWidth
                // className="col-span-1"
              />
            </div>
            <div className="mt-5">
              <Button
                onClick={editMode ? () => updatePhase(inputs._id) : postPhase}
                className="w-32 "
                variant="contained"
              >
                {editMode ? "Update" : "Add"} Phase
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
      <Modal isOpen={tsModal} onClose={() => setTsModal(false)}>
        <div className="font-roboto w-full font-semibold">
          <div className="flex justify-between items-center py-5">
            <h1>{editMode ? "Update" : "Add"} Task</h1>
            <Button color="error" onClick={() => setTsModal(false)}>
              close
            </Button>
          </div>
          <Box sx={tStyle}>
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
                value={tInputs.taskStage}
                label="Task Stage"
                onChange={(e) =>
                  setTInputs({ ...tInputs, taskStage: e.target.value })
                }
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
              <Autocomplete
                disablePortal
                options={employeeList || []}
                getOptionLabel={(option) => option?.fullName || ""}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                fullWidth
                multiple
                readOnly={userRole === "USER"}
                value={tInputs?.assignedTo}
                renderInput={(params) => (
                  <TextField {...params} label="Assign To" />
                )}
                onChange={(e, nV) =>
                  setTInputs({
                    ...tInputs,
                    assignedTo: nV?.map((it) => it._id) || [], // Update the assignedTo field correctly
                  })
                }
              />
            </FormControl>
            <Button onClick={updateTask} className="w-32" variant="contained">
              {editMode ? "Update" : "Add"} Task
            </Button>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default SingleProject;
