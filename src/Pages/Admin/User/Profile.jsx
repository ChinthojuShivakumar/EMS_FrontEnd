import React, { useEffect, useState } from "react";
import Header from "../../../Components/Navbar/Header";
import SideMenu from "../../../Components/Navbar/SideMenu";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { putApiV1 } from "../../../Components/Constant/Network";
import { USER } from "../../../Components/Constant/EndPoints";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const initialState = {
    fullName: "",
    email: "",
    jobTitle: "",
    departMentId: "",
    gender: "",
    companyEmail: "",
    employeeId: "",
    departMentName: "",
    jobTitleName: "",
  };
  const [inputs, setInputs] = useState(initialState);
  const handleChange = (e, type) => {
    e.preventDefault();

    if (type === "fullName") {
      setInputs({ ...inputs, fullName: e.target.value });
      return;
    }
    if (type === "email") {
      setInputs({ ...inputs, email: e.target.value });
      return;
    }
    if (type === "gender") {
      setInputs({ ...inputs, gender: e.target.value });
      return;
    }
  };
  console.log(inputs);

  const updateUser = async () => {
    try {
      const response = await putApiV1(`${USER}/${inputs?._id}`, inputs);
      if (response.status == 202) {
        const payload = {
          ...user,
          gender: inputs.gender,
        };
        localStorage.setItem("user", JSON.stringify(payload));
        clearInputs()
        window.location.reload();
      }
    } catch (error) {
      throw new Error(error);
    }
  };

    const clearInputs = () => {
      setInputs(initialState);
    };

  // Set user information when the component mounts
  useEffect(() => {
    if (user) {
      setInputs({
        companyEmail: user.companyEmail,
        departMentId: user.departMentId._id,
        departMentName: user.departMentId.title,
        email: user.email,
        employeeId: user.employeeId,
        fullName: user.fullName,
        gender: user.gender,
        jobTitle: user.jobTitle._id,
        jobTitleName: user.jobTitle.title,
        _id: user._id,
      });
    }
  }, []);
  return (
    <div>
      <Header />
      <div className="w-full font-roboto font-medium">
        <div className="w-[15%] fixed top-20">
          <SideMenu />
        </div>
        <div className="ml-[15%] px-5 mt-32 w-[85%] ">
          <div className="w-full grid grid-cols-2 gap-5 ">
            <TextField
              label="Full Name"
              value={inputs.fullName}
              onChange={(e) => handleChange(e, "fullName")}
            />
            <TextField
              label="Email"
              type="email"
              value={inputs.email}
              onChange={(e) => handleChange(e, "email")}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                //   value={inputs.priorityLevel}
                value={inputs?.gender || ""}
                label="Gender"
                onChange={(e) => handleChange(e, "gender")}
              >
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"Others"}>Others</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Employee Id"
              disabled
              value={inputs.employeeId}
              onChange={(e) => handleChange(e, "employeeId")}
            />
            <TextField
              label="Company Email"
              disabled
              value={inputs.companyEmail}
              onChange={(e) => handleChange(e, "companyEmail")}
            />
            <TextField
              label="Department Id"
              disabled
              value={inputs.departMentName}
              onChange={(e) => handleChange(e, "departMentId")}
            />
            <TextField
              label="Job Title"
              disabled
              value={inputs.jobTitleName}
              onChange={(e) => handleChange(e, "jobTitle")}
            />
          </div>
          <div className="mt-5">
            <Button variant="contained" className="" onClick={updateUser}>
              Update Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
