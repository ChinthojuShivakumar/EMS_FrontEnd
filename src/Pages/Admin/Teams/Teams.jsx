import { useCallback, useEffect, useState } from "react";
import Header from "../../../Components/Navbar/Header";
import SideMenu from "../../../Components/Navbar/SideMenu";
import Pagination from "../../../Components/Pagination/Pagination";
import {
  deleteApiV2,
  fetchApiV2,
} from "../../../Components/Constant/Network.V2";
import {
  getPermissionList,
  getUserId,
  getUserRole,
} from "../../../Utils/Functions";
import { useNavigate } from "react-router-dom";

const Teams = () => {
  const [teamList, setTeamList] = useState([]);
  const adminId = getUserId();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const MENU = "Teams";
  const { menusList, submenuList } = getPermissionList();
  const isMenuMatched = menusList.filter((item) => item.title === MENU);
  const listedPermissions = submenuList.filter(
    (item) => item.menuId === isMenuMatched[0]._id
  );
  const isEdit = listedPermissions.some((edit) => edit.title === "edit");
  const isDelete = listedPermissions.some(
    (remove) => remove.title === "delete"
  );
  const isAdd = listedPermissions.some((add) => add.title === "post");

  // const [editMode, setEditMode] = useState(false)
  // const [isOpen, setIsOpen] = useState(false)
  // const initialState = {
  //     title: "",
  //     projectId: ""
  // }
  // const [inputs, setInputs] = useState(initialState)
  // const style = { width: "auto", height: "auto", display: "flex", flexDirection: "column", gap: "50px", justifyContent: "center", alignItems: "center", overflowY: "scroll", position: "relative" }

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(teamList?.length / itemsPerPage);
  const currentRows = teamList?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (e, teamId) => {
    e.preventDefault();
    try {
      // console.log('Editing Row:', row, 'Row Index:', rowIndex);
      const findTeam = teamList.find((project) => project?._id === teamId);

      if (!findTeam) {
        console.error("Unable to find project:", teamId);
        return;
      }

      navigate("/team/update", { state: findTeam });
    } catch (error) {
      console.error("Error in handleEdit:", error);
    }
  };

  const handleDelete = async (_id) => {
    try {
      const response = await deleteApiV2(`/team/${_id}?adminId=${adminId}`);
      if (response.status == 200) {
        fetchTeamList();
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const fetchTeamList = useCallback(async () => {
    try {
      const response = await fetchApiV2(`/team?adminId=${adminId}`);
      if (response.status === 200) {
        const userRole = getUserRole();
        const filterTeamByManager =
          userRole === "MANAGER"
            ? response.data.teamList.filter(
                (manager) => manager.managerId._id === adminId
              )
            : null;
        const filterTeamByUser =
          userRole === "USER"
            ? response.data.teamList.filter((manager) =>
                manager.teamMembers.some(
                  (teamUserId) => teamUserId._id === adminId
                )
              )
            : null;
        const data = response.data.teamList;
        const finalData = filterTeamByManager || filterTeamByUser || data;
        setTeamList(finalData);
      } else {
        throw response;
      }
    } catch (error) {
      setError(error.data.message || "An unexpected error occurred.");
      console.error(error);
    }
  }, [adminId]);
  useEffect(() => {
    fetchTeamList();
  }, [fetchTeamList]);

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
                onClick={() => navigate("/team/add")}
              >
                Add Team
              </button>
            </div>
          )}
          <div className="w-full mt-10 overflow-x-auto custom-scrollbar shadow-sm">
            <table className="w-full">
              <thead className="bg-green-300">
                <tr className="">
                  <th className="py-2 border-r-2">Project</th>
                  <th className="py-2 border-r-2">Team Name</th>
                  <th className="py-2 border-r-2">Admins</th>
                  <th className="py-2 border-r-2">Manager</th>
                  <th className="py-2 border-r-2">Team Leader</th>
                  <th className="py-2 border-r-2">Team Members</th>
                  {(isEdit || isDelete) && (
                    <th className="py-2 border-r-2">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="text-center">
                {teamList?.length === 0 && (
                  <tr className="py-2 border-r-2">
                    <td colSpan={8} className="py-5">
                      No Teams Found
                    </td>
                  </tr>
                )}
                {currentRows?.map((task) => {
                  return (
                    <tr key={task?._id}>
                      <td className="py-2 border-r-2">
                        {task.projectId?.map((project) => (
                          <p key={project?._id}>{project?.title}</p>
                        ))}
                      </td>
                      <td>{task.teamName}</td>
                      <td className="py-2 border-r-2">
                        {task.admins?.map((admin) => (
                          <p key={admin?._id}>{admin?.fullName}</p>
                        ))}
                      </td>
                      <td>{task.managerId?.fullName}</td>
                      <td>{task.teamLeaderId?.fullName}</td>
                      <td className="py-2 border-r-2">
                        {task.teamMembers?.map((member) => (
                          <p key={member?._id}>{member?.fullName}</p>
                        ))}
                      </td>

                      <td>
                        <div className="flex justify-center items-center gap-5">
                          {isEdit && (
                            <button
                              type="button"
                              className="bg-yellow-500 text-white w-24 rounded-sm h-10"
                              onClick={(e) => handleEdit(e, task?._id)}
                            >
                              Edit
                            </button>
                          )}
                          {isDelete && (
                            <button
                              type="button"
                              className="bg-red-500 text-white w-24 rounded-sm h-10"
                              onClick={() => handleDelete(task?._id)}
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
  );
};

export default Teams;
