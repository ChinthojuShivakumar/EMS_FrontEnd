

export const getCurrentTime = (date) => {
    const now = new Date(date)
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour to 12-hour format
    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${ampm}`;
};

export const checkPermission = (permissionList, type, value) => {
    if (permissionList.length > 0) {
        return permissionList.some((perm) => perm[type] === value);
    } else {
        return "Not an array"
    }
};


export const getUserId = () => {
    const userId = JSON.parse(localStorage.getItem("user"))?._id
    if (userId) {
        return userId
    } else {
        return null
    }
}

export const getManagerId = () => {
    const manager_id = JSON.parse(localStorage.getItem("user"))?.managerId
    if (manager_id) {
        return manager_id
    } else {
        return null
    }
}
export const getUserRole = () => {
    const userId = JSON.parse(localStorage.getItem("user"))?.role.name
    if (userId) {
        return userId
    } else {
        return null
    }
}

export const getPermissionList = () => {
    const { menus, subMenus } = JSON.parse(localStorage.getItem("user")).role
    if (menus.length > 0 || subMenus.length > 0) {
        return { menusList: menus, submenuList: subMenus }
    } else {
        return { menusList: [], submenuList: [] }
    }
}
