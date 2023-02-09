import React, { useEffect, useState } from "react";
import { Storage } from "@capacitor/storage";
import { navigate } from "gatsby";
import {
  Box,
  Card,
  CardActions,
  TextField,
  InputAdornment,
  Typography,
  Drawer,
  FormControl,
  IconButton,
  Input,
  InputLabel,
} from "@mui/material";

import {
  ArrowBackIosNew,
  Logout,
  Person,
  Phone,
  Lock,
  VerticalAlignTop,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const Index = ({ reloadList }) => {
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState({});

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // console.log("session:", session);

  const handleLogout = async () => {
    await Storage.remove({ key: "user" }).then(
      (user) => {
        navigate("/login");
      },
      (error) => {
        console.log(error);
      }
    );
    navigate("/"); //logout
  };

  const handleBack = () => {
    if (!session.position_name) return navigate("/login");
    if (session && session.position_name === "Salesman") navigate("/sales");
    if (session && session.position_name === "Purchasing")
      navigate("/purchasing");
  };

  useEffect(() => {
    if (reloadList) {
      setLoading(true);
      Storage.get({ key: "user" }).then(
        (user) => {
          if (user.value) {
            user = JSON.parse(user.value);
            setSession(user);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, [reloadList]);

  return (
    <Box className="index">
      <Box
        sx={{
          backgroundColor: "#586c90",
          color: "#fff",
        }}
      >
        <Card
          sx={{
            backgroundColor: "#132f61",
            color: "#fff",
            padding: "10px",
            boxShadow: "none",
            borderRadius: "0 0 1rem 1rem",
          }}
        >
          <CardActions
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleBack}
            >
              <ArrowBackIosNew fontSize="small" />
              <Typography variant="subtitle1" fontWeight="600" ml=".5rem">
                User Profile
              </Typography>
            </Box>
            <Logout
              fontSize="small"
              sx={{
                cursor: "pointer",
              }}
              onClick={handleLogout}
            />
          </CardActions>
        </Card>
        <Box padding="2.5rem" display="flex" alignItems="center">
          <img
            width="90px"
            height="90px"
            style={{ objectFit: "cover", borderRadius: "50%" }}
            src={
              "https://us.izzibook.co.id/apilapakmobil/" + session.employee_img
            }
          />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="start"
            mx="2rem"
            color="black"
          >
            <Box display="flex" flexDirection="row" alignItems="center">
              <Person fontSize="small" />
              <Typography fontWeight="600" mx=".5rem">
                {session.employee_name}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Phone fontSize="small" />
              <Typography fontWeight="600" mx=".5rem">
                087123456789
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        component="form"
        noValidate
        sx={{
          "& .MuiTextField-root": { mx: 3, my: 1.2, width: "screen" },
        }}
        display="flex"
        flexDirection="column"
        m="1rem"
      >
        <TextField
          disabled
          label="Name"
          value={session.employee_name}
          variant="standard"
        />
        <TextField
          disabled
          label="Jabatan"
          value={session.position_name}
          variant="standard"
        />
        <TextField
          disabled
          label="Nomor Handphone"
          defaultValue="087123456789"
          variant="standard"
        />
        <TextField
          disabled
          label="Alamat"
          defaultValue=" "
          variant="standard"
        />
        <TextField
          disabled
          label="Password"
          defaultValue="123"
          variant="standard"
          type="password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Lock fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          disabled
          label="Kode"
          value={session.employee_code}
          variant="standard"
        />
      </Box>
      <Box
        height="20vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="start"
      >
        <VerticalAlignTop
          fontSize="small"
          color="action"
          aria-label="drawer for change password"
          onClick={() => setDrawerOpen(true)}
        />
      </Box>
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box p={2} height="60vh" textAlign="center" role="presentation">
          <Box display="flex" flexDirection="column" textAlign="start" m={1}>
            <Typography color="#3EB1B1" variant="subtitle2" fontWeight="600">
              Ganti Password
            </Typography>
            <Box
              component="form"
              noValidate
              display="flex"
              flexDirection="column"
            >
              <FormControl
                sx={{ mx: 0.5, my: 0.8, width: "screen" }}
                variant="standard"
              >
                <InputLabel htmlFor="old-adornment-password">
                  Password Lama
                </InputLabel>
                <Input
                  id="old-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl
                sx={{ mx: 0.5, my: 0.8, width: "screen" }}
                variant="standard"
              >
                <InputLabel htmlFor="new-adornment-password">
                  Password Baru
                </InputLabel>
                <Input
                  id="new-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl
                sx={{ mx: 0.5, my: 0.8, width: "screen" }}
                variant="standard"
              >
                <InputLabel htmlFor="newMatched-adornment-password">
                  Konfirmasi Password Baru
                </InputLabel>
                <Input
                  id="newMatched-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Box>
            <IconButton
              sx={{
                width: "screen",
                backgroundColor: "#EF524B",
                borderRadius: "50px",
                color: "#fff",
                mt: "1rem",
                mx: ".2rem",
                "&: hover": {
                  backgroundColor: "#A73934",
                },
              }}
              onClick={() => console.log("submit testing")}
            >
              <Typography variant="subtitle2" fontWeight="600">
                SUBMIT
              </Typography>
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Index;
