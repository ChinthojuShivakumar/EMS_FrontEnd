import { useCallback, useEffect, useState } from "react"
import Header from "../../../Components/Navbar/Header"
import SideMenu from "../../../Components/Navbar/SideMenu"
import { fetchApiV1, postApiV1 } from "../../../Components/Constant/Network"
import { REPORT } from "../../../Components/Constant/EndPoints"
import Modal from "../../../Components/Constant/Modal"
import { Box, Button } from "@mui/material"
import ReactQuill from "react-quill"
import { getCurrentTime } from "../../../Utils/Functions"
import Pagination from "../../../Components/Pagination/Pagination"


const UserWorkReportList = () => {
    const [workReportList, setWorkReportList] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))
    const [isOpen, setIsOpen] = useState(false)
    const initialState = {
        report: "",
        userId: JSON.parse(localStorage.getItem("user"))._id,
        loginTime: JSON.parse(localStorage.getItem("loginTime"))
    }
    const [inputs, setInputs] = useState(initialState)
    const style = { width: "500px", height: "auto", display: "flex", flexDirection: "column", gap: "50px", justifyContent: "center", alignItems: "center" }
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const totalPages = Math.ceil(workReportList.length / itemsPerPage)
    const currentRows = workReportList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const fetchWorkReportList = useCallback(async () => {
        try {
            const response = await fetchApiV1(`${REPORT.replace("create", "")}${user._id}`)
            if (response.status === 200) {
                setWorkReportList(response?.data?.userReport)
            } else {
                setWorkReportList([])
                throw response
            }
        } catch (error) {
            throw new Error(error)
        }
    }, [user._id])
    const postWorkReport = async () => {
        try {
            const response = await postApiV1(REPORT, inputs)
            if (response.status == 201) {
                clearInputs()
                fetchWorkReportList()
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    const clearInputs = () => {
        try {
            setInputs(initialState)
            setIsOpen(false)
        } catch (error) {
            throw new Error(error)
        }
    }
    useEffect(() => {
        fetchWorkReportList()
    }, [fetchWorkReportList])
    return (
        <div>
            <Header />
            <div className="w-full font-roboto font-medium">
                <div className="w-[15%] fixed top-20">
                    <SideMenu />
                </div>
                <div className="ml-[15%] px-5 mt-24 w-[85%] ">
                    <div className="w-full">
                        <div className="w-full flex justify-end items-end">
                            <button type="button" className="w-52 text-white bg-green-700 py-3" onClick={() => setIsOpen(true)}>Add workReport</button>
                        </div>
                        <div className="w-full mt-10 overflow-x-auto custom-scrollbar shadow-sm">
                            <table className="w-full">
                                <thead className="bg-green-300">
                                    <tr className="">
                                        {/* <th className="py-2 border-r-2">Employee Name</th>
                                        <th className="py-2 border-r-2">Employee Id</th> */}
                                        <th className="py-2 border-r-2">Date</th>
                                        <th className="py-2 border-r-2">Login Time</th>
                                        <th className="py-2 border-r-2">Report</th>
                                        <th className="py-2 border-r-2">Log Out</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        currentRows.map((workReport) => {
                                            return (
                                                <tr className="text-center font-thin border-2 border-opacity-85" key={workReport?._id}>
                                                    {/* <td className="py-2 border-r-2">{workReport?.userId?.fullName}</td>
                                                    <td className="py-2 border-r-2">{workReport?.userId?.employeeId}</td> */}
                                                    <td className="py-2 border-r-2">{workReport?.createdAt.split("T")[0]}</td>
                                                    <td className="py-2 border-r-2">{workReport?.loginTime}</td>
                                                    <td className="py-2 border-r-2">
                                                        <div dangerouslySetInnerHTML={{ __html: workReport?.report }} />
                                                    </td>
                                                    <td className="py-2 border-r-2">{getCurrentTime(workReport?.updatedAt.split("T")[1])}</td>

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
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                style={style}
            >
                <div className="font-roboto w-full font-semibold">
                    <div className="flex justify-between items-center py-5">
                        <h1>Add User</h1>
                        <Button color="error" onClick={() => setIsOpen(false)}>close</Button>
                    </div>
                    <Box sx={{ width: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <ReactQuill
                            onChange={(value) => setInputs({ ...inputs, report: value })}
                        />
                        <Button onClick={postWorkReport} className="w-52" variant="contained">Add Work Report</Button>
                    </Box>
                </div>
            </Modal>
        </div>
    )
}

export default UserWorkReportList