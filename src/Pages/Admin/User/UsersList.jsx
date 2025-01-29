import { useCallback, useEffect, useState } from "react";
import Header from "../../../Components/Navbar/Header";
import SideMenu from "../../../Components/Navbar/SideMenu";
import {
  deleteApiV1,
  fetchApiV1,
  postApiV1,
  putApiV1,
} from "../../../Components/Constant/Network";
import {
  CREATE_USER,
  DEPARTMENT,
  JOB_ROLE,
  USER,
} from "../../../Components/Constant/EndPoints";
import Modal from "../../../Components/Constant/Modal";
import { Autocomplete, Button, Grid2, TextField } from "@mui/material";
import Pagination from "../../../Components/Pagination/Pagination";
import {
  getManagerId,
  getPermissionList,
  getUserId,
} from "../../../Utils/Functions";
import { fetchApiV2 } from "../../../Components/Constant/Network.V2";

const UsersList = () => {
  const { menusList, submenuList } = getPermissionList();
  const MENU = "Employee List";
  const isMenuMatched = menusList.filter((item) => item.title === MENU);
  const listedPermissions = submenuList.filter(
    (item) => item.menuId === isMenuMatched[0]._id
  );
  const isEdit = listedPermissions.some((edit) => edit.title === "edit");
  const isDelete = listedPermissions.some(
    (remove) => remove.title === "delete"
  );
  const isAdd = listedPermissions.some((add) => add.title === "post");

  const [employeeList, setEmployeeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const adminId = getUserId();
  const [jobRoleList, setJobRoleList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const totalPages = Math.ceil(employeeList?.length / itemsPerPage);
  const currentRows = employeeList?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const initialState = {
    fullName: "",
    email: "",
    Otp: "1234",
    jobTitle: "",
    role: "677e58f796b01edbe0b0af5a",
    managerId: null,
    departMentId: "",
  };
  const handleChangeInputs = (e, nV, type) => {
    e.preventDefault();

    if (type === "fullName") {
      setInputs({ ...inputs, fullName: e.target.value });
      return;
    }
    if (type === "email") {
      setInputs({ ...inputs, email: e.target.value });
      return;
    }
    if (type === "jobTitle") {
      setInputs({ ...inputs, jobTitle: nV._id });
      return;
    }
    if (type === "managerId") {
      setInputs({ ...inputs, managerId: nV._id || null });
      return;
    }
    if (type === "departMentId") {
      setInputs({ ...inputs, departMentId: nV._id });
      fetchRolesList(nV?._id);
      return;
    }
    if (type === "role") {
      setInputs({ ...inputs, role: nV._id });
      return;
    }
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
  };
  const handleEditUser = (e, _id) => {
    e.preventDefault();
    const findUser = employeeList.find((task) => task?._id === _id);
    setInputs({
      ...inputs,
      fullName: findUser?.fullName,
      email: findUser?.email,
      jobTitle: findUser?.jobTitle?._id,
      _id: findUser?._id,
      role: findUser.role?._id,
      departMentId: findUser.departMentId?._id,
      managerId: findUser?.managerId?._id || null,
    });
    fetchRolesList(findUser.departMentId?._id);
    setEditMode(true);
    setIsOpen(true);
  };
  const fetchEmployeeList = async () => {
    try {
      const response = await fetchApiV1(USER);
      if (response.status === 200) {
        // const manager_id = getManagerId();
        // const employeesByManager = response?.data?.usersList.filter(
        //   (employee) => employee?.managerId?._id === manager_id
        // );
        // console.log(employeesByManager);
        // console.log(response?.data?.usersList);
        
        // const finalData = employeesByManager || response?.data?.usersList;
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
  const fetchDepartmentList = async () => {
    try {
      const response = await fetchApiV1(DEPARTMENT);
      if (response.status === 200) {
        setDepartmentList(response?.data?.department);
      } else {
        setDepartmentList([]);
        throw response;
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const fetchUserRole = useCallback(async () => {
    try {
      const response = await fetchApiV2(`/admin-role/list?adminId=${adminId}`);
      if (response.status === 200) {
        setRoleList(response?.data?.roleList);
      } else {
        setRoleList([]);
        throw response;
      }
    } catch (error) {
      throw new Error(error);
    }
  }, [adminId]);
  const fetchRolesList = async (_id) => {
    try {
      const filter = new URLSearchParams();
      filter.append("departMentId", _id);
      const response = await fetchApiV1(`${JOB_ROLE}?${filter.toString()}`);
      if (response.status === 200) {
        setJobRoleList(response?.data?.role);
      } else {
        setRoleList([]);
        throw response;
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const postUser = async () => {
    try {
      const response = await postApiV1(CREATE_USER, inputs);
      if (response.status == 201) {
        clearInputs();
        fetchEmployeeList();
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const updateUser = async () => {
    try {
      const response = await putApiV1(`${USER}/${inputs?._id}`, inputs);
      if (response.status == 202) {
        clearInputs();
        fetchEmployeeList();
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const deleteUser = async (_id) => {
    try {
      const response = await deleteApiV1(`${USER}/${_id}`);
      if (response.status == 202) {
        clearInputs();
        fetchEmployeeList();
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const clearInputs = () => {
    try {
      setInputs(initialState);
      setIsOpen(false);
      setEditMode(false);
    } catch (error) {
      throw new Error(error);
    }
  };

  // const findrole = roleList.find((item) => item._id === inputs.role)
  // console.log(findrole);

  useEffect(() => {
    fetchEmployeeList();
    fetchUserRole();
    fetchDepartmentList();
    // fetchRolesList()
  }, [fetchUserRole]);
  return (
    <div>
      <Header />
      <div className="w-full font-roboto font-medium">
        <div className="w-[15%] fixed top-20">
          <SideMenu />
        </div>
        <div className="ml-[15%] px-5 mt-24 w-[85%] ">
          <div className="w-full">
            {isAdd && (
              <div className="w-full flex justify-end items-end">
                <button
                  type="button"
                  className="w-52 text-white bg-green-700 py-3"
                  onClick={() => setIsOpen(true)}
                >
                  Add Employee
                </button>
              </div>
            )}
            <div className="w-full mt-10 overflow-x-auto custom-scrollbar shadow-sm">
              <table className="w-full">
                <thead className="bg-green-300">
                  <tr className="">
                    <th className="py-2 border-r-2">Full Name</th>
                    <th className="py-2 border-r-2">Email</th>
                    <th className="py-2 border-r-2">Department</th>
                    <th className="py-2 border-r-2">Job Title</th>
                    <th className="py-2 border-r-2">Company Email</th>
                    <th className="py-2 border-r-2">Employee ID</th>
                    <th className="py-2 border-r-2">Employee Role</th>
                    <th className="py-2 border-r-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows?.map((employee) => {
                    return (
                      <tr
                        className="text-center font-thin border-2 border-opacity-85"
                        key={employee?._id}
                      >
                        <td className="py-2 border-r-2">
                          {employee?.fullName}
                        </td>
                        <td className="py-2 border-r-2">{employee?.email}</td>
                        <td className="py-2 border-r-2">
                          {employee?.departMentId?.title}
                        </td>
                        <td className="py-2 border-r-2">
                          {employee?.jobTitle?.title}
                        </td>
                        <td className="py-2 border-r-2">
                          {employee?.companyEmail}
                        </td>
                        <td className="py-2 border-r-2">
                          {employee?.employeeId}
                        </td>
                        <td className="py-2 border-r-2">
                          {employee?.role?.name}
                        </td>
                        <td className="py-2 border-r-2">
                          <div className="w-full flex justify-center items-center gap-5">
                            {isEdit && (
                              <button
                                type="button"
                                className="bg-yellow-500 text-white w-24 rounded-sm h-10"
                                onClick={(e) =>
                                  handleEditUser(e, employee?._id)
                                }
                              >
                                Edit
                              </button>
                            )}
                            {isDelete && (
                              <button
                                type="button"
                                className="bg-red-500 text-white w-24 rounded-sm h-10"
                                onClick={() => deleteUser(employee?._id)}
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
                    <td colSpan={10} className="px-4 py-4 bg-gray-100 text-end">
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
        <div className="font-roboto w-full font-semibold">
          <div className="flex justify-between items-center py-5">
            <h1>{editMode ? "Update" : "Add"} User</h1>
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
          <Grid2 className="w-full grid grid-cols-2 gap-5">
            <TextField
              label="Full Name"
              name="fullName"
              value={inputs.fullName}
              fullWidth
              onChange={(e) => handleChangeInputs(e, null, "fullName")}
            />
            <TextField
              label="Email"
              name="email"
              value={inputs.email}
              fullWidth
              onChange={(e) => handleChangeInputs(e, null, "email")}
            />
            {/* <TextField
              label="Job Role"
              name="jobTitle"
              value={inputs.jobTitle}
              fullWidth
              onChange={(e) => setInputs({ ...inputs, jobTitle: e.target.value })}
            /> */}
            <Autocomplete
              disablePortal
              options={departmentList || []}
              fullWidth
              getOptionLabel={(option) => option.title || ""}
              value={departmentList?.find(
                (department) => department?._id === inputs?.departMentId
              )}
              // sx={{ width: 300 }}
              onChange={(e, nV) => handleChangeInputs(e, nV, "departMentId")}
              renderInput={(params) => (
                <TextField {...params} label="Department" />
              )}
            />
            <Autocomplete
              disablePortal
              options={jobRoleList || []}
              getOptionLabel={(option) => option?.title || ""}
              fullWidth
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField {...params} label="Job Role" />
              )}
              value={
                jobRoleList?.find((item) => item._id === inputs.jobTitle) ||
                null
              }
              onChange={(e, nV) => handleChangeInputs(e, nV, "jobTitle")}
            />
            <Autocomplete
              disablePortal
              options={roleList || []}
              getOptionLabel={(option) => option?.name || ""}
              fullWidth
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => <TextField {...params} label="Role" />}
              value={roleList?.find((item) => item._id === inputs.role) || null}
              onChange={(e, nV) => handleChangeInputs(e, nV, "role")}
            />
            {inputs.role === "677e58f796b01edbe0b0af5a" && (
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
            )}

            <Button
              onClick={editMode ? updateUser : postUser}
              className="w-32"
              variant="contained"
            >
              {editMode ? "Update" : "Add"} User
            </Button>
          </Grid2>
        </div>
      </Modal>
    </div>
  );
};

export default UsersList;
