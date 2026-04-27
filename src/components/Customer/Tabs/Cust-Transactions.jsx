import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import ReusableTable from "../../common/Table/ReusableTable";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import CustomPagination from "../../common/Table/TablePagination";
import { usePaymentDetails } from "../../../hooks/Customer/Customer-hooks";
import CreateWalletTransaction from "./Wallet-Balance";
import OpeningBalance from "./Opening-Balance";
import CommonImagePreview from "../../common/NDE-ImagePreview";

import Edit from "../../../assets/icons/edit.svg";

const Transactions = ({ selectedWorkspaceId }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [openWalletDialog, setOpenWalletDialog] = useState(false);
  const [openCurrentDialog, setOpenCurrentDialog] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const { data, isLoading } = usePaymentDetails({
    workspace_Id: selectedWorkspaceId,
    page,
    limit,
  });

  const transactions = data?.data?.transactions || [];
  const balanceData = data?.data?.overalltotal || {};
  const pagination = data?.data?.pagination || {};
  

  const tableData = useMemo(() => {
    return transactions.map((item) => ({
      id: item._id,
      original: item,

      transactionName: item.transactionName || "-",
      referenceType: item.type || "-",

      credit:
        item.credit > 0
          ? new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(item.credit)
          : "-",

      debit:
        item.debit > 0
          ? new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(item.debit)
          : "-",

      amount: new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(item.amount || 0),

      transactionDate: item.date
        ? new Date(item.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "-",

      image: item.image || "",
    }));
  }, [transactions]);

  const columns = [
    { accessorKey: "transactionName", header: "Transaction Name" },
    {
      accessorKey: "referenceType",
      header: "Type",
      cell: ({ row }) => (
        <Typography
          sx={{
            fontWeight: 400,
            textTransform: "capitalize",
            color:
              row.original.referenceType === "credit"
                ? "success.main"
                : "error.main",
          }}
        >
          {row.original.referenceType}
        </Typography>
      ),
    },
    { accessorKey: "credit", header: "Credit" },
    { accessorKey: "debit", header: "Debit" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "transactionDate", header: "Date" },

    // ✅ IMAGE PREVIEW
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            cursor: row.original.image ? "pointer" : "default",
          }}
          onClick={() => {
            if (!row.original.image) return;
            setPreviewImage(row.original.image);
            setPreviewOpen(true);
          }}
        >
          <Avatar
            variant="square"
            src={row.original.image}
            sx={{
              width: 50,
              height: 30,
              border: "1px solid #e0e0e0",
              borderRadius: "6px",
              fontSize: 12,
            }}
          >
            {!row.original.image && "N/A"}
          </Avatar>
        </Box>
      ),
    },

    // ✅ ACTION
    {
      accessorKey: "action",
      header: "Actions",
      cell: ({ row }) => (
        <IconButton onClick={() => handleEdit(row.original)}>
          <img src={Edit} alt="edit" style={{ height: 15 }} />
        </IconButton>
      ),
    },
  ];

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenWalletDialog(true);
  };

  const confirmDelete = async () => {
    setDeleteModalOpen(false);
    setSelectedRow(null);
  };

  return (
    <Box sx={{ mt: 1 }}>
      {/* ✅ HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
        }}
      >
        <Typography variant="h4">Manage Transactions</Typography>

        <Stack direction="row" spacing={3} alignItems="center">
          {/* ✅ BALANCE DISPLAY */}
          <Tooltip title="Wallet Balance">
            <Box
              onClick={() => setOpenWalletDialog(true)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
              }}
            >
              <AccountBalanceWalletIcon sx={{ color: "primary.main" }} />

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color:
                    balanceData?.balance < 0
                      ? "error.main"
                      : "success.main",
                }}
              >
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(balanceData?.balance || 0)}
              </Typography>
            </Box>
          </Tooltip>

          {/* ✅ CREDIT / DEBIT SUMMARY */}
          <Stack direction="row" spacing={2}>
            <Typography color="success.main" fontSize={12}>
              Credit: ₹{balanceData?.totalCredit || 0}
            </Typography>

            <Typography color="error.main" fontSize={12}>
              Debit: ₹{balanceData?.totalDebit || 0}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        maxHeight="calc(100vh - 280px)"
        skeletonRowCount={5}
      />

      <CustomPagination
        count={pagination?.totalPages || 0}
        page={page - 1}
        rowsPerPage={limit}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={false}
        itemType="Transaction"
      />

      <CreateWalletTransaction
        open={openWalletDialog}
        setOpen={setOpenWalletDialog}
        selectedWorkspaceId={selectedWorkspaceId}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />

      <OpeningBalance
        open={openCurrentDialog}
        setOpen={setOpenCurrentDialog}
        selectedWorkspaceId={selectedWorkspaceId}
      />

      <CommonImagePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        src={previewImage}
        alt="Proof Image"
        width="600px"
        height="500px"
        bgcolor="#fff"
        borderRadius={4}
      />
    </Box>
  );
};

export default Transactions;