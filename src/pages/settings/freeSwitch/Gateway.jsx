import { useState } from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import GatewayDetails from "../../../components/settings/freeSwitch/Gateway-Create-Edit";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import Edit from "../../../assets/icons/edit.svg";
import Delete from "../../../assets/icons/delete.svg";
import {
  useGateways,
  useAddGateway,
  useUpdateGateway,
  useDeleteGateway,
} from "../../../hooks/freeSwitch/gateway-hooks";

const Gateway = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data: gatewaysData, isLoading } = useGateways();
  const addGatewayMutation = useAddGateway();
  const updateGatewayMutation = useUpdateGateway();
  const deleteGatewayMutation = useDeleteGateway();

  const tableData = gatewaysData?.data || [];

  const columns = [
    {
      accessorKey: "name",
      header: "Gateway Name",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "proxy",
      header: "Proxy",
    },
    {
      accessorKey: "register",
      header: "Register",
      cell: ({ row }) => (
        <Chip
          label={row.original.register ? "True" : "False"}
          variant="outlined"
          size="small"
          sx={{
            borderColor: row.original.register ? "#4CAF50" : "#F44336",
            color: row.original.register ? "#4CAF50" : "#F44336",
            bgcolor: row.original.register ? "#E8F5E9" : "#FFEBEE",
            fontWeight: 600,
            borderRadius: "4px",
          }}
        />
      ),
    },
    {
      accessorKey: "profile",
      header: "Profile",
      cell: ({ row }) => (
        <Typography variant="body2">
          {row.original.profile?.charAt(0).toUpperCase() +
            row.original.profile?.slice(1)}
        </Typography>
      ),
    },
    {
      id: "action",
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

  const handleSubmit = (formData) => {
    // Format data for backend
    const formattedData = {
      name: formData.gatewayName,
      username: formData.username,
      password: formData.password,
      from_user: formData.fromUser,
      from_domain: formData.fromDomain,
      proxy: formData.proxy,
      expire_seconds: formData.expireSeconds,
      register: formData.register,
      retry_seconds: formData.retrySeconds,
      profile: formData.profile.toLowerCase(),
    };

    if (selectedRow) {
      updateGatewayMutation.mutate(
        { id: selectedRow._id, data: formattedData },
        {
          onSuccess: () => {
            setOpenDrawer(false);
            setSelectedRow(null);
          },
        }
      );
    } else {
      addGatewayMutation.mutate(formattedData, {
        onSuccess: () => {
          setOpenDrawer(false);
        },
      });
    }
  };

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenDrawer(true);
  };

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteGatewayMutation.mutate(selectedRow._id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedRow(null);
      },
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          p: 1,
          gap: 2,
        }}
      >
        <Typography variant="h4" gutterBottom noWrap sx={{ mb: 0 }}>
          Manage Gateway
        </Typography>

        <CommonButton
          label="Create New Gateway"
          onClick={() => {
            setSelectedRow(null);
            setOpenDrawer(true);
          }}
          startIcon={false}
        />
      </Box>

      {/* Gateway Table */}
      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />

      {/* Gateway Drawer */}
      <GatewayDetails
        open={openDrawer}
        setOpen={setOpenDrawer}
        initialData={
          selectedRow
            ? {
              ...selectedRow,
              gatewayName: selectedRow.name,
              fromUser: selectedRow.from_user,
              fromDomain: selectedRow.from_domain,
              expireSeconds: selectedRow.expire_seconds,
              retrySeconds: selectedRow.retry_seconds,
              profile:
                selectedRow.profile?.charAt(0).toUpperCase() +
                selectedRow.profile?.slice(1),
            }
            : null
        }
        onSubmitAction={handleSubmit}
      />

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteGatewayMutation.isPending}
        title="Gateway"
        itemType={selectedRow?.name}
      />
    </Box>
  );
};

export default Gateway;