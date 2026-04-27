import { useState } from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
import RecaptchaForm from "../../../components/settings/general/Recaptcha-Create-Edit";
import { useGetAllRecaptcha, useDeleteRecaptcha } from "../../../hooks/settings/recaptcha-hooks";

const RecaptchaDetails = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data, isLoading } = useGetAllRecaptcha();
  const { mutate: deleteRecaptcha, isPending: deleting } = useDeleteRecaptcha();

  const recaptchaData = data?.data || [];

  const columns = [
    { accessorKey: "email", header: "Email" },
    { accessorKey: "site_key", header: "Site Key" },
    { accessorKey: "owner_key", header: "Owner Key" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.status ? (
          <Chip label="Active" color="success" size="small" />
        ) : (
          <Chip label="Inactive" color="error" size="small" />
        ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => handleEdit(row.original)}>
            <img src={Edit} style={{ height: 15 }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original)}>
            <img src={Delete} style={{ height: 20 }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRow) {
      deleteRecaptcha(selectedRow._id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedRow(null);
        },
      });
    }
  };

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenDialog(true);
  };

  const handleCreate = () => {
    setSelectedRow(null);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between",p:1 }}>
        <Typography variant="h4" gutterBottom>
          Recaptcha Details
        </Typography>
        <CommonButton label="Create Recaptcha" onClick={handleCreate} />
      </Box>

      <ReusableTable
        columns={columns}
        data={recaptchaData}
        isLoading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />

      <RecaptchaForm
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        onSubmitAction={() => setOpenDialog(false)}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleting}
        title="Recaptcha"
        itemType={selectedRow?.email}
      />
    </Box>
  );
};

export default RecaptchaDetails;
