import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import CommonButton from "../../common/NDE-Button";
import GSuiteDetails from "./Customer-Gsuite-Create-Edit";
import ReusableTable from "../../common/Table/ReusableTable";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import CustomPagination from "../../common/Table/TablePagination";
import { useGsuiteByClient } from "../../../hooks/Customer/Customer-hooks";
import DomainRenewal from "../../common/Domain-Renewal";
import GSuiteHistory from "../../Payments/G-Suite-Transactions/g-suite-history";

const CustomerGSuite = ({ selectedWorkspaceId }) => {
  const { customerId } = useParams();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);


  const { data, isLoading } = useGsuiteByClient({
    userId: customerId,
    page,
    limit: limit,
    workspace_Id: selectedWorkspaceId,
  });

  const tableData = (data?.data || []).map((item) => ({
    ...item,
    orderDate: item.orderDate ? new Date(item.orderDate).toLocaleDateString() : "-",
    expiryDate: item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "-",
  }));

  const columns = [
    {
      header: "Domain Name",
      cell: ({ row }) => row.original?.customerDomain || "-",
    },
    {
      header: "Plan Name",
      cell: ({ row }) => row.original?.planName || "-",
    },
    {
      header: "Status",
      cell: ({ row }) => row.original?.status || "-",
    },
    {
      header: "Purchased Liscence",
      cell: ({ row }) => row.original?.purchasedLiscence || "-",
    },
    // {
    //   header: "Liscence In Use",
    //   cell: ({ row }) => row.original?.liscenceInUse || "-",
    // },
    {
      header: "Order Date",
      cell: ({ row }) => row.original?.orderDate || "-",
    },
    {
      header: "Expiry Date",
      cell: ({ row }) => row.original?.expiryDate || "-",
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
    }
  ];


  // Add new entry
  const addNewEntry = async (newData) => {
    try {
      // await createGSuite(customerId, newData);
      // queryClient.invalidateQueries(["gsuiteByClient", customerId]);
    } catch (error) {
      console.error("Error creating GSuite:", error);
    }
  };

  // Update entry
  const updateEntry = async (id, updatedData) => {
    try {
      // await updateGSuite(id, updatedData);
      // queryClient.invalidateQueries(["gsuiteByClient", customerId]);
    } catch (error) {
      console.error("Error updating GSuite:", error);
    }
  };

  // Delete handlers
  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const handleRowClick = (rowData) => {
    setSelectedProduct(rowData);
    setDrawerOpen(true);
  };

  const handleDetails = (row) => {
    setSelectedProduct(row);
    setHistoryDrawerOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;
    try {
      // await deleteGSuite(selectedRow.id);
      // queryClient.invalidateQueries(["gsuiteByClient", customerId]);
    } catch (error) {
      console.error("Error deleting GSuite:", error);
    } finally {
      setDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };

  // Edit handler
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
          p: 1
        }}
      >
        <Typography variant="h4" gutterBottom>
          G-Suite
        </Typography>
        <CommonButton
          label="Add GSuite"
          onClick={() => {
            setSelectedRow(null);
            setOpenDialog(true);
          }}
        />
      </Box>

      {/* Table */}
      <ReusableTable columns={columns}
        data={tableData}
        isLoading={isLoading}
        maxHeight="calc(100vh - 300px)"
        onRowClick={(row) => { handleDetails(row) }}
        skeletonRowCount={5} />

      {/* Pagination */}
      <CustomPagination
        count={data?.totalDocs || 0}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      />

      {/* Add/Edit Dialog */}
      <GSuiteDetails
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        clientId={customerId}
        selectedWorkspaceId={selectedWorkspaceId}
        onSubmitAction={(data) => {
          if (selectedRow) {
            updateEntry(selectedRow.id, data);
          } else {
            addNewEntry(data);
          }
        }}
      />

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={false}
        itemType="GSuite"
      />

      <DomainRenewal
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        productId={selectedProduct?.productId}
        userId={selectedProduct?.clientId}
        selectedProduct={selectedProduct}
      />
      <GSuiteHistory
        open={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        domain={selectedProduct?.customerDomain}
      />
    </Box>
  );
};

export default CustomerGSuite;
