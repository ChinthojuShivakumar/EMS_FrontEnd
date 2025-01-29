import ChatComponent from "../../../Components/ChatComponent/ChatComponent"
import Header from "../../../Components/Navbar/Header"


const Chat = () => {
    const users = [
        {
            "userId": "user123",
            "username": "John Doe",
            "status": "online",
            "profilePicture": "https://example.com/profiles/john.jpg"
        },
        {
            "userId": "user124",
            "username": "Jane Smith",
            "status": "offline",
            "profilePicture": "https://example.com/profiles/jane.jpg"
        },
        {
            "userId": "user125",
            "username": "Samuel Green",
            "status": "online",
            "profilePicture": "https://example.com/profiles/samuel.jpg"
        },
        {
            "userId": "user126",
            "username": "Emily White",
            "status": "offline",
            "profilePicture": "https://example.com/profiles/emily.jpg"
        },
        {
            "userId": "user127",
            "username": "Michael Brown",
            "status": "online",
            "profilePicture": "https://example.com/profiles/michael.jpg"
        }
    ]

    return (
        <div className="w-full ">
            <div className="">
                <Header />
            </div>
            <div className="w-full ">
                <div className="w-[6%] bg-green-500 h-screen shadow-lg fixed top-20 bg-opacity-55 flex justify-start items-start flex-col px-5">
                    <div>
                        chat
                    </div>
                    <div>
                        home
                    </div>
                </div>
                <div className="ml-[5%] h-full mt-14 w-[95%] p-5">
                    <ChatComponent Users={users}/>
                </div>
            </div>
        </div>
    )
}

export default Chat