import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import CommonButton from "../../common/NDE-Button";
import HostingDetails from "./Customer-Hosting-Create-Edit";
import ReusableTable from "../../common/Table/ReusableTable";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import CustomPagination from "../../common/Table/TablePagination";
import { usePleskData } from "../../../hooks/Customer/Customer-hooks";
import DomainRenewal from "../../common/Domain-Renewal";

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const CustomerHosting = ({ selectedWorkspaceId }) => {
  const { customerId } = useParams();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data, isLoading } = usePleskData({
    page,
    limit,
    userId: customerId,
    workspace_Id: selectedWorkspaceId,
  });

  const tableData = data?.data || [];

  const columns = [
    { accessorKey: "name", header: "Domain Name" },
    { accessorKey: "productName", header: "Product Name" },
    { accessorKey: "planName", header: "Plan Name" },
    { accessorKey: "status", header: "status" },
    {
      accessorKey: "orderDate",
      header: "Purchased Date",
      cell: ({ row }) => formatDate(row.original.orderDate),
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) => formatDate(row.original.expiryDate),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(row.original);
            }}
            sx={{
              height: 26,
              borderColor: "primary.main",
              backgroundColor: "primary.extraLight",
              fontSize: 12,
              color: "primary.main",
              '&:hover': {
                backgroundColor: "primary.extraLight",
                borderColor: "primary.main",
              },
            }}
          >
            Renew
          </Button>
          {/* <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(row.original); }}>
            <img src={Edit} style={{ height: 15 }} />
          </IconButton>
          <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(row.original); }}>
            <img src={Delete} style={{ height: 20 }} />
          </IconButton> */}
        </Box>
      ),
    },
  ];

  // ADD
  const addNewEntry = async (newData) => {
    try {
      // await createHosting(customerId, newData);
    } catch (err) {
      console.error("Error adding hosting:", err);
    }
  };

  // EDIT
  const updateEntry = async (id, updatedData) => {
    try {
      // await updateHosting(id, updatedData);
    } catch (err) {
      console.error("Error updating hosting:", err);
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
      // await deleteHosting(selectedRow.id);
    } catch (err) {
      console.error("Error deleting hosting:", err);
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

  const handleRowClick = (rowData) => {
    setSelectedProduct(rowData);
    setDrawerOpen(true);
  };

  return (
    <Box >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1
        }}
      >
        <Typography variant="h4" gutterBottom>
          Hosting
        </Typography>
        <CommonButton
          label="Add Hosting"
          onClick={() => {
            setSelectedRow(null);
            setOpenDialog(true);
          }}
        />
      </Box>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        maxHeight="calc(100vh - 280px)"
        // onRowClick={handleRowClick}
        skeletonRowCount={5}
      />

      {/* Pagination */}
      <CustomPagination
        count={data?.totalPages || 0}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      />

      {/* Add/Edit Dialog */}
      <HostingDetails
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        clientId={customerId}
        selectedWorkspaceId={selectedWorkspaceId}
        onSubmitAction={(formData) => {
          if (selectedRow) {
            updateEntry(selectedRow._id, formData);
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
        itemType="Hosting"
      />
      <DomainRenewal
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        productId={selectedProduct?.productId}
        userId={customerId}
        selectedProduct={selectedProduct}
      />
    </Box>
  );
};

export default CustomerHosting;
