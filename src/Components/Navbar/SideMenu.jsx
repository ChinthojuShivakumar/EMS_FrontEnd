
import { NavLink, useNavigate } from 'react-router-dom';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SickIcon from '@mui/icons-material/Sick';
import { postApiV1 } from '../Constant/Network';
import { LOGOUT } from '../Constant/EndPoints';
// import { IoChatboxEllipses } from "react-icons/io5";
import { PiProjectorScreenChartFill } from "react-icons/pi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { FaUserGear } from "react-icons/fa6";
import { BsMicrosoftTeams } from "react-icons/bs";
import { getPermissionList } from '../../Utils/Functions';
import { FaKey } from "react-icons/fa"

const SideMenu = () => {
    const navigate = useNavigate()
    const userRole = JSON.parse(localStorage.getItem("role"))
    const { menusList } = getPermissionList()
    const adminMenus = [
        {
            menu: "Dashboard",
            url: "/",
            icon: <DashboardIcon />
        },
        {
            menu: "Departments",
            url: "/departments",
            icon: <HiBuildingOffice2 size={28} />
        },
        {
            menu: "Admin Users",
            url: "/roles",
            icon: <FaUserGear size={28} />
        },
        {
            menu: "Job Roles",
            url: "/job-roles",
            icon: <FaUserGear size={28} />
        },
        {
            menu: "Projects",
            url: "/projects",
            icon: <PiProjectorScreenChartFill size={28} />
        },
        {
            menu: "Employee List",
            url: "/users",
            icon: <PeopleAltIcon />
        },
        {
            menu: "Tasks",
            url: "/tasks",
            icon: <AssignmentIcon />
        },
        {
            menu: "Work Report",
            url: "/work-report",
            icon: <AssessmentIcon />
        },
        {
            menu: "Leaves",
            url: "/leaves",
            icon: <SickIcon />
        },
        {
            menu: "Teams",
            url: "/teams",
            icon: <BsMicrosoftTeams size={25} />
        },
        // {
        //     menu: "Permissions",
        //     url: "/admin/permissions",
        //     icon: <FaKey size={20} />
        // }

    ]
    // const userMenus = [
    //     {
    //         _id: 1,
    //         menu: "Dashboard",
    //         url: "/user",
    //         icon: <DashboardIcon />
    //     },
    //     {
    //         _id: 2,
    //         menu: "Tasks",
    //         url: "/user/tasks",
    //         icon: <AssignmentIcon />
    //     },
    //     {
    //         _id: 3,
    //         menu: "Work Report",
    //         url: "/user/work-report",
    //         icon: <AssessmentIcon />
    //     },
    //     {
    //         _id: 4,
    //         menu: "Leaves",
    //         url: "/user/leaves",
    //         icon: <SickIcon />
    //     },
    //     // {
    //     //     _id: 5,
    //     //     menu: "Chats",
    //     //     url: "/admin/chats",
    //     //     icon: <IoChatboxEllipses size={25}/>
    //     // }

    // ]

    // const isMenu = adminMenus.some((menu) => menusList.some((item) => item.title === menu.menu))



    const handleLogout = async () => {
        try {
            const response = await postApiV1(LOGOUT)
            if (response.status === 200) {
                localStorage.clear()
                navigate('/login')
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            console.error("Logout Error:", error.message); // Improved error logging
            throw new Error(error.message); // Ensure error.message is meaningful
        }
    }

    return (
        <div className='w-full h-screen bg-white shadow-sm font-roboto '>

            <div className='w-full flex flex-col justify-start items-start py-2'>

                <div className='w-full'>
                    {
                        adminMenus
                            .filter((menu) => menusList.some((item) => item.title === menu.menu))?.map((menu, i) => {
                                return (
                                    <NavLink
                                        to={menu.url}
                                        className={({ isActive, isPending }) =>
                                            isActive
                                                ? `w-full flex justify-start items-center gap-3  py-3 bg-green-700  text-white px-2 hover:bg-green-700 hover:bg-opacity-85`
                                                : isPending
                                                    ? `w-full flex justify-start items-center gap-3 py-3 bg-green-700 text-green-700 cursor-pointer px-2 hover:bg-[#5f5f6a]hover:bg-opacity-85`
                                                    : `w-full flex justify-start items-center gap-3  py-3 cursor-pointer px-2 hover:bg-green-700 hover:text-white hover:bg-opacity-85`
                                        }
                                        key={menu.i || menu?.menu}
                                        end={menu.url === userRole == "admin" ? "/admin" : "/user"}
                                    >
                                        {menu.icon}
                                        <h1 className='max-sm:hidden sm:max-md:hidden md:max-lg:visible'>{menu.menu}</h1>
                                    </NavLink>
                                )
                            })
                    }
                </div>
                <div className='w-full flex justify-start items-center gap-3 py-3 text-red-700 cursor-pointer px-2 hover:bg-green-700 hover:text-white hover:bg-opacity-85' onClick={() => handleLogout()}>
                    <LogoutIcon />
                    <h1 className='max-sm:hidden sm:max-md:hidden'> Logout</h1>
                </div>
            </div>
        </div>
    )
}

export default SideMenu