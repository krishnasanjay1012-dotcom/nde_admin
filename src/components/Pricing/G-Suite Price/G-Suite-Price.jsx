import { useState } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonButton from "../../../components/common/NDE-Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import GSuitePriceDetails from "../G-Suite Price/GSuitePrice-Create";
import { useGSuitePrices, useDeleteGSuitePrice } from "../../../hooks/GSuitePrice/GSuitePrice-hooks"; 

import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";

const GSuitePrice = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data: tableData, isLoading } = useGSuitePrices();
  const deleteMutation = useDeleteGSuitePrice();

  const columns = [
    { accessorKey: "skuId", header: "SKU ID" },
    { accessorKey: "productName", header: "Product Name" },
    { accessorKey: "planName", header: "Plan Name" },
    { accessorKey: "HsnCode", header: "HSN Code" },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => navigate(`details/${row.original.id}`)}
          >
             <img src={Edit} style={{ height: 16 }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original)}>
            <img src={Delete} style={{ height: 20 }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  // DELETE
  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRow) {
      deleteMutation.mutate(selectedRow.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedRow(null);
        },
      });
    }
  };

  return (
    <Box >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column",p:1}}>
          <Typography variant="h4" gutterBottom>
            G-Suite Plan
          </Typography>
          <Typography variant="body1" gutterBottom>
            Configure G-Suite Plan and prices
          </Typography>
        </Box>
        <CommonButton
          label={"Create New Plan"}
          onClick={() => {
            setSelectedRow(null);
            setOpenDialog(true);
            
          }}
          sx={{mr:1}}
        />
      </Box>
        <ReusableTable columns={columns} data={tableData?.data || []} isLoading={isLoading} />

      <GSuitePriceDetails
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        onSubmitAction={() => setOpenDialog(false)}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteMutation.isLoading}
        itemType={selectedRow?.productName}
        title={"GSuite Plan"}
      />
    </Box>
  );
};

export default GSuitePrice;
