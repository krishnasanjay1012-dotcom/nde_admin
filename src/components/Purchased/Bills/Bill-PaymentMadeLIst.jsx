import { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";

import { useDeleteBillPayment } from "../../../hooks/purchased/bills-hooks";

const PaymentMadeList = ({ data, isLoading }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [finalDeleteOpen, setFinalDeleteOpen] = useState(false);

  const { mutate: deleteBillPayment, isPending: deleting } = useDeleteBillPayment();

  const columns = [
    {
      accessorKey: "paymentNo",
      header: "Payment No",
    },
    {
      accessorKey: "formattedAmount",
      header: "Amount",
    },
    {
      accessorKey: "paymentMode",
      header: "Payment Mode",
      cell: ({ row }) => row.original.paymentMode?.name || "-",
    },
    {
      accessorKey: "formattedPaymentDate",
      header: "Payment Date",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original?.status;
        return (
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: status === "paid" ? "success.main" : "warning.main",
              textTransform: "capitalize",
            }}
          >
            {status === "paid" ? "Paid" : "Draft"}
          </Typography>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => handleEdit(row.original)}>
            <img src={Edit} style={{ height: 15 }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original)}>
            <img src={Delete} style={{ height: 20 }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setCreditModalOpen(true); 
  };

  const handleCreditConfirm = () => {
    setCreditModalOpen(false);
    setFinalDeleteOpen(true); 
  };

  const confirmDelete = () => {
    if (selectedRow) {
      deleteBillPayment(selectedRow._id, {
        onSuccess: () => {
          setFinalDeleteOpen(false);
          setSelectedRow(null);
        },
      });
    }
  };

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
  };

  return (
    <Box>
      <ReusableTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />

      <CommonDeleteModal
        open={creditModalOpen}
        onClose={() => setCreditModalOpen(false)}
        onConfirmDelete={handleCreditConfirm}
        title="Credit to Vendor"
        itemType={`The amount of ${selectedRow?.formattedAmount || 0} will be credited as credits to the vendor. Would you like to proceed?`}
      />

      <CommonDeleteModal
        open={finalDeleteOpen}
        onClose={() => setFinalDeleteOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleting}
        title="Payment"
      />
    </Box>
  );
};

export default PaymentMadeList;