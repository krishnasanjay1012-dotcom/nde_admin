// import React, { useState } from "react";
// import {
//   Box,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Popover,
//   Typography,
// } from "@mui/material";
// import { selectStyles } from "../../../styles/field";

// export default function ParentChildSelect() {
//   const menuData = [
//     {
//       id: 1,
//       name: "Fruits",
//       children: ["Apple", "Banana", "Orange"],
//     },
//     {
//       id: 2,
//       name: "Vegetables",
//       children: ["Carrot", "Tomato", "Potato"],
//     },
//     {
//       id: 3,
//       name: "Drinks",
//     },
//   ];

//   const [selectedValue, setSelectedValue] = useState("");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedParent, setSelectedParent] = useState(null);
  

//   const handleClose = () => {
//     setAnchorEl(null);
//     setSelectedParent(null);
//   };

//   const handleParentHover = (event, parent) => {
//     setSelectedParent(parent);
//     setAnchorEl(event.currentTarget);
//   };

//   const handleParentSelect = (parent) => {
//     setSelectedValue(parent.name);
//     setSelectedParent(parent); 
//     handleClose();
//   };

//   const handleChildSelect = (child) => {
//     setSelectedValue(child);
//     handleClose();
//   };

//   return (
//     <Box sx={{ minWidth: 240 }}>
//       <FormControl fullWidth>
//         <Select
//           value={selectedValue}
//           displayEmpty
//           onOpen={() => handleClose()}
//           renderValue={(selected) => (selected ? selected : "Select Type")}
//           MenuProps={{
//             onClose: handleClose,
//           }}
//           sx={selectStyles}
//         >
//           {menuData.map((parent) => (
//             <MenuItem
//               key={parent.id}
//               value={parent.name}
//               onMouseEnter={(e) => handleParentHover(e, parent)}
//               onClick={() => handleParentSelect(parent)}
//               sx={{
//                 cursor: "pointer",
//                 borderRadius: 1,
//                 "&:hover": {
//                   backgroundColor: "#6C75EF",
//                   color: "#FFF",
//                   borderRadius: 1,
//                 },
//                 backgroundColor:
//                   selectedParent?.id === parent.id ? "#6C75EF" : "transparent",
               
//               }}
//             >
//               <Typography sx={{ color: selectedParent?.id === parent.id ? "#FFF" : "inherit",}}>{parent.name}</Typography>
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {/* Child Popover */}
//       <Popover
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl) && Boolean(selectedParent?.children?.length)}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: "top",
//           horizontal: "right",
//         }}
//         transformOrigin={{
//           vertical: "top",
//           horizontal: "left",
//         }}
//         disableRestoreFocus
//       >
//         <Box sx={{ p: 1, minWidth: 150 }}>
//           {selectedParent?.children?.map((child, index) => (
//             <MenuItem
//               key={index}
//               onClick={() => handleChildSelect(child)}
//               sx={{
//                 "&:hover": {
//                   backgroundColor: "#9AA1F4",
//                   color: "#FFF",
//                   borderRadius: 2,
//                 },
//               }}
//             >
//               {child}
//             </MenuItem>
//           ))}
//         </Box>
//       </Popover>
//     </Box>
//   );
// }
