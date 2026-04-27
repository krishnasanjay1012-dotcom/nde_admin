import React, { useState } from 'react';
import { Box, Typography, IconButton, Chip } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import AddIcon from '@mui/icons-material/Add';
import DialPlanDetails from '../../../components/settings/freeSwitch/DialPlan-Create-Edit';
import {
  useDialPlans,
  useAddDialPlan,
  useUpdateDialPlan,
  useDeleteDialPlan
} from '../../../hooks/freeSwitch/dialplan-hooks';
import { toast } from 'react-toastify';
import ReusableTable from '../../../components/common/Table/ReusableTable';
import CommonDeleteModal from '../../../components/common/NDE-DeleteModal';
import Edit from "../../../assets/icons/edit.svg";
import Delete from "../../../assets/icons/delete.svg";

const DialPlan = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentEditData, setCurrentEditData] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data: dialPlansData, isLoading } = useDialPlans();
  const tableData = dialPlansData?.data || [];

  const addDialPlanMutation = useAddDialPlan();
  const updateDialPlanMutation = useUpdateDialPlan();
  const deleteDialPlanMutation = useDeleteDialPlan();

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
    deleteDialPlanMutation.mutate(selectedRow._id, {
      onSuccess: () => {
        toast.success("Dial Plan deleted successfully");
        setDeleteModalOpen(false);
        setSelectedRow(null);
      },
      onError: (error) => {
        console.error("Error deleting dial plan:", error);
        toast.error("Failed to delete dial plan");
      }
    });
  };

  const onSubmitAction = async (formData) => {
    const editId = currentEditData?._id || formData._id;
    if (editId) {
      updateDialPlanMutation.mutate({ id: editId, data: formData }, {
        onSuccess: () => {
          toast.success("Dial Plan updated successfully");
          handleClose();
        },
        onError: (error) => {
          console.error("Error updating dial plan:", error);
          toast.error("Failed to update dial plan");
        }
      });
    } else {
      addDialPlanMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Dial Plan added successfully");
          handleClose();
        },
        onError: (error) => {
          console.error("Error adding dial plan:", error);
          toast.error("Failed to add dial plan");
        }
      });
    }
  };

  const columns = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Chip
          label={row.original.type === "outbound" ? "Outbound" : "Inbound"}
          size="small"
          sx={{
            fontWeight: 600,
            borderRadius: "4px",
          }}
        />
      ),
    },
    {
      accessorKey: "destination",
      header: "Destination",
    },
    {
      accessorKey: "context",
      header: "Context",
    },
    {
      accessorKey: "order",
      header: "Order",
    },
    {
      accessorKey: "enabled",
      header: "Enabled",
      cell: ({ row }) => (
        <Chip
          label={row.original.enabled ? "Enabled" : "Disabled"}
          variant="outlined"
          size="small"
          sx={{
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
          Dial Plan
        </Typography>
        <Box sx={{ mt: { xs: 1, sm: 0 } }}>
          <CommonButton
            label="Add Dial Plan"
            onClick={handleOpen}
            startIcon={<AddIcon sx={{ color: '#FFF' }} />}
          />
        </Box>
      </Box>

      {/* DialPlan Table */}
      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />

      {/* Drawer */}
      <DialPlanDetails
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
        deleting={deleteDialPlanMutation.isPending}
        title="Dial Plan"
        itemType={selectedRow?.type}
      />
    </Box>
  );
};

export default DialPlan;
