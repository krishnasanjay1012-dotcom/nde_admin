import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DomainDetails from "./Customer-Domain-Create-Edit";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReusableTable from "../../common/Table/ReusableTable";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import CustomPagination from "../../common/Table/TablePagination";

const statusColorMap = {
  ACTIVE: { color: "#2e7d32", bg: "#e8f5e9" },
  INACTIVE: { color: "#d32f2f", bg: "#fdecea" },
  PENDING: { color: "#ed6c02", bg: "#fff4e5" },

  OPEN: { color: "#2196f3", bg: "#e3f2fd" },
  DRAFT: { color: "#9e9e9e", bg: "#f5f5f5" },
  SENT: { color: "#2196f3", bg: "#e3f2fd" },
  VIEWED: { color: "#00bcd4", bg: "#e0f7fa" },
  PARTIALLY_PAID: { color: "#ff9800", bg: "#fff3e0" },
  PAID: { color: "#4caf50", bg: "#e8f5e9" },
  OVERDUE: { color: "#f44336", bg: "#fdecea" },
  VOID: { color: "#607d8b", bg: "#eceff1" },
  DELETED: { color: "#000000", bg: "#eeeeee" },
  PENDING_APPROVAL: { color: "#ffc107", bg: "#fff8e1" },
  APPROVED: { color: "#2e7d32", bg: "#e8f5e9" },
  WRITTEN_OFF: { color: "#795548", bg: "#efebe9" },
};

import { usePurchasedProducts } from "../../../hooks/Customer/Customer-hooks";

const CustomerApp = ({ selectedWorkspaceId }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data, isLoading } = usePurchasedProducts({
    page,
    limit,
    workspace_Id: selectedWorkspaceId,
  });

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const tableData =
    data?.data?.docs?.map((item) => ({
      ...item,
      id: item._id,
      purchasedDate: formatDate(item.startDate),
      renewalDate: formatDate(item.renewalDate),
      status: item.status?.toUpperCase(),
    })) || [];

  const columns = [
    { accessorKey: "productName", header: "Product Name" },
    { accessorKey: "planName", header: "Plan Name" },
    { accessorKey: "purchasedDate", header: "Purchased Date" },
    { accessorKey: "renewalDate", header: "Renewal Date" },
    { accessorKey: "type", header: "Type" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        const styles =
          statusColorMap[status] || { color: "#555", bg: "#eee" };

        return (
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 500,
              textAlign: "center",
              width: "fit-content",
              color: styles.color,
              backgroundColor: styles.bg,
            }}
          >
            {status}
          </Box>
        );
      },
    },

    // {
    //   accessorKey: "action",
    //   header: "Actions",
    //   cell: ({ row }) => (
    //     <Box sx={{ display: "flex", gap: 1 }}>
    //       <IconButton onClick={() => handleEdit(row.original)}>
    //         <EditIcon sx={{ color: "#919191", fontSize: 20 }} />
    //       </IconButton>
    //       <IconButton onClick={() => handleDelete(row.original)}>
    //         <DeleteIcon sx={{ color: "#919191", fontSize: 20 }} />
    //       </IconButton>
    //     </Box>
    //   ),
    // },
  ];

  // ADD
  const addNewEntry = async (newData) => {
    try {
      // API call
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // EDIT
  const updateEntry = async (id, updatedData) => {
    try {
      // API call
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // DELETE
  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;
    try {
      // API call
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };

  // EDIT CLICK
  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenDialog(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
        }}
      >
        <Typography variant="h4">Manage Apps</Typography>
      </Box>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        maxHeight="calc(100vh - 280px)"
        skeletonRowCount={5}
      />

      {/* Pagination */}
      <CustomPagination
        count={data?.data?.totalPages || 0}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      />

      {/* Add/Edit Dialog */}
      <DomainDetails
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        onSubmitAction={(formData) => {
          if (selectedRow) {
            updateEntry(selectedRow.id, formData);
          } else {
            addNewEntry(formData);
          }
        }}
      />

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={false}
        itemType="Product"
      />
    </Box>
  );
};

export default CustomerApp;