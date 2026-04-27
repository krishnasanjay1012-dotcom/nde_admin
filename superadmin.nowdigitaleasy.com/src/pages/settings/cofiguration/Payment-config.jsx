
import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";

import { useAddPaymentTerm, useDeletePaymentTerm, usePaymentTerms, useUpdatePaymentTerm } from './../../../hooks/payment-terms/payment-terms-hooks';


import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
import PaymentTermCreateEdit from "./PaymentTerm-Create-Edit";
import LockIcon from "@mui/icons-material/Lock";
import { Tooltip } from "@mui/material";

const PaymentTerms = () => {

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data, isLoading } = usePaymentTerms();
  const paymentTermsData = data?.data || [];

  const { mutateAsync: AddPaymentTerm } = useAddPaymentTerm();
  const { mutateAsync: updateMutation } = useUpdatePaymentTerm();
  const deleteMutation = useDeletePaymentTerm();

  const tableData = paymentTermsData.map((item) => ({
    id: item._id,
    termName: item.termName,
    numberOfDays: item.numberOfDays,
    isDefault: item.isDefault,
    isSystem: item.isSystem

  }));

  const handleSubmit = async (data) => {

    const payload = {
      termName: data.termName,
      numberOfDays: Number(data.numberOfDays),
      isDefault: Boolean(data.isDefault)
    };

    try {

      if (selectedRow) {
        await updateMutation({
          id: selectedRow.id,
          data: payload
        });
      } else {
        await AddPaymentTerm(payload);
      }

      setOpenDialog(false);
      setSelectedRow(null);

    } catch (error) {
      console.log("Payment Term Error:", error);
    }
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleDelete = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedRow.id);
    setDeleteModalOpen(false);
    setSelectedRow(null);
  };

  const columns = [
    { accessorKey: "termName", header: "Term Name" },

    { accessorKey: "numberOfDays", header: "Number Of Days" },

    {
      accessorKey: "isDefault",
      header: "Default",
      cell: ({ row }) =>
        row.original.isDefault ? (
          <Typography
            sx={{
              background: "#E8EDFF",
              color: "#27AE60",
              px: 1,
              py: 0.3,
              borderRadius: "10px",
              fontSize: 12,
              fontWeight: 600,
              width: 55
            }}
          >
            Default
          </Typography>
        ) : "-"
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => {
        const { isSystem } = row.original;

        return (
          <Box sx={{ display: "flex", gap: 1 }}>

            {isSystem ? (
              <Tooltip title="System defined - cannot edit or delete">
                <LockIcon
                  sx={{
                    fontSize: 16,
                    color: "text.disabled",
                  }} />
              </Tooltip>
            ) : (
              <>
                <IconButton onClick={() => handleEdit(row.original)}>
                  <img src={Edit} style={{ height: 15 }} />
                </IconButton>

                <IconButton onClick={() => handleDelete(row.original)}>
                  <img src={Delete} style={{ height: 20 }} />
                </IconButton>
              </>
            )}

          </Box>
        );
      }
    }
  ];

  return (
    <Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1
        }}
      >
        <Typography variant="h4">
          Payment Terms
        </Typography>

        <CommonButton
          label="Create Payment Term"
          onClick={() => {
            setSelectedRow(null);
            setOpenDialog(true);
          }}
        />
      </Box>

      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />

      <PaymentTermCreateEdit
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        onSubmitAction={handleSubmit}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteMutation.isLoading}
        itemType="Payment Term"
        title="Payment Term"
      />

    </Box>
  );
};

export default PaymentTerms;