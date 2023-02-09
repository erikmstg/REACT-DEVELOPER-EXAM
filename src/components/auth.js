import React, { useEffect } from "react";
import { navigate } from "gatsby";
import { Storage } from "@capacitor/storage";

const Auth = () => {
  useEffect(() => {
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

  return <></>;
};

export const ProfileAuth = () => {
  useEffect(() => {
    Storage.get({ key: "user" }).then(
      (user) => {
        if (!user.value) {
          navigate("/login");
        } else {
          let value = JSON.parse(user.value);
          if (value.expired_at >= new Date().getTime()) {
            navigate("/login");
          } else {
            if (
              value.position_name === "Purchasing" ||
              value.position_name === "Salesman"
            ) {
              navigate("/profile");
            } else {
              navigate("/login");
            }
          }
        }
      },
      (error) => {
        navigate("/login");
      }
    );
  }, []);

  return <></>;
};

export default Auth;
