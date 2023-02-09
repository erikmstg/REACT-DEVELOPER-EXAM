import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeProvider } from "@mui/material/styles";
import "/src/styles/global.css";
import { theme } from "../components/theme";
import Loader from "../components/loader";
import logo from "../images/logo.png";
import { navigate } from "gatsby";
import { Storage } from "@capacitor/storage";
import axios from "axios";

const LoginPage = () => {
  const [fullHeight, setFullHeight] = useState("inherit");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const formStyle = {
    width: "80%",
  };

  const logoStyle = {
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    maxWidth: "100%",
    maxHeight: "80%",
    margin: "auto",
    width: "149px",
  };

  useEffect(() => {
    setFullHeight(window.outerHeight);
    Storage.get({ key: "user" }).then(
      (user) => {
        if (!user.value) {
          navigate("/login");
        } else {
          let value = JSON.parse(user.value);
          if (value.expired_at >= new Date().getTime()) {
            navigate("/login");
          } else {
            if (value.position_name === "Purchasing") {
              navigate("/purchasing");
            }
            if (value.position_name === "Salesman") {
              navigate("/sales");
            }
          }
        }
      },
      (error) => {
        navigate("/login");
      }
    );
  }, []);

  const handleLogin = (e) => {
    setLoading(true);
    axios
      .post(
        "https://us.izzibook.co.id/apilapakmobil/token",
        {},
        {
          auth: {
            username: username,
            password: password,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(function (response) {
        console.log(response);
        if (response && response.data) {
          Storage.set({
            key: "user",
            value: JSON.stringify(response.data),
          }).then(
            (user) => {
              console.log(user);
              navigate("/");
            },
            (error) => {
              console.log(error);
            }
          );
        } else {
          setLoading(false);
          let message =
            "TERJADI KESALAHAN PADA SISTEM. MOHON COBA BEBERAPA SAAT LAGI";
          setAlert(true);
          setAlertMessage(message);
          setTimeout(function () {
            setAlert(false);
          }, 5000);
        }
      })
      .catch(function (error) {
        console.log(error);
        let message =
          "TERJADI KESALAHAN PADA SISTEM. MOHON COBA BEBERAPA SAAT LAGI";
        if (error && error.response && error.response.data) {
          console.log(error.response.data);
          if (error.response.data.message) {
            message = error.response.data.message;
          }
        }
        setLoading(false);
        setAlert(true);
        setAlertMessage(message);
        setTimeout(function () {
          setAlert(false);
        }, 5000);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: "#132f61",
          height: fullHeight / 2 + "px",
          position: "absolute",
          zIndex: "-1",
          width: "100%",
        }}
      ></Box>
      <Box sx={{ height: fullHeight / 3 + "px", position: "relative" }}>
        <img src={logo} style={logoStyle} alt="" />
      </Box>
      <Stack
        sx={{
          alignItems: "center",
          width: "90%",
          margin: "auto",
          borderRadius: "25px",
          boxShadow: "0 1px 5px #999",
          backgroundColor: "#fff",
          py: "35px",
        }}
      >
        <Typography
          variant="h1"
          gutterBottom
          sx={{ fontSize: "30px", fontWeight: "bold" }}
        >
          Halo.
        </Typography>
        <Typography
          variant="h2"
          gutterBottom
          sx={{ fontSize: "16px", color: "#808284" }}
        >
          Masuk ke dalam akun Anda
        </Typography>
        <br />
        <form
          onSubmit={handleLogin}
          action="javascript:void(0)"
          style={formStyle}
        >
          <Stack>
            <InputLabel>Username</InputLabel>
            <TextField
              fullWidth
              required
              variant="standard"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <InputLabel>Password</InputLabel>
            <TextField
              required
              fullWidth
              type={showPassword ? "text" : "password"}
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <br />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              color="primary"
              sx={{ borderRadius: "25px", fontWeight: "bold" }}
            >
              Login
            </Button>
          </Stack>
        </form>
      </Stack>
      <Loader open={loading} />
      <Snackbar
        open={alert}
        message={alertMessage}
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={() => setAlert(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </ThemeProvider>
  );
};

export default LoginPage;
