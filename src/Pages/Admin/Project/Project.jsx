import { useCallback, useEffect, useState } from "react";
import {
  deleteApiV1,
  fetchApiV1,
  postApiV1,
  putApiV1,
} from "../../../Components/Constant/Network";
import Header from "../../../Components/Navbar/Header";
import SideMenu from "../../../Components/Navbar/SideMenu";
import TableComponent from "../../../Components/TableComponent/TableComponent";
import {
  getManagerId,
  getPermissionList,
  getUserId,
  getUserRole,
} from "../../../Utils/Functions";
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
import Modal from "../../../Components/Constant/Modal";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { USER } from "../../../Components/Constant/EndPoints";
import ReactQuill from "react-quill";
import { fetchApiV2 } from "../../../Components/Constant/Network.V2";

const Project = () => {
  const { menusList, submenuList } = getPermissionList();
  const [error, setError] = useState(null);
  const MENU = "Projects";
  const isMenuMatched = menusList.filter((item) => item.title === MENU);
  const listedPermissions = submenuList.filter(
    (item) => item.menuId === isMenuMatched[0]._id
  );
  const isEdit = listedPermissions.some((edit) => edit.title === "edit");
  const isDelete = listedPermissions.some(
    (remove) => remove.title === "delete"
  );
  const isAdd = listedPermissions.some((add) => add.title === "post");

  const [projectsList, setProjectsList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const adminId = getUserId();
  const manager = getManagerId();
  const navigate = useNavigate();
  const initialState = {
    title: "",
    startDate: "",
    endDate: "",
    status: null,
    managerId: null,
    description: "",
    teamId: null,
  };
  const [inputs, setInputs] = useState(initialState);
  const style = {
    width: "800px",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "50px",
    justifyContent: "center",
    alignItems: "center",
    overflowY: "scroll",
    position: "relative",
  };
  const itemsPerPage = 10;
  const totalPages = Math.ceil(projectsList.length / itemsPerPage);
  const currentRows = projectsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const headers = [
    {
      _id: 1,
      header: "Project Title",
      key: "title",
    },
    {
      _id: 2,
      header: "Start Date",
      key: "startDate",
    },
    {
      _id: 3,
      header: "End Date",
      key: "endDate",
    },
    {
      _id: 4,
      header: "Status",
      key: "status",
    },
    {
      _id: 5,
      header: "Action",
      key: "Action",
      render: (_, row, rowIndex) => (
        <div className="flex space-x-2 justify-center items-center py-2">
          <button
            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
            onClick={() => handleView(row, rowIndex)}
          >
            View
          </button>
          {isEdit && (
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              onClick={() => handleEdit(row, rowIndex)}
            >
              Edit
            </button>
          )}
          {isDelete && (
            <button
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              onClick={() => handleDelete(row, rowIndex)}
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];
  const handleChangeInputs = (e, nV, type) => {
    // e.preventDefault()
    if (type === "title") {
      setInputs({ ...inputs, title: e.target.value });
      return;
    }
    if (type === "startDate") {
      setInputs({ ...inputs, startDate: nV ? nV.toISOString() : null });
      return;
    }
    if (type === "endDate") {
      setInputs({ ...inputs, endDate: nV ? nV.toISOString() : null });
      return;
    }
    if (type === "status") {
      setInputs({ ...inputs, status: e.target.value });
      return;
    }
    if (type === "managerId") {
      setInputs({ ...inputs, managerId: nV._id });
      return;
    }
    if (type === "teamId") {
      setInputs({ ...inputs, teamId: nV._id });
      return;
    }
  };
  // console.log(inputs);

  const handleEdit = (row, rowIndex) => {
    try {
      console.log("Editing Row:", row, "Row Index:", rowIndex);
      const findProject = projectsList.find(
        (project) => project?._id === row?._id
      );

      if (!findProject) {
        console.error("Unable to find project:", row?._id);
        return;
      }

      setInputs({
        ...inputs,
        title: findProject.title || "",
        _id: findProject?._id || "",
        startDate: findProject.startDate ? dayjs(findProject.startDate) : null,
        endDate: findProject.endDate ? dayjs(findProject.endDate) : null,
        status: findProject.status || "",
        managerId: findProject.managerId?._id || "",
        teamId: findProject.teamId,
      });
      setEditMode(true);
      setIsOpen(true);
    } catch (error) {
      console.error("Error in handleEdit:", error);
    }
  };
  const handleView = (row) => {
    const params = new URLSearchParams();
    params.append("projectName", row?.title);
    navigate(`/project?${params}`);
  };
  const postProject = async () => {
    try {
      const response = await postApiV1(
        `/project/create?adminId=${adminId}`,
        inputs
      );
      if (response.status == 201) {
        clearInputs();
        fetchProjects();
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const updateProject = async () => {
    try {
      const response = await putApiV1(
        `/project/${inputs?._id}?adminId=${adminId}`,
        inputs
      );
      if (response.status == 202) {
        clearInputs();
        fetchProjects();
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const handleDelete = async (row) => {
    try {
      const response = await deleteApiV1(
        `/project/${row?._id}?adminId=${adminId}`
      );
      if (response.status == 200) {
        clearInputs();
        fetchProjects();
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetchApiV1(`/projects?adminId=${adminId}`);
      if (response.status === 200) {
        const userRole = getUserRole();
        // if (userRole === "MANAGER") {
        const filterManagerProjects =
          userRole === "MANAGER"
            ? response.data.projectList.filter(
                (project) => project.managerId?._id === adminId
              )
            : null;

        //   return setProjectsList(filterManagerProjects);
        // }

        const filterProjectByUser =
          userRole === "USER"
            ? response.data.projectList.filter(
                (project) => project.managerId._id === manager
              )
            : null;
        const data = response.data.projectList;
        const finalData = filterManagerProjects || filterProjectByUser || data;
        setProjectsList(finalData);
      } else {
        throw response;
      }
    } catch (error) {
      setError(error.data.message || "An unexpected error occurred.");
      throw new Error(error);
    }
  }, [adminId]);
  const fetchEmployeeList = async () => {
    try {
      const response = await fetchApiV1(USER);
      if (response.status === 200) {
        // setEmployeeList(response?.data?.usersList)
        const findManagers = response?.data?.usersList.filter(
          (user) => user.role.name === "MANAGER"
        );
        setManagerList(findManagers);
      } else {
        // setEmployeeList([])
        throw response;
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
  const [filteredTeam, setFilteredTeam] = useState([]);
  const filterTeamByManager = useCallback(() => {
    try {
      const filterTeam = teamList.filter(
        (team) => team.managerId._id === inputs.managerId
      );
      console.log(filterTeam);

      setFilteredTeam(filterTeam);
    } catch (error) {
      console.error(error);
    }
  }, [teamList, inputs.managerId]);

  //   console.log(inputs);

  useEffect(() => {
    filterTeamByManager();
  }, [filterTeamByManager]);
  const clearInputs = () => {
    try {
      setInputs(initialState);
      setIsOpen(false);
      setEditMode(false);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchEmployeeList();
    fetchTeamList();
  }, [fetchProjects, fetchTeamList]);
  if (error !== null) {
    return (
      <div className="w-full flex flex-col justify-center items-center h-screen gap-5 font-roboto">
        <p className="text-2xl">{error}</p>
        <button
          type="button"
          className="bg-blue-600 text-white px-5 py-2 rounded-full shadow-lg"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <div className="w-full font-roboto font-medium">
        <div className="w-[15%] fixed top-20">
          <SideMenu />
        </div>
        <div className="ml-[15%] px-5 mt-24 w-[85%] ">
          {isAdd && (
            <div className="w-full flex justify-end items-end">
              <button
                type="button"
                className="w-52 text-white bg-green-700 py-3"
                onClick={() => setIsOpen(true)}
              >
                Add Project
              </button>
            </div>
          )}

          <div className="w-full mt-10">
            <TableComponent
              headers={headers}
              data={currentRows}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              totalPages={totalPages}
            />
          </div>
        </div>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} style={style}>
          <Box sx={{ width: "100%" }}>
            <div className="w-full font-roboto">
              <div className="flex justify-between items-center py-2 w-full">
                <h1>{editMode ? "Update" : "Add"} Project</h1>
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
              <div className="w-full grid grid-cols-1 gap-6 justify-center items-center">
                <TextField
                  label="Title"
                  name="title"
                  onChange={(e) => handleChangeInputs(e, null, "title")}
                  value={inputs.title}
                />
                <ReactQuill
                  onChange={(value) =>
                    setInputs({ ...inputs, description: value })
                  }
                />
                <div className="w-full flex gap-5">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="Start Date"
                        value={dayjs(inputs?.startDate)}
                        onChange={(nV) =>
                          handleChangeInputs(null, nV, "startDate")
                        }
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="End Date"
                        value={dayjs(inputs?.endDate)}
                        onChange={(nV) =>
                          handleChangeInputs(null, nV, "endDate")
                        }
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Task Stage
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={inputs.status || ""}
                    label="Task Stage"
                    onChange={(e) => handleChangeInputs(e, null, "status")}
                  >
                    <MenuItem value={"STARTED"}>Started</MenuItem>
                    <MenuItem value={"RE-OPENED"}>Re-Opened</MenuItem>
                    <MenuItem value={"COMPLETED"}>Completed</MenuItem>
                    <MenuItem value={"DROPPED"}>Dropped</MenuItem>
                  </Select>
                </FormControl>
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
                    managerList?.find(
                      (item) => item._id === inputs.managerId
                    ) || null
                  }
                  onChange={(e, nV) => handleChangeInputs(e, nV, "managerId")}
                />
                <Autocomplete
                  disablePortal
                  options={filteredTeam || []}
                  getOptionLabel={(option) => option?.teamName || ""}
                  fullWidth
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Team" />
                  )}
                  value={
                    filteredTeam?.find((item) => item._id === inputs.teamId) ||
                    null
                  }
                  onChange={(e, nV) => handleChangeInputs(e, nV, "teamId")}
                />
              </div>
              <div className="mt-5">
                <Button
                  onClick={editMode ? updateProject : postProject}
                  className="w-32 "
                  variant="contained"
                >
                  {editMode ? "Update" : "Add"} Task
                </Button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Project;
