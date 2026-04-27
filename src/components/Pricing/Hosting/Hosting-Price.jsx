import { useEffect, useMemo, useState } from "react";
import { Box, Chip, Stack, TableCell, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonButton from "../../../components/common/NDE-Button";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
import HostingCreateEdit from "./Hosting-Create-Edit";
import { useDeleteProduct, useProducts } from "../../../hooks/products/products-hooks";
import RowActions from "../../common/NDE-CustomMenu";
import CommonFilter from "../../common/NDE-CommonFilter";
import { CommonCheckbox } from "../../common/fields";
import ActionBar from "../../common/NDE-ActionBar";
import CreateSuite from "../../Applications/SuitePortion/CreateSuite";

const productFilter = [
  { label: "All", value: "all" },
  { label: "App", value: "app" },
  { label: "G Suite", value: "gsuite" },
  { label: "Plesk", value: "plesk" },
];

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pleskFilter = searchParams.get("type");

  useEffect(() => {
    if (!pleskFilter) {
      setSearchParams({ type: "all" }, { replace: true });
    }
  }, [pleskFilter, setSearchParams]);

  const appliedFilter = pleskFilter || "all";
  const showCheckbox = appliedFilter === "app";

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const { data: tableData, isLoading } = useProducts(appliedFilter);
  const { mutate: handleDeleteProduct, isPending: deleting } = useDeleteProduct();
  const [suiteopendialog, setSuiteOpendialog] = useState(false);


  useEffect(() => {
    if (!showCheckbox) {
      setSelectedIds([]);
    }
  }, [showCheckbox]);

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "-";

  const transformedData = Array.isArray(tableData)
    ? tableData.map((product) => ({
      id: product._id,
      productType: product.type || "N/A",
      productName: product.product_name || "N/A",
      hsn_code: product.hsn_code || "N/A",
      desc: product.desc || "-",
      ...product,
    }))
    : [];

  const toggleSelectAll = () => {
    if (selectedIds.length === transformedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(transformedData.map((row) => row._id));
    }
  };

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const checkboxColumn = {
    id: "select",
    header: () => (
      <CommonCheckbox
        name="selectAll"
        checked={
          selectedIds.length === transformedData.length &&
          transformedData.length > 0
        }
        indeterminate={
          selectedIds.length > 0 &&
          selectedIds.length < transformedData.length
        }
        onChange={toggleSelectAll}
        sx={{ p: 0 }}
      />
    ),
    cell: ({ row }) => (
      <TableCell
        onClick={(e) => e.stopPropagation()}
        sx={{ p: 0, border: "none" }}
      >
        <CommonCheckbox
          name={`row-${row.original._id}`}
          checked={selectedIds.includes(row.original._id)}
          onChange={() => toggleCheckbox(row.original._id)}
          sx={{ p: 0 }}
        />
      </TableCell>
    ),
  };

  const columns = useMemo(
    () => [
      ...(showCheckbox ? [checkboxColumn] : []),
      {
        accessorKey: "productType",
        header: "Product Type",
        cell: ({ row }) => (
          <Typography sx={{ color: "#2330E7", fontWeight: 500 }}>
            {capitalize(row.original.productType)}
          </Typography>
        ),
      },
      {
        accessorKey: "productName",
        header: "Product Name",
      },
      {
        accessorKey: "hsn_code",
        header: "HSN Code",
      },
      {
        accessorKey: "desc",
        header: "Description",
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) =>
          row.original.isActive ? (
            <Chip label="Active" color="success" size="small" />
          ) : (
            <Chip label="Inactive" color="error" size="small" />
          ),
      },
    ],
    [showCheckbox, selectedIds, transformedData]
  );

  const handleFilterChange = (value) => {
    setSearchParams({ type: value });
  };

  const handleDelete = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedProductData(row);
    setOpenCreateDialog(true);
  };

  const confirmDelete = () => {
    if (!selectedRow) return;
    handleDeleteProduct(selectedRow.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedRow(null);
      },
    });
  };

  return (
    <Box>
      {selectedIds.length > 0 ? (
        <ActionBar
          selectedCount={selectedIds.length}
          actions={[{
            label: "Create Suite", onClick: () => {
              setSuiteOpendialog(true);
            },
          }]}
          onClose={() => setSelectedIds([])}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            p: 1,
          }}
        >
          <Typography variant="h4">Products</Typography>
          <CommonButton
            label="Create Products"
            onClick={() => {
              setSelectedProductData(null);
              setOpenCreateDialog(true);
            }}
          />
        </Box>
      )}

      <ReusableTable
        columns={columns}
        data={transformedData}
        isLoading={isLoading}
        topComponent={
          <Stack direction="row" justifyContent="space-between">
            <CommonFilter
              menuOptions={productFilter}
              value={appliedFilter}
              onChange={handleFilterChange}
            />
          </Stack>
        }
        // onRowClick={(row) => navigate(`/pricing/hosting/${row._id}`)}
        onRowClick={(row) => {
          const currentParams = Object.fromEntries(searchParams.entries());
          const paramsWithId = { ...currentParams };
          const queryString = new URLSearchParams(paramsWithId).toString();
          navigate(`/pricing/hosting/${row._id}?${queryString}`);
        }}
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
                key: "delete",
                label: "Delete",
                icon: <img src={Delete} style={{ height: 20 }} />,
                onClick: handleDelete,

              },
            ]}
          />
        )}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleting}
        itemType={selectedRow?.productName}
        title="Product"
      />

      <HostingCreateEdit
        initialData={selectedProductData}
        openCreateDialog={openCreateDialog}
        setOpenCreateDialog={setOpenCreateDialog}
      />
      <CreateSuite
        open={suiteopendialog}
        setOpen={setSuiteOpendialog}
        // initialData={selectedRow}
        selectedProduct={selectedIds}
      />
    </Box>
  );
};

export default Products;
