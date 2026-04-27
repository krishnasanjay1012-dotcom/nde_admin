import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Chip, IconButton, Tooltip, Button } from "@mui/material";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import CommonButton from "../../../components/common/NDE-Button";
import { CommonSelect } from "../../../components/common/fields";
import Edit from "../../../assets/icons/edit.svg";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  useAllSmsTemplates,
  useDeleteSmsTemplate,
} from "../../../hooks/settings/sms-hooks";
import SmsTemplateForm from "./SmsTemplateForm";

const TYPE_OPTIONS = [
  { label: "All types", value: "all_types" },
  { label: "Transactional", value: "Transactional" },
  { label: "Promotional", value: "Promotional" },
  { label: "OTP", value: "OTP" },
];

const STATUS_OPTIONS = [
  { label: "All statuses", value: "all_statuses" },
  { label: "Approved", value: "Approved" },
  { label: "Pending DLT", value: "Pending DLT" },
  { label: "Rejected", value: "Rejected" },
];

const TYPE_CHIP_COLOR = {
  Transactional: { bg: "#E8F5E9", color: "#2E7D32" },
  Promotional:   { bg: "#FFF3E0", color: "#E65100" },
  OTP:           { bg: "#E3F2FD", color: "#1565C0" },
};

const STATUS_CHIP_COLOR = {
  Approved:    { bg: "#E8F5E9", color: "#2E7D32" },
  "Pending DLT": { bg: "#FFF8E1", color: "#F57F17" },
  Rejected:    { bg: "#FFEBEE", color: "#C62828" },
};

const SmsTemplate = () => {
  const [rawData, setRawData]           = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow]   = useState(null); 
  const [formOpen, setFormOpen]         = useState(false);
  const [typeFilter, setTypeFilter]     = useState("all_types");
  const [statusFilter, setStatusFilter] = useState("all_statuses");

  const { data: templates, isLoading } = useAllSmsTemplates();
  const { mutate: deleteTemplate, isLoading: isDeleting } = useDeleteSmsTemplate();

  useEffect(() => {
    const list = templates?.data;
    if (list?.length) {
      setRawData(
        list.map((item, index) => ({
          id:        item._id,
          index:     index + 1,
          name:      item.name || "—",
          body:      item.content || item.templateBody || item.template || "—",
          dltId:     item.dltId || item.dltTemplateId || "—",
          type:      item.type || "—",
          variables: item.variables || [],
          status:    item.status || "Pending DLT",
        }))
      );
    } else {
      setRawData([]);
    }
  }, [templates]);

  const tableData = useMemo(() => {
    return rawData.filter((row) => {
      const matchType   = !typeFilter   || row.type === typeFilter;
      const matchStatus = !statusFilter || row.status === statusFilter;
      return matchType && matchStatus;
    });
  }, [rawData, typeFilter, statusFilter]);

  const handleEdit = (row) => {
    setSelectedRow(row);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedRow(null);
    setFormOpen(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteTemplate(selectedRow.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedRow(null);
      },
    });
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Typography fontWeight={600} fontSize={14}>
          {row.original.name}
        </Typography>
      ),
    },
    {
      accessorKey: "body",
      header: "Template body",
      cell: ({ row }) => (
        <Typography
          fontSize={13}
          color="text.secondary"
          sx={{
            maxWidth: 220,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={row.original.body}
        >
          {row.original.body}
        </Typography>
      ),
    },
    {
      accessorKey: "dltId",
      header: "DLT ID",
      cell: ({ row }) => (
        <Typography fontSize={13}>
          {row.original.dltId !== "—" ? row.original.dltId : "–"}
        </Typography>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const colors = TYPE_CHIP_COLOR[row.original.type] || { bg: "#F5F5F5", color: "#616161" };
        return (
          <Chip
            label={row.original.type}
            size="small"
            sx={{
              bgcolor: colors.bg,
              color: colors.color,
              fontWeight: 600,
              fontSize: 12,
              border: "none",
            }}
          />
        );
      },
    },
    {
      accessorKey: "variables",
      header: "Variables",
      cell: ({ row }) => {
        const vars = row.original.variables;
        if (!vars?.length) return <Typography fontSize={13} color="text.disabled">—</Typography>;
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
            {vars.map((v) => (
              <Chip
                key={v}
                label={v}
                size="small"
                variant="outlined"
                sx={{ fontSize: 11, height: 20, borderRadius: 1 }}
              />
            ))}
          </Box>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const colors = STATUS_CHIP_COLOR[row.original.status] || { bg: "#F5F5F5", color: "#616161" };
        return (
          <Chip
            label={row.original.status}
            size="small"
            sx={{
              bgcolor: colors.bg,
              color: colors.color,
              fontWeight: 600,
              fontSize: 12,
            }}
          />
        );
      },
    },
    {
      accessorKey: "action",
      header: "Actions",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleEdit(row.original)}
            sx={{ minWidth: 50, fontSize: 12, py: 0.3 }}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDeleteClick(row.original)}
            sx={{ minWidth: 60, fontSize: 12, py: 0.3 }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
          mb: 1,
        }}
      >
        <Typography variant="h4">SMS Templates</Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {/* Type Filter */}
          <CommonSelect
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={TYPE_OPTIONS}
            width={160}
            mt={0}
            mb={0}
            clearable={false}
            height={37}
          />

          {/* Status Filter */}
          <CommonSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={STATUS_OPTIONS}
            width={160}
            mt={0}
            mb={0}
            height={37}
            clearable={false}
          />

          <CommonButton
            label="Create Template"
            onClick={handleCreate}
            startIcon={false}
          />
        </Box>
      </Box>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={tableData}
        maxHeight="calc(100vh - 220px)"
        isLoading={isLoading}
      />

      {/* Delete modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={isDeleting}
        itemType="SMS Template"
      />

      {/* Unified create / edit drawer */}
      <SmsTemplateForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        selectedRow={selectedRow}
      />
    </Box>
  );
};

export default SmsTemplate;
