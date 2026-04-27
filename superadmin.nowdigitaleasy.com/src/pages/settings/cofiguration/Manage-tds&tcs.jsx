import { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import CommonButton from "../../../components/common/NDE-Button";

import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";

import { useTaxList } from "../../../hooks/products/products-hooks";
import { useDeleteTDS } from "../../../hooks/sales/invoice-hooks";
import UpsertTDS from "../../../components/Sales/Invoices/TDS/UpsertTDS";
import ReusableRadioGroup from "../../../components/common/fields/NDE-RadioButton";

const TaxList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getTypeFromURL = () =>
    searchParams.get("type")?.toUpperCase() === "TCS" ? "TCS" : "TDS";

  const [taxType, setTaxType] = useState(getTypeFromURL());

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);



  const { data: taxList, isLoading: taxLoading } = useTaxList({ taxType });
  const taxData = taxList?.data ?? [];

  const deleteMutation = useDeleteTDS();

  const tableData = taxData.map((item) => ({
    id: item._id,
    taxName: item.taxName,
    accountName: item.accountName,
    taxType: item.taxType,
  }));

  const handleTaxTypeChange = (e) => {
    const value = e.target.value;
    setTaxType(value);
    setSearchParams({ type: value.toLowerCase() });
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

  const handleCreate = () => {
    setSelectedRow(null);
    setIsEdit(false);
    setOpenDialog(true);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setIsEdit(true);
    setOpenDialog(true);
  };

  useEffect(() => {
    const typeParam = searchParams.get("type");

    if (!typeParam) {
      setSearchParams({ type: "tds" });
      setTaxType("TDS");
    } else {
      const type = typeParam.toUpperCase() === "TCS" ? "TCS" : "TDS";
      setTaxType(type);
    }
  }, [searchParams, setSearchParams]);

  const columns = [
    { accessorKey: "taxName", header: "Tax Name" },
    { accessorKey: "accountName", header: "Account Name" },
    { accessorKey: "taxType", header: "Tax Type" },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => handleEdit(row.original)}>
            <img src={Edit} style={{ height: 15 }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original)}>
            <img src={Delete} style={{ height: 18 }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mx: 1,
        }}
      >
        <Typography variant="h4">Tax Settings</Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <ReusableRadioGroup
            name="taxType"
            value={taxType}
            onChange={handleTaxTypeChange}
            options={[
              { label: "TDS", value: "TDS" },
              { label: "TCS", value: "TCS" },
            ]}
            row
          />

          <CommonButton label="Create Tax" onClick={handleCreate} />
        </Box>
      </Box>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={taxLoading}
        maxHeight="calc(100vh - 200px)"
      />

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteMutation.isLoading}
        itemType={selectedRow?.taxName || "Tax"}
        title="Tax"
      />

      {/* Create / Edit Dialog */}
      <UpsertTDS
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        isEdit={isEdit}
        editId={selectedRow?.id}
        taxType={taxType}
      />
    </Box>
  );
};

export default TaxList;