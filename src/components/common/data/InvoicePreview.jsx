import { useState } from "react";
import InvoiceTemplate from "./Invoice-Template";
import { Menu, MenuItem } from "@mui/material";

const InvoicePreview = ({ selectedInvoiceData }) => {
  const [showButton, setShowButton] = useState(false);
  const data = selectedInvoiceData?.data;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      {" "}
      <InvoiceTemplate
        data={data}
        showButton={showButton}
        setShowButton={setShowButton}
        handleMenuClick={handleMenuClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem onClick={handleClose}>Chaneg Template</MenuItem>
        <MenuItem onClick={handleClose}>Edit Template</MenuItem>
      </Menu>
    </>
  );
};

export default InvoicePreview;
