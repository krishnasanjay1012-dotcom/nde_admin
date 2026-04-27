// import React, { useState } from "react";
// import {
//   Modal,
//   Box,
//   IconButton,
//   Typography,
//   Divider,
//   Button,
//   TableContainer,
//   Table,
//   TableCell,
//   TableRow,
//   TableHead,
//   TableBody,
//   styled,
//   Stack,
//   Skeleton,
//   CircularProgress,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import CommonDeleteModal from "../../../common/NDE-DeleteModal";
// import { useDeleteTDS } from "../../../../hooks/sales/invoice-hooks";

// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "45dvw",
//   height: "98dvh",
//   bgcolor: "#fff",
//   boxShadow: 24,
// };

// const StyledTableCell = styled(TableCell)(() => ({
//   whiteSpace: "normal",
//   wordBreak: "break-word",
// }));

// const ManageTDS = ({
//   open,
//   onClose,
//   handleEdit,
//   handleCreateNewTds,
//   isTDS,
//   taxType,
//   taxData,
//   taxLoading,
// }) => {
//   console.log(taxData, "tdata");
//   const [hoverId, setHoverId] = useState(null);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   const deleteMutation = useDeleteTDS();

//   const handleDelete = (row) => {
//     setDeleteTarget(row);
//     setDeleteModalOpen(true);
//   };

//   const confirmDelete = () => {
//     if (deleteTarget) {
//       deleteMutation.mutate(deleteTarget._id, {
//         onSuccess: () => {
//           setDeleteModalOpen(false);
//           setDeleteTarget(null);
//         },
//       });
//     }
//   };

//   return (
//     <>
//       <Modal open={open} onClose={onClose}>
//         <Box sx={modalStyle}>
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             px={2}
//             py={1}
//           >
//             <Typography fontSize={18} fontWeight={400}>
//               {`Manage ${taxType}`}
//             </Typography>

//             <IconButton onClick={onClose}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
//           <Divider />
//           <Box px={2} py={3} display={"flex"} justifyContent={"space-between"}>
//             <Typography fontSize={18}>{`${taxType} Taxes`}</Typography>
//             <Button
//               variant="contained"
//               size="small"
//               startIcon={<AddIcon style={{ color: "#fff" }} />}
//               onClick={handleCreateNewTds}
//             >
//               {`New ${taxType}`}
//             </Button>
//           </Box>

//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow
//                   sx={{ borderTop: "1px solid #EBEBEF", background: "#f3f3f3" }}
//                 >
//                   <TableCell width="25%">Tax Name</TableCell>
//                   <TableCell width="15%">Rate (%)</TableCell>
//                   <TableCell width="25%">Section</TableCell>
//                   <TableCell width="20%">Status</TableCell>
//                   <TableCell width="15%"></TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {taxLoading && (
//                   <TableRow>
//                     <TableCell colSpan={5} align="center">
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                           height: 120,
//                         }}
//                       >
//                         <CircularProgress />
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 )}

//                 {!taxLoading &&
//                   taxData?.length > 0 &&
//                   taxData.map((tax) => (
//                     <TableRow
//                       key={tax._id}
//                       onMouseEnter={() => setHoverId(tax._id)}
//                       onMouseLeave={() => setHoverId(null)}
//                       sx={{
//                         cursor: "pointer",
//                         "&:hover": { backgroundColor: "#fcfcfc" },
//                       }}
//                     >
//                       <StyledTableCell>{tax.taxName}</StyledTableCell>

//                       <StyledTableCell>{tax.rate}</StyledTableCell>

//                       <StyledTableCell>
//                         {tax.sectionId
//                           ? `${tax.sectionId.sectionCode} - ${tax.sectionId.description}`
//                           : "-"}
//                       </StyledTableCell>

//                       <StyledTableCell>{tax.status}</StyledTableCell>

//                       <StyledTableCell>
//                         <Stack
//                           direction="row"
//                           spacing={1}
//                           alignItems="center"
//                           sx={{
//                             visibility:
//                               hoverId === tax._id ? "visible" : "hidden",
//                           }}
//                         >
//                           <IconButton
//                             size="small"
//                             color="primary"
//                             onClick={() => handleEdit(tax._id)}
//                             sx={{ padding: 0 }}
//                           >
//                             <EditIcon fontSize="small" />
//                           </IconButton>

//                           <IconButton
//                             size="small"
//                             color="error"
//                             sx={{ padding: 0 }}
//                             onClick={() => handleDelete(tax)}
//                           >
//                             <DeleteIcon fontSize="small" />
//                           </IconButton>
//                         </Stack>
//                       </StyledTableCell>
//                     </TableRow>
//                   ))}

//                 {/* 🔹 3. No Data */}
//                 {!taxLoading && taxData?.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={5} align="center">
//                       No data found
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       </Modal>

//       <CommonDeleteModal
//         open={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         onConfirmDelete={confirmDelete}
//         deleting={deleteMutation.isLoading}
//         itemType={deleteTarget ? `${deleteTarget?.taxName}`.trim() : "Taxes"}
//         title="Taxes"
//       />
//     </>
//   );
// };

// export default ManageTDS;

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  Stack,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CommonDeleteModal from "../../../common/NDE-DeleteModal";
import CommonDialog from "../../../common/NDE-Dialog";

import { useDeleteTDS } from "../../../../hooks/sales/invoice-hooks";
import ReusableTable from "../../../common/Table/ReusableTable";

const ManageTDS = ({
  open,
  onClose,
  handleEdit,
  handleCreateNewTds,
  taxType,
  taxData,
  taxLoading,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const deleteMutation = useDeleteTDS();

  const handleDelete = (row) => {
    setDeleteTarget(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget._id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        },
      });
    }
  };

  /* ---------------- Columns ---------------- */

  const columns = useMemo(
    () => [
      {
        accessorKey: "taxName",
        header: "Tax Name",
      },
      {
        accessorKey: "rate",
        header: "Rate (%)",
      },
      {
        id: "section",
        header: "Section",
        accessorFn: (row) =>
          row.sectionId
            ? `${row.sectionId.sectionCode} - ${row.sectionId.description}`
            : "-",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
    ],
    [],
  );

  /* ---------------- Hover Actions ---------------- */

  const HoverActions = ({ row }) => (
    <Stack direction="row" spacing={1}>
      <IconButton
        size="small"
        color="primary"
        onClick={() => handleEdit(row.original._id)}
      >
        <EditIcon fontSize="small" />
      </IconButton>

      <IconButton
        size="small"
        color="error"
        onClick={() => handleDelete(row.original)}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  );

  return (
    <>
      <CommonDialog
        open={open}
        onClose={onClose}
        title={`Manage ${taxType}`}
        maxWidth="md"
        width={800}
        hideSubmit
      >
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography fontSize={18}>{`${taxType} Taxes`}</Typography>

          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleCreateNewTds}
          >
            {`New ${taxType}`}
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <ReusableTable
          columns={columns}
          data={taxData || []}
          isLoading={taxLoading}
          HoverComponent={HoverActions}
          maxHeight="420px"
        />
      </CommonDialog>

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteMutation.isLoading}
        itemType={deleteTarget ? `${deleteTarget?.taxName}`.trim() : "Taxes"}
        title="Taxes"
      />
    </>
  );
};

export default ManageTDS;
