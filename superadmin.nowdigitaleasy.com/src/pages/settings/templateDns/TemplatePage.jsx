import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, CardContent, Chip,
  IconButton, Tooltip, Switch, 
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TableSortLabel, Paper, Skeleton, Pagination,
} from "@mui/material";
import {
  Article as ArticleIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useTemplates, useDeleteTemplate, useToggleTemplate, useCreateTemplateValue, useTemplateValues, useUpdateTemplateValue } from "../../../hooks/dns/useDnshooks";
import { useTemplateModal } from "../../../hooks/dns/useTemplateModal";
import TemplateValuesModal from "../../../components/settings/dnsTemplate/TemplateValuesModal";
import CommonButton from "../../../components/common/NDE-Button";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
// import CommonDrawer from "../../../components/common/NDE-Drawer";
// import MainDns from "../../../components/Customer/Tabs/DnsRecordsTable";

const PAGE_SIZE = 10;

export default function TemplatePage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useTemplates();
  const deleteTemplateMutation = useDeleteTemplate();
  const { mutateAsync: toggleActiveMutate } = useToggleTemplate();
  const [dnsDrawerOpen, setDnsDrawerOpen] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: PAGE_SIZE });

  // ── Stable arrays for React Table rendering ────────────────────────────────
  const templates = useMemo(() => data || [], [data]);
  console.log('templates?.[0]?.templateName', templates?.[0]?.name);
  const settingsModal = useTemplateModal();

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deleteTemplateMutation.mutateAsync(deleteConfirm.id);
      settingsModal.close();
      // toast.success("Template deleted successfully");
    } catch (error) {
      // toast.error(error.response?.data?.message || "Failed to delete template");
    } finally {
      setDeleteConfirm({ open: false, id: null });
    }
  };

  const handleToggleActive = useCallback(async (id) => {
    try {
      await toggleActiveMutate(id);
      // toast.success("Status updated");
    } catch (error) {
      // toast.error("Failed to update status");
    }
  }, [toggleActiveMutate]); // destructured mutateAsync is guaranteed stable

  const updateTemplateValueMutation = useUpdateTemplateValue();
  const { data: templateValuesRes } = useTemplateValues();
  const templateValuesData = useMemo(() => templateValuesRes?.data || templateValuesRes || [], [templateValuesRes]);
  const globalTemplateValueId = templateValuesData.length > 0 ? templateValuesData[0]._id : null;

  const handleOpenSettings = (template) => {
    settingsModal.open({ template, templateValueId: globalTemplateValueId });
  };

  const createTemplateValueMutation = useCreateTemplateValue();

  const handleApplyValues = async (values, templateValueId) => {
    try {
      if (templateValueId) {
        await updateTemplateValueMutation.mutateAsync({
          id: templateValueId,
          payload: { variables: values.variables },
        });
        settingsModal.close();
        // toast.success(`Values updated successfully`);
      } else {
        await createTemplateValueMutation.mutateAsync({
          domain: null,
          variables: values.variables,
        });
        // toast.success(`Values set for Template`);
      }
    } catch (error) {
      // toast.error(error.response?.data?.message || "Failed to save template values");
      throw error;
    }
  };

  // ── TanStack column definitions ───────────────────────────────────────────
  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
            {row.original.name}
          </Typography>
          {row.original.isSystem && (
            <Chip
              label="System"
              size="small"
              sx={{ fontSize: 10, bgcolor: "primary.light", color: "white" }}
            />
          )}
        </Box>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Chip label={row.original.category} size="small" sx={{ fontSize: 11 }} />
      ),
    },
    {
      accessorKey: "isActive",
      header: "Active",
      enableSorting: false,
      cell: ({ row }) => (
        <Switch
          size="small"
          checked={row.original.isActive}
          onChange={() => handleToggleActive(row.original._id)}
        />
      ),
    },
    {
      accessorKey: "version",
      header: "Version",
      cell: ({ row }) => (
        <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
          v{row.original.version}
        </Typography>
      ),
    },
    {
      accessorKey: "records",
      header: "Records",
      enableSorting: false,
      cell: ({ row }) => (
        <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
          {row.original.records?.length || 0} records
        </Typography>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              sx={{ color: "primary.main" }}
              onClick={() => navigate(`/settings/dns/templates/edit/${row.original._id}`)}
            >
              <img src={Edit} style={{ height: 15 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <span>
              <IconButton
                size="small"
                sx={{ color: "error.main" }}
                onClick={() => handleDeleteClick(row.original._id)}
                disabled={row.original.isSystem}
              >
                <img src={Delete} style={{ height: 20 }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ], [navigate, handleToggleActive]);

  // ── TanStack table instance ────────────────────────────────────────────────
  const table = useReactTable({
    data: templates,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row._id,
  });

  const stats = [
    { label: "Total Templates", value: templates.length, color: "#6366f1" },
    { label: "Active", value: templates.filter(t => t.isActive).length, color: "#22c55e" },
    { label: "Draft/Inactive", value: templates.filter(t => !t.isActive).length, color: "#f59e0b" },
  ];

  const currentPage = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: 2,
              // bgcolor: "rgba(99,102,241,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <ArticleIcon sx={{ color: "primary.main", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6">Templates</Typography>
            <Typography variant="caption" color="text.secondary">
              Manage all message and DNS templates
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {/* <CommonButton
            variant="outlined"
            startIcon={<SettingsIcon sx={{ color: "icon.default" }} />}
            size="small"
            label="DOMAIN"
            onClick={() => { setDnsDrawerOpen(true) }}
          /> */}
          <CommonButton
            label={"Settings Template"}
            variant="outlined"
            startIcon={<SettingsIcon sx={{ color: "icon.default" }} />}
            size="small"
            onClick={() => {
              if (templates.length === 0) {
                // toast.info("No templates available.");
                return;
              }
              const defaultTemplate = templates.find((t) => t.isActive) || templates[0];
              handleOpenSettings(defaultTemplate);
            }}
          />

          <CommonButton
            label={"New Templates"}
            size="small"
            variant="contained"
            onClick={() => navigate("/settings/dns/templates/new")} />
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mb: 3 }}>
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent sx={{ p: "16px !important" }}>
              <Typography variant="caption" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography variant="h5" sx={{ color: stat.color, fontWeight: 700 }}>
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Table */}
      <Card sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
        <TableContainer elevation={0}>
          <Table size="small">
            <TableHead>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} sx={{ bgcolor: "background.default" }}>
                  {hg.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      sx={{ fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}
                    >
                      {header.column.getCanSort() ? (
                        <TableSortLabel
                          active={!!header.column.getIsSorted()}
                          direction={header.column.getIsSorted() === "asc" ? "asc" : "desc"}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableSortLabel>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>

            <TableBody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton variant="text" width="80%" height={20} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* {isError && !isLoading && (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography color="error" variant="body2" sx={{ py: 3 }}>
                      Failed to load templates. Please try again.
                    </Typography>
                  </TableCell>
                </TableRow>
              )} */}

              {!isLoading && isError && table.getRowModel().rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography color="text.secondary" variant="body2" sx={{ py: 3 }}>
                      No templates found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} hover>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", px: 2, py: 1.5, gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong>
              {" · "}
              <strong>{templates.length}</strong> templates
            </Typography>
            <Pagination
              count={totalPages}
              page={currentPage + 1}
              onChange={(_, newPage) => table.setPageIndex(newPage - 1)}
              size="small"
              shape="rounded"
              color="primary"
            />
          </Box>
        )}
      </Card>

      {/* Settings Template Modal */}
      <TemplateValuesModal
        open={settingsModal.isOpen}
        onClose={settingsModal.close}
        template={settingsModal.data?.template || settingsModal.data}
        templateValueId={settingsModal.data?.templateValueId}
        onApply={handleApplyValues}
      />

      {/* Delete Confirmation Dialog */}
      <CommonDeleteModal
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
        onConfirmDelete={handleConfirmDelete}
        deleting={isLoading || deleteTemplateMutation.isPending}
        itemType={templates?.filter((t) => t._id === deleteConfirm.id).map((t) => t.name).join(', ') || ""}
        title={"Template"}
      />
      {/* <CommonDrawer
        open={dnsDrawerOpen}
        onClose={() => setDnsDrawerOpen(false)}
        anchor="right"
        width={1000}
        title="DNS Record"
      >
        <Box>
          <MainDns domain={"example.com."} Zone_id={"69ccf29ce8b21a276d031d0c"} />
        </Box>
      </CommonDrawer> */}
    </Box>
  );
}
