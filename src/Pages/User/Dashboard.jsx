import Header from "../../Components/Navbar/Header"
import SideMenu from "../../Components/Navbar/SideMenu"
// import ReduceCapacityIcon from '@mui/icons-material/ReduceCapacity';
import ArticleIcon from '@mui/icons-material/Article';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { useCallback, useEffect, useState } from "react";
import { fetchApiV1 } from "../../Components/Constant/Network";
import { LEAVE } from "../../Components/Constant/EndPoints";

const UserDashboard = () => {
  // const [employeeList, setEmployeeList] = useState([])
  const [leavesApproved, setLeavesApproved] = useState([])
  const [leavesRejected, setLeavesRejected] = useState([])
  const [leavesPending, setLeavesPending] = useState([])
  const user = JSON.parse(localStorage.getItem("user"))

  const arrayList = [
    // {
    //   title: "Total Employees",
    //   icon: <ReduceCapacityIcon />,
    //   count: employeeList.length,
    //   color: "bg-orange-600"
    // },
    {
      title: "Leaves Approved",
      icon: <ArticleIcon />,
      count: leavesApproved.length,
      color: "bg-green-600"
    },
    {
      title: "Leaves Cancelled",
      icon: <CancelIcon />,
      count: leavesRejected.length,
      color: "bg-red-600"
    },
    {
      title: "Leaves Pending",
      icon: <PendingActionsIcon />,
      count: leavesPending.length,
      color: "bg-yellow-600"
    },
  ]
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
  const fetchLeaveList = useCallback(async () => {
    try {
      const response = await fetchApiV1(LEAVE.replace("/create", `/${user._id}`),)
      if (response.status === 200) {
        const leaveList = response.data.leaveList
        const filteredPendingLeave = leaveList.filter((date) => date.status == "Pending")
        const filteredApprovedLeave = leaveList.filter((date) => date.status == "Approved")
        const filteredCancelledLeave = leaveList.filter((date) => date.status == "Cancelled")
        setLeavesPending(filteredPendingLeave)
        setLeavesApproved(filteredApprovedLeave)
        setLeavesRejected(filteredCancelledLeave)
      } else {
        // setEmployeeList([])
        throw response
      }
    } catch (error) {
      throw new Error(error)
    }
  }, [user._id])
  useEffect(() => {
    // fetchEmployeeList()
    fetchLeaveList()
  }, [fetchLeaveList])
  return (
    <div>
      <Header />
      <div className="w-full font-roboto">
        <div className="w-[15%] fixed top-20">
          <SideMenu />
        </div>
        <div className="ml-[15%] px-5 mt-24 w-[85%] ">
          <div className="w-full grid grid-cols-4 gap-6">
            {
              arrayList.map((item, i) => {
                return (
                  <div key={i} className={`w-full flex shadow-lg gap-3 h-16 rounded-sm `}>
                    <div className={`w-[40%] flex justify-center items-center text-white ${item.color}`}>
                      <p>{item.icon}</p>
                    </div>
                    <div className="w-full flex flex-col gap-1 justify-center items-start">
                      <p>{item.title}</p>
                      <p>{item.count}</p>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard