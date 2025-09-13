import { useCallback, useEffect, useState } from "react";
import Header from "../../../Components/Navbar/Header";
import SideMenu from "../../../Components/Navbar/SideMenu";
import {
  deleteApiV1,
  fetchApiV1,
  patchApiV1,
  postApiV1,
} from "../../../Components/Constant/Network";
import {
  getCurrentTime,
  getPermissionList,
  getUserRole,
} from "../../../Utils/Functions";
import { REPORT } from "../../../Components/Constant/EndPoints";
import { Box, Button } from "@mui/material";
import ReactQuill from "react-quill";
import Modal from "../../../Components/Constant/Modal";
import Pagination from "../../../Components/Pagination/Pagination";

const WorkReportList = () => {
  const { menusList, submenuList } = getPermissionList();
  const MENU = "Work Report";
  const isMenuMatched = menusList.filter((item) => item.title === MENU);
  const listedPermissions = submenuList.filter(
    (item) => item.menuId === isMenuMatched[0]._id
  );
  const isEdit = listedPermissions.some((edit) => edit.title === "edit");
  const isDelete = listedPermissions.some(
    (remove) => remove.title === "delete"
  );
  const isAdd = listedPermissions.some((add) => add.title === "post");
  const currentDate = new Date().toISOString().split("T")[0];

  const userRole = getUserRole();
  // const userId = getUserId()

  const [workReportList, setWorkReportList] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false);
  const initialState = {
    report: "",
    userId: JSON.parse(localStorage.getItem("user"))._id,
    loginTime: localStorage.getItem("loginTime")?.loginTime,
  };
  const [inputs, setInputs] = useState(initialState);
  const [editMode, setEditMode] = useState(false);
  const style = {
    width: "500px",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "50px",
    justifyContent: "center",
    alignItems: "center",
  };
  // ------------------------------------------------- Table Pagination ---------------------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(workReportList?.length / itemsPerPage) || 0;
  const currentRows = workReportList?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEditWorkReport = (e, _id) => {
    e.preventDefault();
    const findReport = workReportList.find((task) => task?._id === _id);

    setInputs({
      ...inputs,
      report: findReport?.report,
      _id: findReport?._id,
    });
    setEditMode(true);
    setIsOpen(true);
  };
  const fetchWorkReportList = useCallback(async () => {
    try {
      const FINAL_END_POINT =
        userRole === "USER"
          ? `${REPORT.replace("create", "")}${user._id}`
          : `/report?adminId=${user._id}`;
      const response = await fetchApiV1(FINAL_END_POINT);
      // console.log(response);

      if (response.status === 200) {
        const reports =
          userRole === "USER"
            ? response?.data?.userReport
            : userRole === "MANAGER"
            ? response?.data?.allReports.filter(
                (manager) => manager.userId.managerId === user._id
              )
            : response?.data?.allReports;
        setWorkReportList(reports);
      } else {
        setWorkReportList([]);
        throw response;
      }
    } catch (error) {
      throw new Error(error);
    }
  }, [user._id, userRole]);
  const postWorkReport = async () => {
   
    try {
      const response = await postApiV1(REPORT, {
        ...inputs,
      });
      if (response.status == 201) {
        clearInputs();
        fetchWorkReportList();
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const updateWorkReport = async () => {
   
    try {
      const response = await patchApiV1(
        `${REPORT.replace("create", `${inputs._id}`)}`,
        {
          ...inputs,
        }
      );
      if (response.status == 201) {
        clearInputs();
        fetchWorkReportList();
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const deleteWorkReport = async (_id) => {
    try {
      const response = await deleteApiV1(`${REPORT.replace("create", _id)}`);
      if (response.status == 200) {
        clearInputs();
        fetchWorkReportList();
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const clearInputs = () => {
    try {
      setInputs(initialState);
      setIsOpen(false);
      editMode && setInputs({ ...inputs, _id: "" });
    } catch (error) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    fetchWorkReportList();
  }, [fetchWorkReportList]);
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
                  Add workReport
                </button>
              </div>
            )}
            <div className="w-full mt-10 overflow-x-auto custom-scrollbar shadow-sm">
              <table className="w-full">
                <thead className="bg-green-300">
                  <tr className="">
                    <th className="py-2 border-r-2">Employee Id</th>
                    <th className="py-2 border-r-2">Employee Name</th>
                    <th className="py-2 border-r-2">Report</th>
                    <th className="py-2 border-r-2">Date</th>
                    <th className="py-2 border-r-2">Login Time</th>
                    <th className="py-2 border-r-2">Log Out</th>
                    <th className="py-2 border-r-2">Total Working Hours</th>

                    <th className="py-2 border-r-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.length === 0 && (
                    <tr>
                      <td className="py-5 border-r-2 text-center" colSpan={6}>
                        No Record Found
                      </td>
                    </tr>
                  )}
                  {currentRows?.map((workReport) => {
                    return (
                      <tr
                        className="text-center font-thin border-2 border-opacity-85"
                        key={workReport?._id}
                      >
                        <td className="py-2 border-r-2">
                          {workReport?.userId?.employeeId}
                        </td>
                        <td className="py-2 border-r-2">
                          {workReport?.userId?.fullName}
                        </td>
                        <td className="py-2 border-r-2">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: workReport?.report,
                            }}
                          />
                        </td>
                        <td className="py-2 border-r-2">
                          {workReport?.updatedAt?.split("T")[0]}
                        </td>
                        <td className="py-2 border-r-2">
                          {getCurrentTime(workReport?.loginTime)}
                        </td>

                        <td className="py-2 border-r-2">
                          {workReport?.logoutTime !== null &&
                            getCurrentTime(workReport?.logoutTime)}
                        </td>
                        <td className="py-2 border-r-2">{workReport?.workingHours}</td>
                        <td className="py-2 border-r-2">
                          <div className="w-full flex justify-center items-center gap-5">
                            {isEdit &&
                              (userRole !== "USER" ||
                                (userRole === "USER" &&
                                  workReport?.updatedAt?.split("T")[0] ===
                                    currentDate)) && (
                                <button
                                  type="button"
                                  className="bg-yellow-500 text-white w-24 rounded-sm h-10"
                                  onClick={(e) =>
                                    handleEditWorkReport(e, workReport?._id)
                                  }
                                >
                                  Edit
                                </button>
                              )}
                            {/* workReport?.updatedAt.split("T")[0] ===
                            currentDate && */}
                            {isDelete && (
                              <button
                                type="button"
                                className="bg-red-500 text-white w-24 rounded-sm h-10"
                                onClick={() =>
                                  deleteWorkReport(workReport?._id)
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
            <h1>{editMode ? "Update" : "Add"} Work Report</h1>
            <Button color="error" onClick={() => setIsOpen(false)}>
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
            <ReactQuill
              onChange={(value) => setInputs({ ...inputs, report: value })}
              value={inputs.report}
            />
            <Button
              onClick={editMode ? updateWorkReport : postWorkReport}
              className="w-44"
              variant="contained"
            >
              {editMode ? "Update" : "Add"}
            </Button>
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default WorkReportList;
