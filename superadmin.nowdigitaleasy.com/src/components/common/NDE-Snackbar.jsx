import { ToastContainer,Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import  "../../styles/CustomToastContainer.css";

const CustomCloseButton = ({ closeToast }) => (
  <IconButton
    size="small"
    onClick={closeToast}
    sx={{
      "&:hover": { color: "#000" },
      position: "absolute",
      right:10,
    }}
  >
    <CloseRoundedIcon fontSize="small" />
  </IconButton>
);

const CustomToastContainer = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar
      closeOnClick
      pauseOnHover
      draggable
      closeButton={CustomCloseButton}
      transition={Slide}
      newestOnTop
      theme="light"
      style={{
        top: 20,
        right: 8,
        display: "flex",
        flexDirection: "column-reverse",
        alignItems: "flex-end",
        gap: 8,
      }}
      toastClassName="custom-toast"
    />
  );
};

export default CustomToastContainer;



// import React from "react";
// import { ToastContainer, Slide } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { IconButton, Box } from "@mui/material";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
// import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
// import "../../styles/CustomToastContainer.css";

// const CustomCloseButton = ({ closeToast }) => (
//   <IconButton
//     size="small"
//     onClick={closeToast}
//     sx={{
//       "&:hover": { color: "#000" },
//       position: "absolute",
//       right: 8,
//       top: 14,
//     }}
//   >
//     <CloseRoundedIcon fontSize="small" />
//   </IconButton>
// );

// const CustomIcon = ({ type }) => {
//   const iconStyle = {
//     width: 32,
//     height: 32,
//     borderRadius: "6px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     flexShrink: 0,
    
//   };

//   if (type === "success") {
//     return (
//       <Box sx={{ ...iconStyle, backgroundColor: "success.main" }}>
//         <CheckRoundedIcon sx={{ color: "#FFF", fontSize: 20 }} />
//       </Box>
//     );
//   }
//   if (type === "error") {
//     return (
//       <Box sx={{ ...iconStyle, backgroundColor: "error.main" }}>
//         <WarningAmberRoundedIcon sx={{ color: "#FFF", fontSize: 20,mb:0.2 }} />
//       </Box>
//     );
//   }
//   return null;
// };

// const CustomToastContainer = () => {
//   return (
//     <ToastContainer
//       position="top-center"
//       autoClose={2000}
//       hideProgressBar
//       closeOnClick
//       pauseOnHover
//       draggable
//       closeButton={CustomCloseButton}
//       transition={Slide}
//       newestOnTop
//       theme="light"
//       icon={(props) => <CustomIcon type={props?.type} />}
//       style={{
//         top: 24,
//         right: 1,
//         display: "flex",
//         flexDirection: "column-reverse",
//         alignItems: "flex-end",
//         gap: 8,
//       }}
//       toastClassName="custom-toast"
//     />
//   );
// };

// export default CustomToastContainer;
