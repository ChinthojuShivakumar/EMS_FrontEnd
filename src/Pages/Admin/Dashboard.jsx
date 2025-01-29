import Header from "../../Components/Navbar/Header";
import SideMenu from "../../Components/Navbar/SideMenu";
import ReduceCapacityIcon from "@mui/icons-material/ReduceCapacity";
import ArticleIcon from "@mui/icons-material/Article";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { useCallback, useEffect, useState } from "react";
import { fetchApiV1 } from "../../Components/Constant/Network";
import {
  DEPARTMENT,
  JOB_ROLE,
  LEAVE,
  USER,
} from "../../Components/Constant/EndPoints";
import {
  getPermissionList,
  getUserId,
  getUserRole,
} from "../../Utils/Functions";
import { PiProjectorScreenChartFill } from "react-icons/pi";
import { FaBan } from "react-icons/fa";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { FaUserGear } from "react-icons/fa6";

const Dashboard = () => {
  const { menusList, submenuList } = getPermissionList();
  const MENU = "Dashboard";
  const isMenuMatched = menusList.filter((item) => item.title === MENU);
  const listedPermissions = submenuList.filter(
    (item) => item.menuId === isMenuMatched[0]?._id
  );

  const userRole = getUserRole();
  const userId = getUserId();

  const [employeeList, setEmployeeList] = useState([]);
  const [leavesApproved, setLeavesApproved] = useState([]);
  const [leavesNotApproved, setLeavesNotApproved] = useState([]);
  const [leavesRejected, setLeavesRejected] = useState([]);
  const [leavesPending, setLeavesPending] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);

  const arrayList = [
    {
      title: "Total Departments",
      icon: <HiBuildingOffice2 size={28} />,
      count: departmentList.length,
      color: "bg-orange-600",
    },
    {
      title: "Total Job Roles",
      icon: <FaUserGear size={28} />,
      count: roleList.length,
      color: "bg-orange-600",
    },
    {
      title: "Total Projects",
      icon: <PiProjectorScreenChartFill size={28} />,
      count: projectsList.length,
      color: "bg-orange-600",
    },
    {
      title: "Total Employees",
      icon: <ReduceCapacityIcon />,
      count: employeeList.length,
      color: "bg-orange-600",
    },
    {
      title: "Leaves Pending",
      icon: <PendingActionsIcon />,
      count: leavesPending.length,
      color: "bg-yellow-600",
    },
    {
      title: "Leaves Approved",
      icon: <ArticleIcon />,
      count: leavesApproved.length,
      color: "bg-green-600",
    },
    {
      title: "Leaves Rejected",
      icon: <FaBan size={28} />,
      count: leavesNotApproved.length,
      color: "bg-red-600",
    },
    {
      title: "Leaves Cancelled",
      icon: <CancelIcon />,
      count: leavesRejected.length,
      color: "bg-red-600",
    },
  ];
  const fetchEmployeeList = async () => {
    try {
      const response = await fetchApiV1(USER);
      if (response.status === 200) {
        setEmployeeList(response?.data?.usersList);
      } else {
        setEmployeeList([]);
        throw response;
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const fetchRolesList = async () => {
    try {
      const response = await fetchApiV1(JOB_ROLE);
      if (response.status === 200) {
        setRoleList(response?.data?.role);
      } else {
        setRoleList([]);
        throw response;
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  const fetchLeaveList = useCallback(async () => {
    try {
      const response = await fetchApiV1(
        LEAVE.replace("/create", `${userRole === "USER" ? `/${userId}` : ""}`)
      );
      if (response.status === 200) {
        const leaveList = response.data.leaveList;
        const filteredPendingLeave = leaveList.filter(
          (leave) => leave.status === "Pending"
        );
        const filteredApprovedLeave = leaveList.filter(
          (leave) => leave.status === "Approved"
        );
        const filteredNotApprovedLeave = leaveList.filter(
          (leave) => leave.status === "Not Approved"
        );
        const filteredCancelledLeave = leaveList.filter(
          (leave) => leave.status === "Cancelled"
        );
        setLeavesPending(filteredPendingLeave);
        setLeavesApproved(filteredApprovedLeave);
        setLeavesRejected(filteredCancelledLeave);
        setLeavesNotApproved(filteredNotApprovedLeave);
      } else {
        setEmployeeList([]);
        throw response;
      }
    } catch (error) {
      throw new Error(error);
    }
  }, [userId, userRole]);
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
  const fetchProjects = async () => {
    try {
      const adminId = await getUserId();
      const response = await fetchApiV1(`/projects?adminId=${adminId}`);
      if (response.status === 200) {
        setProjectsList(response.data.projectList);
      } else {
        throw new Error(response);
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    fetchEmployeeList();
    fetchLeaveList();
    userRole != "USER" && fetchProjects();
    fetchDepartmentList();
    fetchRolesList();
  }, [fetchLeaveList, userRole]);
  return (
    <div>
      <Header />
      <div className="w-full font-roboto font-medium">
        <div className="w-[15%] fixed top-20">
          <SideMenu />
        </div>
        <div className="ml-[15%] px-5 mt-24 w-[85%] ">
          <div className="w-full grid grid-cols-4 gap-6">
            {arrayList
              .filter((it) =>
                listedPermissions.some((mn) => mn.title === it.title)
              )
              .map((item, i) => {
                return (
                  <div
                    key={i}
                    className={`w-full flex shadow-lg gap-3 h-16 rounded-sm `}
                  >
                    <div
                      className={`w-[40%] flex justify-center items-center text-white ${item.color}`}
                    >
                      <p>{item.icon}</p>
                    </div>
                    <div className="w-full flex flex-col gap-1 justify-center items-start">
                      <p>{item.title}</p>
                      <p>{item.count}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
