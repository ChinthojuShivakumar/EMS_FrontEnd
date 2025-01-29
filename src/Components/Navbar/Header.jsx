import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Modal from "../Constant/Modal";
import { useCallback, useEffect, useState } from "react";
import { fetchApiV1, putApiV1 } from "../Constant/Network";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../Utils/Functions";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user_id = JSON.parse(localStorage.getItem("user"))?._id;
  const [notificationList, setNotificationList] = useState([]);
  const role = JSON.parse(localStorage.getItem("role"));
  const userName = JSON.parse(localStorage.getItem("user")).fullName;
  const navigate = useNavigate();
  const style = {
    width: "500px",
    height: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "50px",
    position: "absolute",
    top: "80px",
    right: "2%",
  };
  const userRole = getUserRole();
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetchApiV1(`/user/notification/${user_id}`);
      if (response.status === 200) {
        setNotificationList(response.data.notification);
      } else {
        setNotificationList([]);
        throw new Error(response);
      }
    } catch (error) {
      throw new Error(error);
    }
  }, [user_id]);
  const readNotification = async (_id) => {
    const payload = {
      userId: user_id,
      notificationId: _id,
      read: true,
    };
    try {
      const response = await putApiV1(`/user/notification/read`, payload);
      if (response.status === 202) {
        if (
          role == "admin" &&
          response?.data?.findUserNotification?.notificationType
        ) {
          navigate(
            `/admin/${response?.data?.findUserNotification?.notificationType}`
          );
        } else {
          navigate(
            `/user/${response?.data?.findUserNotification?.notificationType}`
          );
        }
        // setNotificationList(response.data.notification)
      } else {
        throw new Error(response);
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    fetchNotifications();
    // Set up the interval to call the function every 5 minutes
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 300000); // 5 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);
  return (
    <div className="w-full flex justify-between items-center py-6 px-10 fixed top-0 bg-green-600 text-white font-roboto">
      <div className="w-auto flex gap-5 justify-center items-center">
        <h1 className="text-2xl font-semibold">
          <i>EMS</i>
        </h1>
        <p>
          {userName}
          {userRole !== "USER" && ` - ${role}`}
        </p>
      </div>
      <div className="w-auto flex gap-5">
        <div className="relative">
          <p className="cursor-pointer" onClick={() => setIsOpen(true)}>
            <NotificationsIcon />
          </p>
          <p className="rounded-full bg-red-500 text-center absolute -top-2 -right-1 w-4 h-4 text-xs">
            {notificationList.filter((not) => not.read === false).length}
          </p>
        </div>
        <p className="cursor-pointer" onClick={() => navigate("/profile")}>
          <AccountCircleIcon />
        </p>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        style={style}
        enableMouseEvents={false}
      >
        <div className="font-roboto font-semibold">
          <div className="text-2xl">
            <h1>Notifications</h1>
          </div>
          <div className="mt-5 overflow-y-scroll h-96">
            {notificationList?.map((notification) => {
              return (
                <div
                  className={`shadow-sm  ${
                    notification?.read == false
                      ? "bg-green-100 px-5 py-3 cursor-pointer hover:bg-green-200"
                      : " bg-gray-300 px-5 py-3 cursor-auto"
                  }`}
                  key={notification?._id}
                  onClick={() => readNotification(notification?._id)}
                >
                  {/* <div className='w-full flex justify-between items-center'>
                      <h1>{notification?.userId?.fullName}</h1>
                      <p className='font-normal text-sm'>{notification.read ? "read" : "unread"}</p>
                    </div> */}
                  <p className="font-normal">{notification?.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
