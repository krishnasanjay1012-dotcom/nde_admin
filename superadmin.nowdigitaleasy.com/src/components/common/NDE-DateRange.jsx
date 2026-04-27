// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import Button from "@mui/material/Button";
// import Slide from "@mui/material/Slide";

// import React from "react";
// import { DateRange } from "react-date-range";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} timeout={{ enter: 300, exit: 300 }} />;
// });
// const CommonDateRange = ({
//   open,
//   onClose,
//   onApply,
//   tempRange,
//   onChange,
//   title = "Select Date Range",
//   cancelText = "Cancel",
//   applyText = "Apply",
//   disableAnimation = false,
// }) => {
//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth TransitionComponent={Transition}
//       sx={{
//         "& .MuiPaper-root": {
//           animation: disableAnimation
//             ? "none"
//             : open
//               ? "bounceIn 0.7s ease-out"
//               : "none",
//           "@keyframes bounceIn": {
//             "0%": { transform: "translateY(100%)" },
//             "60%": { transform: "translateY(-15px)" },
//             "80%": { transform: "translateY(10px)" },
//             "100%": { transform: "translateY(0)" },
//           },
//         },
//       }}
//     >
//       <DialogTitle>{title}</DialogTitle>
//       <DialogContent sx={{ml:4}}>
//         <DateRange
//           editableDateInputs
//           onChange={onChange}
//           moveRangeOnFirstSelection={false}
//           ranges={[tempRange]}
//           direction="vertical"
//         />
//       </DialogContent>
//       <DialogActions mt={2} display="flex" justifyContent="flex-end" gap={1}>
//         <Button variant="outlined" onClick={onClose}>
//           {cancelText}
//         </Button>
//         <Button variant="contained" color="primary" onClick={onApply}>
//           {applyText}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CommonDateRange;


import React, { useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Box, Button, Paper, Typography } from "@mui/material";

const CommonDateRange = ({
  open,
  onClose,
  onApply,
  tempRange,
  onChange,
  title = "Select Date Range",
  cancelText = "Cancel",
  applyText = "Apply",
}) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Paper
      ref={wrapperRef}
      elevation={4}
      sx={{
        position: "absolute",
        top: "100px",
        right: "0",
        zIndex: 999,
        p: 2,
        mr: 10,
      }}
    >
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>

      <DateRange
        editableDateInputs
        onChange={onChange}
        moveRangeOnFirstSelection={false}
        ranges={[tempRange]}
        direction="vertical"
      />

      <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
        <Button variant="outlined" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant="contained" color="primary" onClick={onApply}>
          {applyText}
        </Button>
      </Box>
    </Paper>
  );
};

export default CommonDateRange;
