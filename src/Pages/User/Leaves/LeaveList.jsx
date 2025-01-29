import { useCallback, useEffect, useState } from "react"
import Header from "../../../Components/Navbar/Header"
import SideMenu from "../../../Components/Navbar/SideMenu"
import { fetchApiV1, postApiV1 } from "../../../Components/Constant/Network"
import { LEAVE } from "../../../Components/Constant/EndPoints"
import Modal from "../../../Components/Constant/Modal"
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import Pagination from "../../../Components/Pagination/Pagination"
// import { Button } from "@mui/material"


const LeaveListUser = () => {
    const [workReportList, setWorkReportList] = useState([])
    const user = JSON.parse(localStorage.getItem("user"))
    const [isOpen, setIsOpen] = useState(false)
    const initialState = {
        leaveDates: [],
        userId: JSON.parse(localStorage.getItem("user"))._id,
        leaveType: ""
    }
    const [inputs, setInputs] = useState(initialState)
    const style = { width: "500px", height: "auto", display: "flex", flexDirection: "column", gap: "50px", justifyContent: "center", alignItems: "center" }
    // ------------------------------------------------- Table Pagination ---------------------------------------------------------------
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const totalPages = Math.ceil(workReportList.length / itemsPerPage)
    const currentRows = workReportList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const fetchLeaveList = useCallback(async () => {
        try {
            const response = await fetchApiV1(LEAVE.replace("/create", `/${user?._id}`))
            if (response.status === 200) {
                setWorkReportList(response?.data?.leaveList)
            } else {
                setWorkReportList([])
                throw response
            }
        } catch (error) {
            throw new Error(error)
        }
    }, [user?._id])

    const handleChangeInputs = (e, nV, type) => {
        e.preventDefault()
        if (type === "leaveType") {
            setInputs({ ...inputs, leaveType: e.target.value })
            return
        }
        if (type === "leaveDates") {
            const date = e.target.value
            if (!inputs.leaveDates.includes(date)) {
                setInputs({ ...inputs, leaveDates: [...inputs.leaveDates, date] })
                return
            }

        }

    }
    const handleCancelLeave = async (e, _id, userId) => {
        e.preventDefault()
        const payload = {
            _id: _id,
            userId: userId || null,
            rejectedBy: user?._id || null,
        }
        try {
            const response = await postApiV1(LEAVE.replace("/create", `/cancel`), payload)
            if (response.status === 202) {
                fetchLeaveList()
            } else {
                throw response
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    const postLeave = async () => {
        try {
            const response = await postApiV1(LEAVE, inputs)
            if (response.status == 201) {
                clearInputs()
                fetchLeaveList()
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
        fetchLeaveList()
    }, [fetchLeaveList])
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
                            <button type="button" className="w-52 text-white bg-green-700 py-3" onClick={() => setIsOpen(true)}>Add Leave</button>
                        </div>
                        <div className="w-full mt-10 overflow-x-auto custom-scrollbar shadow-sm">
                            <table className="w-full">
                                <thead className="bg-green-300">
                                    <tr className="">
                                        {/* <th className="py-2 border-r-2">Employee Name</th>
                                        <th className="py-2 border-r-2">Employee Id</th> */}
                                        <th className="py-2 border-r-2">Leave Type</th>
                                        <th className="py-2 border-r-2">Leave Dates</th>
                                        <th className="py-2 border-r-2">Leave Status</th>
                                        <th className="py-2 border-r-2">Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        currentRows.map((workReport) => {
                                            return (
                                                <tr className="text-center font-thin border-2 border-opacity-85" key={workReport?._id}>
                                                    {/* <td className="py-2 border-r-2">{workReport?.userId?.fullName}</td>
                                                    <td className="py-2 border-r-2">{workReport?.userId?.employeeId}</td> */}
                                                    <td className="py-2 border-r-2">{workReport?.leaveType}</td>
                                                    <td className="py-2 border-r-2">{workReport?.date}</td>
                                                    <td className="py-2 border-r-2">{workReport?.status}</td>

                                                    <td>{workReport?.status !== "Cancelled" && workReport?.status !== "Not Approved" &&
                                                        <Button className="" color="error" variant="outlined" onClick={(e) => handleCancelLeave(e, workReport?._id, workReport?.userId)}>Cancel Leave</Button>
                                                    }</td>
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
                        <h1>Apply Leave</h1>
                        <Button color="error" onClick={() => setIsOpen(false)}>close</Button>
                    </div>
                    <Box sx={{ width: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Leave Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={inputs.taskStage}
                                label="Task Stage"
                                onChange={(e) => handleChangeInputs(e, null, "leaveType")}
                            >
                                <MenuItem value={"Sick"}>Sick</MenuItem>
                                <MenuItem value={"Casual"}>Casual</MenuItem>
                                <MenuItem value={"Occasional"}>Occasional</MenuItem>
                            </Select>
                        </FormControl>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            // value={inputs.leaveDates}
                            className="border-2 py-2 px-2 my-3 rounded-md"
                            onChange={(e) => handleChangeInputs(e, null, "leaveDates")}

                        />
                        <ul>
                            {
                                inputs.leaveDates.map((item, i) => {
                                    <li className="list-disc text-red-400" key={i}>{item}</li>
                                })
                            }
                        </ul>
                        {/* <ReactQuill
                            onChange={(value) => setInputs({ ...inputs, report: value })}
                        /> */}
                        <Button onClick={postLeave} className="w-32" variant="contained">Apply Leave</Button>
                    </Box>
                </div>
            </Modal>
        </div>
    )
}

export default LeaveListUser