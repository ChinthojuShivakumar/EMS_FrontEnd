import { useCallback, useEffect, useState } from "react"
import Header from "../../../Components/Navbar/Header"
import SideMenu from "../../../Components/Navbar/SideMenu"
// import TableComponent from "../../../Components/TableComponent/TableComponent"
import { getPermissionList, getUserId } from "../../../Utils/Functions"
import { deleteApiV2, fetchApiV2 } from "../../../Components/Constant/Network.V2"
import Pagination from "../../../Components/Pagination/Pagination"
import { useNavigate } from "react-router-dom"


const AdminUsers = () => {
    const { menusList, submenuList } = getPermissionList()
    const MENU = "Admin Users"
    const isMenuMatched = menusList.filter((item) => item.title === MENU)
    const listedPermissions = submenuList.filter((item) => item.menuId === isMenuMatched[0]?._id)
    const isEdit = listedPermissions.some((edit) => edit.title === "edit")
    const isDelete = listedPermissions.some((remove) => remove.title === "delete")
    const isAdd = listedPermissions.some((add) => add.title === "post")

    const [roleList, setRoleList] = useState([])
    const adminId = getUserId()
    const [currentPage, setCurrentPage] = useState(1)
    const navigate = useNavigate()
    const itemsPerPage = 10
    const totalPages = Math.ceil(roleList.length / itemsPerPage)
    const currentRows = roleList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleEditUser = (e, _id) => {
        e.preventDefault()
        const findRole = roleList.find((task) => task?._id === _id)
        navigate("/roles/update", { state: findRole })
    }
    const fetchRoles = useCallback(async () => {
        try {
            const response = await fetchApiV2(`/admin-role/list?adminId=${adminId}`)
            if (response.status === 200) {
                setRoleList(response.data.roleList)
            } else {
                throw new Error(response)
            }
        } catch (error) {
            throw new Error(error.response)
        }
    }, [adminId])
    const deleteDepartment = async (_id) => {
        try {
            const response = await deleteApiV2(`/admin-role/delete/${_id}?adminId=${adminId}`)
            if (response.status == 200) {
                // clearInputs()
                fetchRoles()
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    useEffect(() => {
        fetchRoles()
    }, [fetchRoles])

    return (
        <div>
            <Header />
            <div className="w-full font-roboto font-medium">
                <div className="w-[15%] fixed top-20">
                    <SideMenu />
                </div>
                <div className="ml-[15%] px-5 mt-24 w-[85%] ">
                    <div>
                        {
                            isAdd && <div className="w-full flex justify-end items-center">
                                <button
                                    type="button"
                                    className="w-52 text-white bg-green-700 py-3"
                                    onClick={() => window.location.href = "/roles/add"}
                                >
                                    Add Role
                                </button>
                            </div>
                        }
                        <div className="w-full mt-10 overflow-x-auto custom-scrollbar shadow-sm">
                            <table className="w-full">
                                <thead className="bg-green-300">
                                    <tr className="">
                                        <th className="py-2 border-r-2">Role Name</th>
                                        <th className="py-2 border-r-2">Menu</th>
                                        <th className="py-2 border-r-2">Sub Menu</th>
                                        <th className="py-2 border-r-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        currentRows.map((role) => {
                                            return (
                                                <tr className="text-center font-thin border-2 border-opacity-85" key={role?._id}>
                                                    <td className="py-2 border-r-2">{role?.name}</td>
                                                    <td className="py-2 border-r-2">
                                                        {
                                                            role?.menus?.map((menu) => <li className="text-start pl-5" key={menu?._id}>{menu.title}</li>)
                                                        }
                                                    </td>
                                                    <td className="py-2 border-r-2 grid grid-cols-3">
                                                        {
                                                            role?.subMenus?.map((menu) => <li className="text-start pl-5" key={menu?._id}>{menu.title}</li>)
                                                        }
                                                    </td>
                                                    <td className="py-2 border-r-2">
                                                        <div className="w-full flex justify-center items-center gap-5">
                                                            {isEdit && <button type="button" className="bg-yellow-500 text-white w-24 rounded-sm h-10" onClick={(e) => handleEditUser(e, role?._id)}>Edit</button>}
                                                            {isDelete && <button type="button" className="bg-red-500 text-white w-24 rounded-sm h-10" onClick={() => deleteDepartment(role?._id)}>Delete</button>}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
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
        </div>
    )
}

export default AdminUsers