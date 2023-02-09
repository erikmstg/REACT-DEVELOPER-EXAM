import React, { Fragment, useEffect, useState } from "react";
import Auth from "../components/auth";
import Purchasing from "../components/purchasing/index";
import { App } from "@capacitor/app";
import { Dialog } from "@capacitor/dialog";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../components/theme";
import "/src/styles/global.css";

const PurchasingPage = () => {
  const [activeComponent, setActiveComponent] = useState("purchasing");
  const [reloadList, setReloadList] = useState(false);

  useEffect(() => {
    App.addListener("backButton", (data) => {
      Dialog.confirm({
        title: "Confirm",
        message: "Apakah anda ingin keluar?",
      }).then((response) => {
        if (response && response.value) {
          App.exitApp();
        }
      });
    });
    setReloadList(true);
  }, []);

  return (
    <Fragment>
      <Auth />
      <ThemeProvider theme={theme}>
        {activeComponent === "purchasing" && (
          <Purchasing reloadList={reloadList} />
        )}
      </ThemeProvider>
    </Fragment>
  );
};

export default PurchasingPage;
