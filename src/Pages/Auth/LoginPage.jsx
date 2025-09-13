import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { postApiV1 } from "../../Components/Constant/Network";
import { VERIFY_EMAIL, VERIFY_OTP } from "../../Components/Constant/EndPoints";
import { getCurrentTime } from "../../Utils/Functions";
// import { USER } from "../../Components/Constant/Constant"
import { useNavigate } from "react-router-dom";

const MUI_INPUT_STYLE = {
  "& .MuiInputLabel-root": {
    color: "white", // Label color
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white", // Focused label color
  },
  "& .MuiInput-underline:before": {
    borderBottomColor: "white", // Default underline color
  },
  "& .MuiInput-underline:hover:before": {
    borderBottomColor: "white", // Hover underline color
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "white", // Focused underline color
  },
  "& .MuiInputBase-root": {
    color: "white", // Input text color
  },
};

const LoginPage = () => {
  const initialState = {
    email: "",
    otp: "",
    loginTime: "",
  };
  const [inputs, setInputs] = useState(initialState);
  const [otpState, setOtpState] = useState(false);
  const navigate = useNavigate();
  const handleChangeInputs = (e, type) => {
    e.preventDefault();
    if (type === "email") {
      setInputs({ ...inputs, email: e.target.value });
      return;
    }
    if (type === "otp") {
      setInputs({ ...inputs, otp: e.target.value });
      return;
    }
  };
  const verifyEmail = async () => {
    const payload = {
      email: inputs.email,
    };
    try {
      const response = await postApiV1(VERIFY_EMAIL, payload);
      if (response.status === 200) {
        setOtpState(true);
      } else {
        setOtpState(false);
        throw new Error(response);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const verifyOTP = async () => {
    try {
      const currentTime = new Date().toISOString();
      setInputs({ ...inputs, loginTime: currentTime });
      const response = await postApiV1(VERIFY_OTP, {
        ...inputs,
        loginTime: currentTime,
      });
      if (response.status === 200) {
        setOtpState(true);
        localStorage.setItem("token", JSON.stringify(response.data.token));
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem(
          "role",
          JSON.stringify(response.data.user.role.name)
        );
        // if (USER === response.data.user.role) {
        //     const currentTime = getCurrentTime()
        //     localStorage.setItem("loginTime", JSON.stringify(currentTime))
        //     navigate("/user")
        //     window.location.reload()
        //     return
        // }
        // const currentTime = new Date().toISOString();

        localStorage.setItem("loginTime", JSON.stringify(response.data.loginData));
        // const permissions = {}

        navigate("/");
        window.location.reload();
        return
      } else {
        setOtpState(false);
        throw new Error(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen text-white font-roboto">
      <Box className="w-[50%] h-[70%] bg-gray-800 flex flex-col gap-5 justify-center items-center rounded-md shadow-md">
        <Box className="w-[70%] flex justify-center items-start flex-col gap-10">
          <h1 className="text-3xl font-semibold">Employee Management System</h1>
          <Typography>Login Page</Typography>
          {!otpState && (
            <TextField
              label="Email"
              onChange={(e) => handleChangeInputs(e, "email")}
              variant="standard"
              fullWidth
              sx={MUI_INPUT_STYLE}
            />
          )}
          {otpState && (
            <TextField
              label="OTP"
              onChange={(e) => handleChangeInputs(e, "otp")}
              variant="standard"
              fullWidth
              type="password"
              sx={MUI_INPUT_STYLE}
            />
          )}
          {!otpState && (
            <Button
              variant="contained"
              sx={{ width: 200 }}
              onClick={verifyEmail}
            >
              Verify Email
            </Button>
          )}
          {otpState && (
            <Button variant="contained" sx={{ width: 200 }} onClick={verifyOTP}>
              Login
            </Button>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default LoginPage;
