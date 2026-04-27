import { useState } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import DomainDetails from "../../../components/settings/integrations/Domain-Create-Edit";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";

import {
  useResellers,
  useCreateReseller,
  useUpdateReseller,
  useDeleteReseller,
} from "../../../hooks/settings/resellers-hooks";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";

const Domain = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data: resellersData, isLoading } = useResellers();
  const createResellerMutation = useCreateReseller();
  const updateResellerMutation = useUpdateReseller();
  const deleteResellerMutation = useDeleteReseller();

  const tableData = resellersData?.data?.map((item) => ({
    id: item._id,
    apikey: item.apiKey,
    userId: item.authuserId,
    customerId: item.customerID,
    status: item.enable ? "Active" : "Inactive",
    aliasName: item.aliasName,
  })) || [];

  const columns = [
    {
      accessorKey: "serial",
      header: "ID",
      cell: ({ row }) => row.index + 1,
    },
    { accessorKey: "apikey", header: "Api Key" },
    { accessorKey: "userId", header: "User ID" },
    { accessorKey: "customerId", header: "Customer Id" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "aliasName", header: "Alias Name" },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => handleEdit(row.original)}>
            <img src={Edit} style={{ height: 16 }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original)}>
            <img src={Delete} style={{ height: 20 }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleSubmit = async (data) => {
    try {
      if (selectedRow) {
        await updateResellerMutation.mutateAsync({
          id: selectedRow.id,
          data,
        });
      } else {
        await createResellerMutation.mutateAsync(data);
      }
      setOpenDialog(false);

    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteResellerMutation.mutate(selectedRow.id);
    setDeleteModalOpen(false);
    setSelectedRow(null);
  };

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenDialog(true);
  };



  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1 }}>
        <Typography variant="h4" gutterBottom>
          Reseller Settings
        </Typography>
        <CommonButton
          label={"Create Reseller"}
          onClick={() => {
            setSelectedRow(null);
            setOpenDialog(true);
          }}
        />
      </Box>

      <ReusableTable columns={columns} data={tableData} isLoading={isLoading} maxHeight="calc(100vh - 180px)" />

      <DomainDetails
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        onSubmitAction={handleSubmit}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteResellerMutation.isLoading}
        title="Domain"
        itemType={selectedRow?.aliasName}
      />
    </Box>
  );
};

export default Domain;
