import { useEffect, useState } from "react";
import {
  deleteApiV1,
  fetchApiV1,
  postApiV1,
  putApiV1,
} from "../../../Components/Constant/Network";
import Header from "../../../Components/Navbar/Header";
import SideMenu from "../../../Components/Navbar/SideMenu";
import { Box, Button, TextField } from "@mui/material";
import { DEPARTMENT } from "../../../Components/Constant/EndPoints";
import Pagination from "../../../Components/Pagination/Pagination";
import ReactQuill from "react-quill";
import Modal from "../../../Components/Constant/Modal";
import { getPermissionList } from "../../../Utils/Functions";

const Department = () => {
  const { menusList, submenuList } = getPermissionList();
  const MENU = "Departments";
  const isMenuMatched = menusList.filter((item) => item.title === MENU);
  const listedPermissions = submenuList.filter(
    (item) => item.menuId === isMenuMatched[0]._id
  );
  const isEdit = listedPermissions.some((edit) => edit.title === "edit");
  const isDelete = listedPermissions.some(
    (remove) => remove.title === "delete"
  );
  const isAdd = listedPermissions.some((add) => add.title === "post");

  const [departmentList, setDepartmentList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(departmentList.length / itemsPerPage);
  const currentRows = departmentList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const initialState = {
    title: "",
    description: "",
  };
  const [inputs, setInputs] = useState(initialState);
  const style = {
    width: "500px",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "50px",
    justifyContent: "center",
    alignItems: "center",
  };
  const handleEditUser = (e, _id) => {
    e.preventDefault();
    const findRole = departmentList.find((task) => task?._id === _id);
    setInputs({
      ...inputs,
      title: findRole?.title,
      description: findRole.description,
      _id: findRole?._id,
    });
    setEditMode(true);
    setIsOpen(true);
  };
  const handleChange = (e, nV, type) => {
    // console.log(e, nV, type);

    if (e) {
      e.preventDefault();
    }
    if (type === "title") {
      setInputs({ ...inputs, title: e.target.value });
      return;
    }
    if (type === "description") {
      setInputs({ ...inputs, description: nV });
      return;
    }
    if (type === "departMentId") {
      setInputs({ ...inputs, departMentId: nV?._id });
      return;
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
  const postDepartment = async () => {
    try {
      const response = await postApiV1(`${DEPARTMENT}/create`, inputs);
      if (response.status == 201) {
        clearInputs();
        fetchDepartmentList();
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const updateDepartment = async () => {
    try {
      const response = await putApiV1(
        `${DEPARTMENT}/update/${inputs?._id}`,
        inputs
      );
      if (response.status == 202) {
        clearInputs();
        fetchDepartmentList();
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const deleteDepartment = async (_id) => {
    try {
      const response = await deleteApiV1(`${DEPARTMENT}/delete/${_id}`);
      if (response.status == 202) {
        clearInputs();
        fetchDepartmentList();
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const clearInputs = () => {
    try {
      setInputs(initialState);
      setIsOpen(false);
    } catch (error) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    fetchDepartmentList();
  }, []);
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
                  Add Role
                </button>
              </div>
            )}
            <div className="w-full mt-10 overflow-x-auto custom-scrollbar shadow-sm">
              <table className="w-full">
                <thead className="bg-green-300">
                  <tr className="">
                    <th className="py-2 border-r-2">Title</th>
                    <th className="py-2 border-r-2">description</th>
                    <th className="py-2 border-r-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((department) => {
                    return (
                      <tr
                        className="text-center font-thin border-2 border-opacity-85"
                        key={department?._id}
                      >
                        <td className="py-2 border-r-2">{department?.title}</td>
                        <td className="py-2 border-r-2">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: department?.description,
                            }}
                          />
                        </td>

                        <td className="py-2 border-r-2">
                          <div className="w-full flex justify-center items-center gap-5">
                            {isEdit && (
                              <button
                                type="button"
                                className="bg-yellow-500 text-white w-24 rounded-sm h-10"
                                onClick={(e) =>
                                  handleEditUser(e, department?._id)
                                }
                              >
                                Edit
                              </button>
                            )}
                            {isDelete && (
                              <button
                                type="button"
                                className="bg-red-500 text-white w-24 rounded-sm h-10"
                                onClick={() =>
                                  deleteDepartment(department?._id)
                                }
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
                    <td colSpan={7} className="px-4 py-4 bg-gray-100 text-end">
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
            <Button color="error" onClick={clearInputs}>
              close
            </Button>
          </div>
          <Box
            sx={{
              width: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <TextField
              label="Title"
              name="title"
              value={inputs.title}
              fullWidth
              onChange={(e) => handleChange(e, null, "title")}
            />
            <ReactQuill
              onChange={(nV) => handleChange(null, nV, "description")}
              placeholder="Type Description"
              value={inputs.description}
            />
            {/* <Autocomplete
                            disablePortal
                            options={departmentList || []}
                            fullWidth
                            getOptionLabel={(option) => option.title || ""}
                            value={departmentList?.find((department => department?._id === inputs?.departMentId))}
                            sx={{ width: 300 }}
                            onChange={(e, nV) => handleChange(e, nV, "departMentId")}
                            renderInput={(params) => <TextField {...params} label="Department" />}
                        /> */}
            <Button
              onClick={editMode ? updateDepartment : postDepartment}
              className="w-52"
              variant="contained"
            >
              {editMode ? "Update" : "Add"} Department
            </Button>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default Department;
