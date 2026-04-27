import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Skeleton,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";
import CommonSelect from "../../../components/common/fields/NDE-Select";
import ActionBar from "../../../components/common/NDE-ActionBar";

const ItemTable = () => {
  const [customerType, setCustomerType] = useState("allItems");
  const navigate = useNavigate();

  const customerOptions = [
    { label: "All Items", value: "allItems" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          sx={{
            color: "#000334B2",
            "&.Mui-checked": { color: "#000334B2" },
            "&.MuiCheckbox-indeterminate": { color: "#000334B2" },
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
          sx={{ color: "#000334B2", "&.Mui-checked": { color: "#000334B2" } }}
        />
      ),
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "rate", header: "Rate" },
    { accessorKey: "accountName", header: "Account Name" },
    { accessorKey: "usageUnit", header: "Usage Unit" },
    { accessorKey: "description", header: "Description" },
  ];




  const handleCellClick = () => {
    navigate(`/products/item/details`);
  };

  const handleItemCreate = () => {
    navigate(`/products/item/create`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Top Controls */}
      {selectedRows.length > 0 ? (
        <ActionBar
          // selectedCount={selectedRows.length}
          actions={[
            { label: "Mark as Active", onClick: () => console.log("Active") },
            { label: "Mark as Inactive", onClick: () => console.log("Inactive") },
            { label: "Delete", onClick: () => console.log("Delete"), color: "error" },
          ]}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 1,
          }}
        >
          <CommonSelect
            options={customerOptions}
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
            width="200px"
          />
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: "6px",
              backgroundColor: "primary.main",
              textTransform: "none",
              color: "primary.contrastText",
              width: { xs: "100%", sm: "auto" },
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={handleItemCreate}
          >
            <AddRoundedIcon />
            New
          </Button>
        </Box>
      )}
      <ReusableTable
        columns={columns}
        maxHeight="calc(100vh - 180px)"
        onRowClick={handleCellClick}
      />
    </Box>
  );
};

export default ItemTable;
