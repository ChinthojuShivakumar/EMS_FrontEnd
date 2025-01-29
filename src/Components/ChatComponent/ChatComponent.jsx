import PropTypes from "prop-types"


const ChatComponent = ({ Users }) => {
    return (
        <div className="w-full h-[90vh] grid grid-cols-10 font-roboto">
            <div className="col-span-2 bg-red-500 w-full px-3">
                <div>
                    <div className="text-2xl py-5 font-semibold">
                        <h1>Chats</h1>
                    </div>
                    <div className="w-full flex gap-2 flex-col">
                        {
                            Users?.map((user) => {
                                return <div key={user["userId"]} className="w-full flex justify-start items-center gap-5">
                                    <img src="https://www.wallofcelebrities.com/celebrity/john-doe/pictures/xxlarge/john-doe_862803.jpg" alt="user" className="w-16 h-16 rounded-full" />
                                    <div>
                                        <p >{user["username"]}</p>
                                        <p>{user["status"]}</p>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="bg-pink-300 w-full col-span-8 relative">
                <div className="">
                    <div className="bg-violet-400 p-2 px-6">
                        <p>User Name</p>
                        <p>Status</p>
                    </div>
                    <div className="w-full flex flex-col p-2">
                        <div className="w-fit ml-auto"> {/* Apply ml-auto to align to the right */}
                            <p>User-1</p>
                            <p>Hello</p>
                        </div>
                        <div className="w-fit"> {/* This remains left aligned */}
                            <p>User-2</p>
                            <p>Hii</p>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center px-5 bg-yellow-500 absolute bottom-0 py-3 font-semibold">
                    <div className="w-[6%]">
                        +
                    </div>
                    <div className="w-[84%]">
                        <input
                            type="text"
                            name=""
                            id=""
                            className="w-full p-3 px-5 rounded-full"
                            placeholder="Type Message"
                        />
                    </div>
                    <div className="w-32">
                        <button type="submit" className="w-32 py-3">send message</button>
                    </div>
                </div>
            </div>


        </div>
    )
}

ChatComponent.propTypes = {
    Users: PropTypes.array.isRequired
}

export default ChatComponent