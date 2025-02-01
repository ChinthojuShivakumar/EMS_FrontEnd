import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../Components/Navbar/Header";
import SideMenu from "../../../Components/Navbar/SideMenu";
import { Autocomplete, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { postApiV2, putApiV2 } from "../../../Components/Constant/Network.V2";
import { getUserId, getUserRole } from "../../../Utils/Functions";
import { fetchApiV1 } from "../../../Components/Constant/Network";
import { USER } from "../../../Components/Constant/EndPoints";

const TeamAction = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const adminId = getUserId();
  const userRole = getUserRole();
  const [employeeList, setEmployeeList] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  // const [submenuList, setSubMenuList] = useState([])

  const initialState = {
    teamName: "",
    projectId: [],
    managerId: userRole === "MANAGER" ? adminId : "",
    teamMembers: [],
    teamLeaderId: "",
  };
  const [inputs, setInputs] = useState(initialState);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e, nV, type) => {
    if (type === "teamName") {
      setInputs({ ...inputs, teamName: e.target.value });
      return;
    }
    if (type === "managerId") {
      setInputs({ ...inputs, managerId: nV._id });
      return;
    }
    if (type === "teamLeaderId") {
      setInputs({ ...inputs, teamLeaderId: nV._id });
      return;
    }
    if (type === "projectId") {
      // setInputs({ ...inputs, projectId: nV._id })
      setInputs({ ...inputs, projectId: nV.map((member) => member._id) });

      return;
    }
    if (type === "teamMembers") {
      setInputs({ ...inputs, teamMembers: nV.map((member) => member._id) });
      return;
    }
  };

  const [filteredUser, setFilteredUser] = useState([]);
  const filterUsersByManager = useCallback(async () => {
    try {
      const findUserByManager = employeeList.filter(
        (employee) => employee.managerId._id === inputs.managerId
      );
      setFilteredUser(findUserByManager);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [inputs.managerId, employeeList]);

  useEffect(() => {
    filterUsersByManager();
  }, [filterUsersByManager]);

  const fetchEmployeeList = useCallback(async () => {
    try {
      const response = await fetchApiV1(USER);
      if (response.status === 200) {
        const findManagers =
          response?.data?.usersList.filter(
            (user) => user.role.name === "MANAGER"
          ) || [];
        setManagerList(findManagers);
        const findUsers = response?.data?.usersList?.filter(
          (user) => user.role.name === "USER"
        );
        setEmployeeList(findUsers);
      } else {
        setEmployeeList([]);
        throw response;
      }
    } catch (error) {
      throw new Error(error);
    }
  }, []);
  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetchApiV1(`/projects?adminId=${adminId}`);
      if (response.status === 200) {
        const userRole = getUserRole();
        if (userRole === "MANAGER") {
          const filterManagerProjects = response.data.projectList.filter(
            (managerId) => managerId.managerId?._id === adminId
          );
          // console.log(filterManagerProjects);

          return setProjectsList(filterManagerProjects);
        }
        setProjectsList(response.data.projectList);
      } else {
        throw new Error(response);
      }
    } catch (error) {
      throw new Error(error);
    }
  }, [adminId]);

  useEffect(() => {
    fetchEmployeeList();
    fetchProjects();
  }, [fetchEmployeeList, fetchProjects]);

  useEffect(() => {
    if (location.state) {
      const { teamName, _id, managerId, teamLeaderId, teamMembers, projectId } =
        location.state;
      console.log(location.state);

      setInputs((prevInputs) => ({
        ...prevInputs,
        managerId: managerId._id,
        projectId: projectId.map((project) => project._id),
        teamLeaderId: teamLeaderId._id,
        teamMembers: teamMembers.map((member) => member._id),
        teamName: teamName,
        _id: _id,
      }));
      setEditMode(true);
    }
  }, [location.state]);

  const postTeam = async () => {
    try {
      const response = await postApiV2(`/team?adminId=${adminId}`, inputs);
      if (response.status === 201) {
        clearInputs();
        navigate("/admin/teams");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const updateTeam = async () => {
    try {
      const response = await putApiV2(
        `/team/${inputs._id}?adminId=${adminId}`,
        inputs
      );
      if (response.status === 202) {
        clearInputs();
        navigate("/admin/teams");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };
  // const c = employeeList?.some(item =>  inputs.teamMembers.includes(item._id))
  const clearInputs = () => {
    try {
      setInputs(initialState);
      // setIsOpen(false)
      setEditMode(false);
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div>
      <Header />
      <div className="w-full font-roboto font-medium">
        <div className="w-[15%] fixed top-20">
          <SideMenu />
        </div>
        <div className="ml-[15%] px-5 mt-24 w-[85%] ">
          <div className="w-full">
            <div>
              <h1 className="capitalize text-2xl">{path} Team</h1>
            </div>
            <div className="w-full mt-5 flex flex-col gap-5">
              <TextField
                label="Team Name"
                name="name"
                value={inputs.teamName}
                fullWidth
                sx={{ width: "100%" }}
                onChange={(e) => handleChange(e, null, "teamName")}
              />
              <Autocomplete
                disablePortal
                options={managerList || []}
                getOptionLabel={(option) => option?.fullName || ""}
                fullWidth
                sx={{ width: "100%" }}
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
                onChange={(e, nV) => handleChange(e, nV, "managerId")}
              />
              <Autocomplete
                disablePortal
                options={filteredUser || []}
                getOptionLabel={(option) => option?.fullName || ""}
                fullWidth
                sx={{ width: "100%" }}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                renderInput={(params) => (
                  <TextField {...params} label="Team Leader" />
                )}
                value={
                  employeeList?.find(
                    (item) => item._id === inputs.teamLeaderId
                  ) || null
                }
                onChange={(e, nV) => handleChange(e, nV, "teamLeaderId")}
              />
              <Autocomplete
                disablePortal
                options={filteredUser || []}
                getOptionLabel={(option) => option?.fullName || ""}
                fullWidth
                sx={{ width: "100%" }}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                multiple
                renderInput={(params) => (
                  <TextField {...params} label="Team Members" />
                )}
                value={
                  employeeList?.filter((item) =>
                    inputs.teamMembers.some((team) => team === item._id)
                  ) || []
                }
                onChange={(e, nV) => handleChange(e, nV, "teamMembers")}
              />
              <Autocomplete
                disablePortal
                options={projectsList || []}
                getOptionLabel={(option) => option?.title || ""}
                fullWidth
                multiple
                sx={{ width: "100%" }}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                renderInput={(params) => (
                  <TextField {...params} label="Projects" />
                )}
                value={
                  projectsList?.filter((item) =>
                    inputs.projectId?.some((team) => team === item._id)
                  ) || []
                }
                onChange={(e, nV) => handleChange(e, nV, "projectId")}
              />
            </div>
            <button
              className="w-52 text-white bg-green-700 py-3 capitalize mt-10"
              onClick={editMode ? updateTeam : postTeam}
            >
              {path}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAction;
