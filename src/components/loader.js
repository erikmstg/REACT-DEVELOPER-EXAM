import React from "react";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";

const Loader = (props) => {
  return (
    <Modal open={props.open}>
      <CircularProgress
        sx={{
          position: "absolute",
          top: "calc(50% - 20px)",
          left: "calc(50% - 20px)",
        }}
      />
    </Modal>
  );
};

export default Loader;
