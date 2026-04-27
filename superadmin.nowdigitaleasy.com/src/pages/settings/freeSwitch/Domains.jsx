import { useState } from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import DomainDetails from "../../../components/settings/freeSwitch/Domain-Create-Edit";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import Edit from "../../../assets/icons/edit.svg";
import Delete from "../../../assets/icons/delete.svg";
import { useFreeSwitchDomains, useDeleteFreeSwitchDomain, useAddFreeSwitchDomain, useUpdateFreeSwitchDomain } from "../../../hooks/freeSwitch/domain-hooks";
import { toast } from "react-toastify";

const Domains = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { data: domainsData, isLoading } = useFreeSwitchDomains();
  const deleteMutation = useDeleteFreeSwitchDomain();
  const addMutation = useAddFreeSwitchDomain();
  const updateMutation = useUpdateFreeSwitchDomain();

  const tableData = domainsData?.data || [];

  const columns = [
    {
      accessorKey: "workspace_name",
      header: "Workspace Name",
      cell: ({ row }) => row.original.workspace_id?.workspace_name || "N/A"
    },
    // {
    //   accessorKey: "freeswitch_server_id.host",
    //   header: "Free Switch",
    //   cell: ({ row }) => row.original.freeswitch_server_id?.host || row.original.freeswitch_server_id?.port || "N/A"
    // },
    {
      accessorKey: "domain",
      header: "Domain Name",
    },
    {
      accessorKey: "enable",
      header: "Status",
      cell: ({ row }) => (
        <Chip
          label={row.original.enable ? "Active" : "Inactive"}
          variant="outlined"
          size="small"
          sx={{
            borderColor: row.original.enable ? "#4CAF50" : "#9E9E9E",
            color: row.original.enable ? "#4CAF50" : "#9E9E9E",
            bgcolor: row.original.enable ? "#E8F5E9" : "#F5F5F5",
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
    if (selectedRow) {
      updateMutation.mutate(
        { id: selectedRow._id, data: formData },
        {
          onSuccess: () => {
            toast.success("Domain updated successfully");
            setOpenDialog(false);
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update domain");
          }
        }
      );
    } else {
      addMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Domain created successfully");
          setOpenDialog(false);
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Failed to create domain");
        }
      });
    }
  };

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenDialog(true);
  };

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedRow._id, {
      onSuccess: () => {
        toast.success("Domain deleted successfully");
        setDeleteModalOpen(false);
        setSelectedRow(null);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to delete domain");
      }
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
          Manage Domain
        </Typography>

        <CommonButton
          label="Create New Domain"
          onClick={() => {
            setSelectedRow(null);
            setOpenDialog(true);
          }}
          startIcon={false}
        />
      </Box>

      {/* Domain Table */}
      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />

      {/* Domain Dialog */}
      <DomainDetails
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        onSubmitAction={handleSubmit}
      />

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteMutation.isLoading}
        title="Domain"
        itemType={selectedRow?.domain}
      />
    </Box>
  );
};

export default Domains;