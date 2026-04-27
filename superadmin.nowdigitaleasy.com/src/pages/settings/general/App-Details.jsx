import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import { useAppDetails, useDeleteAppDetails } from "../../../hooks/applist/applist-hooks";
import AppDetailsForm from "../../../components/settings/general/App-Details-Create-Edit";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";

const AppDetails = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data, isLoading } = useAppDetails();
  const { mutate: deleteAppDetail, isPending: deleting } = useDeleteAppDetails();

  const appData = data?.data || [];

  const columns = [
    { accessorKey: "appName", header: "App Name" },
    {
      accessorKey: "appUrl", header: "App URL",
      cell: ({ row }) => (
        <a
          href={row.original.appUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            maxWidth: 250,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          title={row.original.appUrl}
        >
          {row.original.appUrl}
        </a>
      ),
    },
    { accessorKey: "appVersion", header: "Version" },
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
      deleteAppDetail(selectedRow._id, {
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
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
        <Typography variant="h4" gutterBottom>
          App Details
        </Typography>
        <CommonButton label="Create App Details" onClick={handleCreate} />
      </Box>

      <ReusableTable
        columns={columns}
        data={appData}
        isLoading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />

      <AppDetailsForm
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
        title="App Detail"
        itemType={selectedRow?.appName}
      />
    </Box>
  );
};

export default AppDetails;
