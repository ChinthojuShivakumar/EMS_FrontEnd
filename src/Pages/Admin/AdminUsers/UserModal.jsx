import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../Components/Navbar/Header";
import SideMenu from "../../../Components/Navbar/SideMenu";
import { Autocomplete, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  fetchApiV2,
  postApiV2,
  putApiV2,
} from "../../../Components/Constant/Network.V2";
import { getUserId } from "../../../Utils/Functions";

const UserModal = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const adminId = getUserId();
  const [menuList, setMenuList] = useState([]);
  const [submenuList, setSubMenuList] = useState([]);
  const initialState = {
    name: "",
    menus: [],
    subMenus: [],
  };
  const [inputs, setInputs] = useState(initialState);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e, nV, type) => {
    e.preventDefault();

    if (type === "name") {
      setInputs({ ...inputs, name: e.target.value.toUpperCase() });
    }

    if (type === "menu") {
      if (!inputs.menus.includes(nV)) {
        const selectedMenus = nV || [];
        const selectedMenuIds = selectedMenus.map((menu) => menu._id);
        setInputs((prevInputs) => ({
          ...prevInputs,
          menus: nV ? nV.map((item) => item) : [],
          subMenus: prevInputs.subMenus.filter((submenu) =>
            selectedMenuIds.includes(submenu.menuId)
          ),
        }));
        // fetchSubMenus(nV?._id)
        return;
      }
    }
    if (type === "submenu") {
      if (!inputs.subMenus.includes(nV)) {
        setInputs((prevInputs) => ({
          ...prevInputs,
          subMenus: nV ? nV.map((item) => item) : [],
        }));

        return;
      }
    }
  };

  // console.log(inputs);

  const fetchMenus = useCallback(async () => {
    try {
      const response = await fetchApiV2(`/menu-permission?adminId=${adminId}`);
      if (response.status === 200) {
        setMenuList(response.data.menuList);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }, [adminId]);

  const fetchSubMenus = useCallback(async () => {
    try {
      const response = await fetchApiV2(
        `/submenu-permission?adminId=${adminId}`
      );
      if (response.status === 200) {
        setSubMenuList(response.data.menuList);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }, [adminId]);

  useEffect(() => {
    fetchMenus();
    fetchSubMenus();
  }, [fetchMenus, fetchSubMenus]);

  const [filteredSubMenuList, setFilteredSubMenuList] = useState([]);

  const filterSubmenu = useCallback(() => {
    const menuIds = inputs.menus.map((menu) => menu._id);
    const array = submenuList
      .filter((submenu) => menuIds.includes(submenu.menuId._id))
      .map((submenu) => ({
        _id: submenu._id,
        label: `${submenu.title}(${submenu.menuId.title})`,
        value: submenu._id,
        menuId: submenu.menuId._id,
      }));
    setFilteredSubMenuList(array);
  }, [inputs.menus, submenuList]);

  useEffect(() => {
    filterSubmenu();
  }, [filterSubmenu]);

  const postAdminRole = async () => {
    try {
      const response = await postApiV2(
        `/admin-role/create?adminId=${adminId}`,
        inputs
      );
      if (response.status === 201) {
        navigate("/admin/roles");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const updateAdminRole = async () => {
    try {
      const response = await putApiV2(
        `/admin-role/update/${inputs._id}?adminId=${adminId}`,
        inputs
      );
      if (response.status === 202) {
        navigate("/admin/roles");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (location.state) {
      setEditMode(true);
      const { menus, subMenus, name } = location.state;
      // console.log(menus, subMenus);

      setInputs((prevInputs) => ({
        ...prevInputs,
        name: name || "",
        menus: menus || [],
        subMenus: subMenus || [],
        _id: location.state?._id || "",
      }));

      // filterSubmenu()
      // const c = menuList.filter(item => inputs.menus.some(inputId => inputId._id === item._id))
      // console.log(c);
    } else {
      setEditMode(false);
    }
  }, [location.state]);

  // const f = filteredSubMenuList.filter(item => inputs.subMenus.some((it => it._id === item._id)))
  // console.log(f);

  return (
    <div>
      <Header />
      <div className="w-full font-roboto font-medium">
        <div className="w-[15%] fixed top-20">
          <SideMenu />
        </div>
        <div className="ml-[15%] px-5 mt-24 w-[85%] ">
          <div className="w-full">
            <div>
              <h1 className="capitalize text-2xl">{path} Role</h1>
            </div>
            <div className="w-full mt-5 flex flex-col gap-5">
              <TextField
                label="Role Name"
                name="name"
                value={inputs.name}
                fullWidth
                sx={{ width: "100%" }}
                onChange={(e) => handleChange(e, null, "name")}
              />
              <Autocomplete
                disablePortal
                options={menuList || []}
                getOptionLabel={(option) => option.title}
                fullWidth
                sx={{ width: "100%" }}
                renderInput={(params) => <TextField {...params} label="Menu" />}
                multiple
                value={menuList.filter((item) =>
                  inputs.menus.some((it) => it._id === item._id)
                )}
                onChange={(e, nV) => handleChange(e, nV, "menu")}
              />
              <Autocomplete
                disablePortal
                options={filteredSubMenuList}
                getOptionLabel={(option) => option.label}
                fullWidth
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="SubMenu" />
                )}
                multiple
                value={filteredSubMenuList.filter((item) =>
                  inputs.subMenus.some((it) => it._id === item._id)
                )}
                onChange={(e, nV) => handleChange(e, nV, "submenu")}
              />
            </div>
            <button
              className="w-52 text-white bg-green-700 py-3 capitalize mt-10"
              onClick={editMode ? updateAdminRole : postAdminRole}
            >
              {path}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
