import React, { useState } from 'react';
import { Box, Typography, IconButton, Chip } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import AddIcon from '@mui/icons-material/Add';
import ExtensionDetails from '../../../components/settings/freeSwitch/Extension-Create-Edit';
import {
  useExtensions,
  useAddExtension,
  useUpdateExtension,
  useDeleteExtension
} from '../../../hooks/freeSwitch/extension-hooks';
import { toast } from 'react-toastify';
import ReusableTable from '../../../components/common/Table/ReusableTable';
import CommonDeleteModal from '../../../components/common/NDE-DeleteModal';
import Edit from "../../../assets/icons/edit.svg";
import Delete from "../../../assets/icons/delete.svg";

const Extension = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentEditData, setCurrentEditData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data: extensionsData, isLoading } = useExtensions();
  const tableData = extensionsData?.data || [];

  const addExtensionMutation = useAddExtension();
  const updateExtensionMutation = useUpdateExtension();
  const deleteExtensionMutation = useDeleteExtension();

  const handleOpen = () => {
    setCurrentEditData(null);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setCurrentEditData(null);
  };

  const handleEdit = (rowData) => {
    setCurrentEditData(rowData);
    setDrawerOpen(true);
  };

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    deleteExtensionMutation.mutate(selectedRow._id, {
      onSuccess: () => {
        toast.success("Extension deleted successfully");
        setDeleteModalOpen(false);
        setSelectedRow(null);
      },
      onError: (error) => {
        console.error("Error deleting extension:", error);
        toast.error("Failed to delete extension");
      }
    });
  };

  const onSubmitAction = async (formData) => {
    if (currentEditData?._id) {
      updateExtensionMutation.mutate({ id: currentEditData._id, data: formData }, {
        onSuccess: () => {
          toast.success("Extension updated successfully");
          handleClose();
        },
        onError: (error) => {
          console.error("Error updating extension:", error);
          toast.error("Failed to update extension");
        }
      });
    } else {
      addExtensionMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Extension added successfully");
          handleClose();
        },
        onError: (error) => {
          console.error("Error adding extension:", error);
          toast.error("Failed to add extension");
        }
      });
    }
  };

  const columns = [
    {
      accessorKey: "extension_number",
      header: "Extension",
    },
    {
      accessorKey: "caller_id_name",
      header: "Effective CID Name",
    },
    {
      accessorKey: "outbound_caller_id_name",
      header: "Outbound Name",
    },
    {
      accessorKey: "outbound_caller_id_number",
      header: "Outbound Number",
    },
    {
      accessorKey: "domain_name",
      header: "Domain Name",
    },
    {
      accessorKey: "status",
      header: "Enabled",
      cell: ({ row }) => (
        <Chip
          label={row.original.status === "active" ? "Active" : "Disable"}
          variant="outlined"
          size="small"
          sx={{
            borderColor: row.original.status === "active" ? "#4CAF50" : "#9E9E9E",
            color: row.original.status === "active" ? "#4CAF50" : "#9E9E9E",
            bgcolor: row.original.status === "active" ? "#E8F5E9" : "#F5F5F5",
            fontWeight: 600,
            borderRadius: "4px",
          }}
        />
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => handleEdit(row.original)} size="small">
            <img src={Edit} style={{ height: 16 }} alt="Edit" />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original)} size="small">
            <img src={Delete} style={{ height: 18 }} alt="Delete" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          p: 1,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h4" gutterBottom noWrap sx={{ mb: 0 }}>
          Extension
        </Typography>
        <Box sx={{ mt: { xs: 1, sm: 0 } }}>
          <CommonButton
            label="Add Extension"
            onClick={handleOpen}
            startIcon={<AddIcon sx={{ color: '#FFF' }} />}
          />
        </Box>
      </Box>

      {/* Extension Table */}
      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />

      {/* Drawer */}
      <ExtensionDetails
        open={drawerOpen}
        setOpen={setDrawerOpen}
        initialData={currentEditData}
        onSubmitAction={onSubmitAction}
      />

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteExtensionMutation.isPending}
        title="Extension"
        itemType={selectedRow?.extension_number}
      />
    </Box>
  );
};

export default Extension;
