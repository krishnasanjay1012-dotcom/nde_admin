import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";

import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
import NewTaxModal from "../../../components/Sales/Invoices/New Component/NewTaxModal";
import {
  useDeleteGstTaxes,
  useGetGstTaxes,
} from "../../../hooks/tax/tax-hooks";

const GstTaxes = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [edit, setEdit] = useState(false);

  const { data: taxesData, isLoading } = useGetGstTaxes();
  const gstTaxes = taxesData?.data || [];
  const deleteMutation = useDeleteGstTaxes();

  const tableData = gstTaxes.map((item) => ({
    id: item._id,
    taxName: item.tax_name,
    taxRate: item.rate,
    isDefault: item.status,
    tax_type: item.tax_type,
    taxCategory: item.taxCategory,
  }));

  const handleEdit = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
    setEdit(true);
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
    { accessorKey: "taxName", header: "Tax Name" },
    { accessorKey: "taxRate", header: "Tax Rate (%)" },
    { accessorKey: "taxCategory", header: "Tax Category" },

    {
      accessorKey: "isDefault",
      header: "Status",
    },

    {
      id: "action",
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

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
        }}
      >
        <Typography variant="h4">GST Taxes</Typography>

        <CommonButton
          label="Create GST Tax"
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

      <NewTaxModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        initialData={selectedRow}
        edit={edit}
        setEdit={setEdit}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteMutation.isLoading}
        itemType="GST Tax"
        title="GST Tax"
      />
    </Box>
  );
};

export default GstTaxes;
