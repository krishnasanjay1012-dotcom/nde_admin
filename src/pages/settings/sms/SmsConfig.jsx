import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Switch,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import CommonButton from "../../../components/common/NDE-Button";
import Edit from "../../../assets/icons/edit.svg";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  useSmsConfig,
  useDeleteSmsConfig,
  useEnableSmsConfig,
} from "../../../hooks/settings/sms-hooks";
import CreateSmsConfig from "./CreateSmsConfig";
import EditSmsConfig from "./EditSmsConfig";

const SmsConfig = () => {
  const [tableData, setTableData] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { data: configData, isLoading } = useSmsConfig();
  const { mutate: deleteConfig, isLoading: isDeleting } = useDeleteSmsConfig();
  const { mutate: enableConfig } = useEnableSmsConfig();

  useEffect(() => {
    const list = configData?.data;
    if (list && list.length) {
      setTableData(
        list.map((item, index) => ({
          id: item._id,
          index: index + 1,
          name: item.name || item.providerName || "—",
          apiKey: item.apiKey ? `****${item.apiKey.slice(-4)}` : "—",
          senderId: item.senderId || "—",
          status: item.isActive ?? item.status ?? false,
        }))
      );
    } else {
      setTableData([]);
    }
  }, [configData]);

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditOpen(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteConfig(selectedRow.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedRow(null);
      },
    });
  };

  const handleToggle = (row) => {
    enableConfig({ id: row.id, isActive: !row.status });
  };

  const columns = [
    { accessorKey: "index", header: "#", size: 60 },
    { accessorKey: "name", header: "Provider Name" },
    { accessorKey: "apiKey", header: "API Key" },
    { accessorKey: "senderId", header: "Sender ID" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Chip
          label={row.original.status ? "Active" : "Inactive"}
          size="small"
          color={row.original.status ? "success" : "default"}
          variant="outlined"
        />
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title={row.original.status ? "Disable" : "Enable"}>
            <Switch
              size="small"
              checked={!!row.original.status}
              onChange={() => handleToggle(row.original)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(row.original)}>
              <img src={Edit} style={{ height: 16 }} alt="edit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(row.original)}
            >
              <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
        }}
      >
        <Typography variant="h4" gutterBottom>
          SMS Configuration
        </Typography>
        <CommonButton
          label="Add SMS Config"
          onClick={() => setCreateOpen(true)}
          startIcon={false}
        />
      </Box>

      <ReusableTable
        columns={columns}
        data={tableData}
        maxHeight="calc(100vh - 220px)"
        isLoading={isLoading}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={isDeleting}
        itemType="SMS Config"
      />

      <CreateSmsConfig
        open={createOpen}
        handleClose={() => setCreateOpen(false)}
      />

      <EditSmsConfig
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        selectedRow={selectedRow}
      />
    </Box>
  );
};

export default SmsConfig;
