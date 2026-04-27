import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import RazorpayDetails from "../../../components/settings/integrations/Razorpay-Create-Edit";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import CommonCheckbox from "../../../components/common/fields/NDE-Checkbox";
import {
  usePayments,
  useCreatePayment,
  useUpdatePayment,
  useDeletePayment
} from "../../../hooks/settings/payment-hooks";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";

const Razorpay = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data: paymentsResponse = {}, isLoading } = usePayments();
  const payments = paymentsResponse.data || [];

  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();
  const deletePayment = useDeletePayment();

  const tableData = payments.map((item) => ({
    id: item._id,
    type: item.type,
    vendor: item.vendor || "-",
    mode: item.env || "-",
    webhook_secret: item.webhook_secret || "-",
  }));

  // Open dialog for edit
  const handleEdit = (rowData) => {
    const fullData = payments.find((item) => item._id === rowData.id);
    setSelectedRow(fullData);
    setOpenDialog(true);
  };

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };


  const confirmDelete = () => {
    deletePayment.mutate(selectedRow.id);
    setDeleteModalOpen(false);
    setSelectedRow(null);
  };

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === tableData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tableData.map((row) => row.id));
    }
  };

const handleSubmit = async (data) => {
  const payload = {
    type: data.paymentType,
    vendor: data.vendor,
    env: data.mode === "live" ? "Live" : "Test",
    key: data.key,
    secret: data.secret,
    webhook_secret: data.webhook_secret,
    baseurl: data.baseurl,
    redirecturl: data.redirecturl,
    accno: data.accno,
    accname: data.accname,
    ifsc: data.ifsc,
    Branch: data.Branch,
    country: data.country,
  };

  try {
    if (selectedRow) {
      await updatePayment.mutateAsync({ id: selectedRow._id, data: payload });
    } else {
      await createPayment.mutateAsync(payload);
    }

    setOpenDialog(false);
    setSelectedRow(null);
  } catch (error) {
    console.error("Payment API error:", error);
  }
};


  const columns = [
    // {
    //   id: "select",
    //   header: () => (
    //     <CommonCheckbox
    //       name="selectAll"
    //       checked={selectedIds.length === tableData.length && tableData.length > 0}
    //       indeterminate={
    //         selectedIds.length > 0 && selectedIds.length < tableData.length
    //       }
    //       onChange={toggleSelectAll}
    //       sx={{ p: 0 }}
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <CommonCheckbox
    //       name={`row-${row.original.id}`}
    //       checked={selectedIds.includes(row.original.id)}
    //       onChange={() => toggleCheckbox(row.original.id)}
    //       sx={{ p: 0 }}
    //       disabled={selectedRow?._id === row.original.id}
    //     />
    //   ),
    // },
    {
      accessorKey: "serial",
      header: "Id",
      cell: ({ row }) => row.index + 1,
    },
    { accessorKey: "type", header: "Type" },
    { accessorKey: "vendor", header: "Vendor" },
    { accessorKey: "mode", header: "Mode" },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => handleEdit(row.original)}>
            <img src={Edit} style={{ height: 16 }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original)}>
            <img src={Delete} style={{ height: 20 }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1 }}
      >
        <Typography variant="h4" gutterBottom>
          Manage Payment
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <CommonButton
            label={"Add Payment"}
            onClick={() => {
              setSelectedRow(null);
              setOpenDialog(true);
            }}
          />
        </Box>
      </Box>

      <ReusableTable
        columns={columns}
        data={tableData}
        selectedIds={selectedIds}
        isLoading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />

      <RazorpayDetails
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        onSubmitAction={handleSubmit}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deletePayment.isLoading}
        title="Payment"
        itemType={selectedRow?.type}
      />
    </Box>
  );
};

export default Razorpay;
