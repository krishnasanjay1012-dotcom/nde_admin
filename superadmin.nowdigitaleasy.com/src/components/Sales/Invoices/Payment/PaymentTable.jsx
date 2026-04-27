import { useState } from "react";
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

import Delete from "../../../../assets/icons/delete.svg";
import Edit from "../../../../assets/icons/edit.svg";
import RefundIcon from "@mui/icons-material/Replay";

import { useDeletePayment } from "../../../../hooks/sales/invoice-hooks";
import ReusableTable from "../../../common/Table/ReusableTable";
import CommonDeleteModal from "../../../common/NDE-DeleteModal";
import RowActions from "../../../common/NDE-CustomMenu";

const PaymentTable = ({ paymentData, isLoading, handleOpenRefund }) => {
  const { invoiceId } = useParams();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { mutate: deletePayment, isPending } = useDeletePayment(invoiceId);

  const columns = [
    {
      accessorKey: "payment_date",
      header: "Date",
      size: isMobile ? 120 : 150,
      cell: ({ row }) =>
        dayjs(row.original.payment_date).format("DD/MM/YYYY"),
    },
    {
      accessorKey: "PaymentNo",
      header: "Payment",
      size: isMobile ? 140 : 180,
      cell: ({ row }) => (
        <Typography
          sx={{
            color: "primary.main",
            cursor: "pointer",
            fontSize: isMobile ? 12 : 14,
            whiteSpace: "nowrap",
          }}
        >
          {row.original.PaymentNo}
        </Typography>
      ),
    },
    {
      accessorKey: "reference",
      header: "Reference",
      size: isMobile ? 140 : 180,
      cell: ({ row }) => (
        <Typography
          sx={{
            fontSize: isMobile ? 12 : 14,
            wordBreak: "break-word",
          }}
        >
          {row.original.reference || "-"}
        </Typography>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: isMobile ? 120 : 150,
      cell: ({ row }) => (
        <Typography
          sx={{
            color: "#1b5e20",
            fontWeight: 500,
            fontSize: isMobile ? 11 : 13,
            textTransform: "capitalize",
          }}
        >
          {row.original.status}
        </Typography>
      ),
    },
    {
      accessorKey: "paymentMode",
      header: "Mode",
      size: isMobile ? 120 : 160,
      cell: ({ row }) =>
        row.original?.paymentModeDetails?.name || "-",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      size: isMobile ? 140 : 180,
      cell: ({ row }) => (
        <Typography
          sx={{
            fontSize: isMobile ? 12 : 14,
            whiteSpace: "nowrap",
          }}
        >
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: row.original.currency || "INR",
          }).format(row.original.amount)}
        </Typography>
      ),
    },
  ];

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRow) {
      deletePayment(selectedRow._id, {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedRow(null);
        },
      });
    }
  };

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
  };

  const handleRefund = (rowData) => {
    setSelectedRow(rowData);
    handleOpenRefund(rowData);
  };

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <ReusableTable
        columns={columns}
        data={paymentData || []}
        isLoading={isLoading}
        // maxHeight={isMobile ? "60vh" : "250px"}
        HoverComponent={({ row }) => (
          <RowActions
            rowData={row.original}
            actions={[
              {
                key: "edit",
                label: "Edit",
                icon: <img src={Edit} style={{ height: 15 }} />,
                onClick: handleEdit,
              },
              {
                key: "refund",
                label: "Refund",
                icon: <span style={{ fontSize: 16 }}>↩</span>,
                onClick: handleRefund,
              },
              {
                key: "delete",
                label: "Delete",
                icon: <img src={Delete} style={{ height: 18 }} />,
                onClick: handleDelete,
              },
            ]}
          />
        )}
      />

      <CommonDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={isPending}
        title="Payment"
        warningMessage="Once you delete this payment, you will not be able to retrieve it."
      />
    </Box>
  );
};

export default PaymentTable;