import Header from "../../../Components/Navbar/Header"
import SideMenu from "../../../Components/Navbar/SideMenu"


const TaskModal = () => {
    return (
        <div>
            <Header />
            <div className="w-full font-roboto">
                <div className="w-[15%] fixed top-20">
                    <SideMenu />
                </div>
                <div className="ml-[15%] px-5 mt-24 w-[85%] ">
                    <h1>Hello</h1>

                </div>
            </div>
        </div>
    )
}

export default TaskModal