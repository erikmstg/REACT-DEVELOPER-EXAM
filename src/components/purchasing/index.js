import React, { useEffect, useState } from "react";
import { Storage } from "@capacitor/storage";
import { navigate } from "gatsby";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Avatar from "@mui/material/Avatar";
import SearchIcon from "@mui/icons-material/Search";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Fab from "@mui/material/Fab";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import axios from "axios";
import logo from "../../images/logo.png";

import Sidebar from "../sidebar";
import Loader from "../loader";

const Index = ({ reloadList }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [session, setSession] = useState({});
  const [value, setValue] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [partnerInvoices, setPartnerInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const getInvoices = (user, isPartner) => {
    setLoading(true);
    axios
      .get(
        "https://us.izzibook.co.id/apilapakmobil/Purchase_invoice/offsetViewTransaction/" +
          isPartner +
          "0/0/0/20",
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      )
      .then((response) => {
        // console.log("response", response);
        if (response && response.data) {
          if (isPartner) {
            setPartnerInvoices(response.data);
          } else {
            setInvoices(response.data);
          }
        } else {
          if (isPartner) {
            setPartnerInvoices([]);
          } else {
            setInvoices([]);
          }
        }
        setLoading(false);
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
        if (error.response.status === 401) {
          setTimeout(function () {
            Storage.remove({ key: "user" }).then(
              (user) => {
                navigate("/login");
              },
              (error) => {
                console.log(error);
              }
            );
          }, 2000);
        }
      });
  };

  const handleTabChange = (e, newTabValue) => {
    setValue(newTabValue);
    if (newTabValue === 1 && partnerInvoices.length === 0) {
      getInvoices(session, 1);
    }
  };

  const hideSidebar = () => {
    setShowSidebar(false);
  };

  const handleProfile = (e) => {
    e.preventDefault();
    navigate("/profile");
  };

  useEffect(() => {
    if (reloadList) {
      setLoading(true);
      Storage.get({ key: "user" }).then(
        (user) => {
          if (user.value) {
            user = JSON.parse(user.value);
            setSession(user);
            getInvoices(user, 0);
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
          backgroundColor: "#132f61",
          color: "#fff",
          borderRadius: "0 0 15px 15px",
        }}
      >
        <Card
          sx={{
            backgroundColor: "#132f61",
            color: "#fff",
            padding: "10px",
            boxShadow: "none",
          }}
        >
          <CardHeader
            sx={{ color: "#fff" }}
            avatar={
              <Avatar
                src={
                  "https://us.izzibook.co.id/apilapakmobil/" +
                  session.employee_img
                }
                sx={{ cursor: "pointer" }}
                onClick={handleProfile}
              ></Avatar>
            }
            title={"Hi, " + session.employee_name}
            subheader={session.position_name}
          />
          <CardContent sx={{ paddingBottom: "0 !important" }}>
            <TextField
              fullWidth
              className="search"
              variant="outlined"
              size="small"
              placeholder="Cari Mobil..."
              sx={{
                backgroundColor: "#586c90",
                color: "#fff",
                borderRadius: "25px",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>
        <Tabs
          value={value}
          sx={{ margin: "0 30px" }}
          onChange={handleTabChange}
        >
          <Tab
            label="Pembelian Mobil"
            sx={{ color: "#fff", textTransform: "none" }}
          />
          <Tab
            label="Mobil Rekanan"
            sx={{ color: "#fff", textTransform: "none" }}
          />
        </Tabs>
      </Box>
      <br />
      <Box sx={{ display: value === 0 ? "block" : "none" }}>
        {invoices.map((item) => {
          const { DirImage } = item;
          return (
            <Card
              sx={{
                display: "flex",
                flexDirection: "row",
                boxShadow: "3",
                width: "95%",
                borderRadius: "0px 10px 10px 0px",
                marginBottom: "10px",
              }}
            >
              <CardMedia
                component="img"
                image={
                  DirImage
                    ? `https://us.izzibook.co.id/apilapakmobil/${DirImage}`
                    : logo
                }
                sx={{
                  width: "30%",
                  height: "180px",
                  objectFit: "contain",
                  backgroundColor: item.DirImage ? "#fff" : "#132f61",
                }}
              />
              <CardContent sx={{ width: "65%" }}>
                <Typography variant="body2" gutterBottom>
                  {item.InvoiceDate}
                  <br />
                  <strong>
                    {item.BrandName} {item.CarVariant} {item.CarType}
                  </strong>
                  <br />
                  {item.CarCode} {item.CarNo}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Beli | Rp. {item.PurchasePrice}</strong>
                  <br />
                  DP Pembelian | Rp. {item.DPNominal}
                  <br />
                </Typography>
                <br />
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: "25px",
                    fontWeight: "bold",
                    float: "right",
                  }}
                >
                  DP Pembelian
                </Button>
              </CardContent>
            </Card>
          );
        })}
        <br />
        <br />
        <br />
      </Box>
      <Box sx={{ display: value === 1 ? "block" : "none" }}>
        {partnerInvoices.map((item) => (
          <Card
            sx={{
              display: "flex",
              flexDirection: "row",
              boxShadow: "3",
              width: "95%",
              borderRadius: "0px 10px 10px 0px",
              marginBottom: "10px",
            }}
          >
            <CardMedia
              component="img"
              image={
                item.DirImage
                  ? "https://us.izzibook.co.id/apilapakmobil/" + item.DirImage
                  : logo
              }
              sx={{
                width: "30%",
                height: "180px",
                objectFit: "contain",
                backgroundColor: "#132f61",
              }}
            />
            <CardContent sx={{ width: "65%" }}>
              <Typography variant="body2" gutterBottom>
                {item.InvoiceDate}
                <br />
                <strong>
                  {item.BrandName} {item.CarVariant} {item.CarType}
                </strong>
                <br />
                {item.CarCode} {item.CarNo}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Beli | Rp. {item.PurchasePrice}</strong>
                <br />
                DP Pembelian | Rp. {item.DPNominal}
                <br />
              </Typography>
              <br />
              <Button
                size="small"
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: "25px",
                  fontWeight: "bold",
                  float: "right",
                }}
              >
                DP Pembelian
              </Button>
            </CardContent>
          </Card>
        ))}
        <br />
        <br />
        <br />
      </Box>
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: "25px", right: "25px" }}
      >
        <DirectionsCarIcon />
      </Fab>
      <Sidebar showSidebar={showSidebar} hideSidebar={() => hideSidebar()} />
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
    </Box>
  );
};

export default Index;
