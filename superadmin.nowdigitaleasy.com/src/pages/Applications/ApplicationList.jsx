import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  TableCell,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { MoreVertOutlined } from "@mui/icons-material";
import {
  CommonCheckbox,
  CommonTextField,
} from "../../components/common/fields";
import CommonButton from "../../components/common/NDE-Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateApplication from "../../components/Applications/ApplicationPortion/CreateApplication";
import ReusableTable from "../../components/common/Table/ReusableTable";
import CommonDrawer from "../../components/common/NDE-Drawer";
import CommonDeleteModal from "../../components/common/NDE-DeleteModal";
import {
  useAppProducts,
  useDeleteApps,
  useDeleteApp,
} from "../../hooks/application/application-hooks";
import SearchIcon from "@mui/icons-material/Search";
import ActionBar from "../../components/common/NDE-ActionBar";
import CreatePlan from "../../components/Applications/SuitePortion/CreatePlan";
import CreateSuite from "../../components/Applications/SuitePortion/CreateSuite";

const ApplicationList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchterm, setSearchterm] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchterm);
  const [isAscending, setIsAscending] = useState(false);

  const [opendialog, setOpendialog] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [drawerContent, setDrawerContent] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteIds, setDeleteIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [planDrawerOpen, setPlanDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [suiteopendialog, setSuiteOpendialog] = useState(false);


  const { data, isLoading } = useAppProducts({
    isAscending,
    searchTerm: debouncedSearch,
  });
  const { mutate: deleteApps, isLoading: deleteLoading } = useDeleteApps();
  const { mutate: deleteApp, isLoading: singleDeleteLoading } = useDeleteApp();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchterm);

      const params = {};
      if (searchterm) params.search = searchterm;
      params.sort = isAscending;
      setSearchParams(params);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchterm, isAscending]);

  const RowMenu = ({ row }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleOption = (action) => {
      const product = row.original?.product;
      switch (action) {
        case "view":
          setSelectedProduct(product || null);
          setPlanDrawerOpen(true);
          break;
        case "edit":
          if (product) {
            setInitialData({
              appId: product._id,
              applogo: product.productLogo || null,
              appname: product.productName || "",
              appcategory: product.ProductType || "",
              appdescription: product.desc || "",
              appscreenshot: product.sampleImage || null,
              groupId: product.groupId || "",
            });
            setOpendialog(true);
          }
          break;
        case "delete":
          if (product && selectedIds.length === 0) {
            setDeleteItem(product);
            setDeleteIds([product._id]);
            setDeleteModalOpen(true);
          }
          break;
        case "settings":
          setDrawerTitle("Application Settings");
          setDrawerContent(
            <div>Settings for {product?.productName || "Unknown App"}</div>
          );
          setDrawerOpen(true);
          break;
        default:
          break;
      }
      handleClose();
    };

    return (
      <>
        <IconButton onClick={handleClick} size="small">
          <MoreVertOutlined />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={() => handleOption("view")}>Add Plan</MenuItem>
          <MenuItem onClick={() => handleOption("edit")}>Edit</MenuItem>
          <MenuItem
            onClick={() => handleOption("delete")}
            disabled={selectedIds.length > 0}
            sx={{
              color: selectedIds.length > 0 ? "grey.400" : "text.primary",
              cursor: selectedIds.length > 0 ? "not-allowed" : "pointer",
            }}
          >
            Delete
          </MenuItem>
        </Menu>
      </>
    );
  };

  const handleNavtodetails = (row) => {
    const productId = row?.product?._id;
    if (productId) {
      const currentParams = Object.fromEntries(searchParams.entries());
      const paramsWithId = { ...currentParams, selectedId: productId };
      const queryString = new URLSearchParams(paramsWithId).toString();
      navigate(`/products/applications/application-details?${queryString}`);
    }
  };

  const rawData = Array.isArray(data?.data) ? data.data : [];
  const tableData =
    debouncedSearch?.trim() !== ""
      ? rawData.filter((row) => {
        const product = row?.product || {};
        const name = product.productName?.trim() || "";
        const type = product.ProductType?.trim() || "";
        const desc = product.desc?.trim() || "";
        const isAllEmpty = !name && !type && !desc;
        if (isAllEmpty) return false;
        const term = debouncedSearch.toLowerCase();
        return (
          name.toLowerCase().includes(term) ||
          type.toLowerCase().includes(term) ||
          desc.toLowerCase().includes(term)
        );
      })
      : rawData;

  const toggleCheckbox = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === tableData.length
        ? []
        : tableData.map((row) => row?.product?._id).filter(Boolean)
    );
  };

  const columns = [
    {
      id: "select",
      header: () => (
        <CommonCheckbox
          name="selectAll"
          checked={selectedIds.length === tableData.length && tableData.length > 0}
          indeterminate={
            selectedIds.length > 0 && selectedIds.length < tableData.length
          }
          onChange={toggleSelectAll}
          sx={{ p: 0 }}
        />
      ),
      cell: ({ row }) => (
        <TableCell onClick={(e) => e.stopPropagation()} sx={{ p: 0, border: "none" }}>
          <CommonCheckbox
            name={`row-${row.original?.product?._id}`}
            checked={selectedIds.includes(row.original?.product?._id)}
            onChange={() => toggleCheckbox(row.original?.product?._id)}
            sx={{ p: 0 }}
          />
        </TableCell>
      ),
    },
    {
      accessorKey: "appName",
      header: "App Name",
      cell: ({ row }) => row.original?.product?.productName || "—",
    },
    {
      accessorKey: "category",
      header: "App Category",
      cell: ({ row }) => row.original?.product?.ProductType || "—",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const text = row.original?.product?.desc || "";
        return text.length > 50 ? text.slice(0, 50) + "..." : text;
      },
    },
    {
      accessorKey: "actions",
      header: "More",
      cell: ({ row }) => (
        <TableCell onClick={(e) => e.stopPropagation()} sx={{ p: 0, border: "none" }}>
          <RowMenu row={row} />
        </TableCell>
      ),
    },
  ];

  const handleConfirmDelete = () => {
    if (!deleteIds.length) return;
    setDeleting(true);

    if (deleteIds.length === 1) {
      deleteApp(deleteIds[0], {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setDeleteItem(null);
          setDeleteIds([]);
          setSelectedIds([]);
        },
        onSettled: () => {
          setDeleting(false);
        },
      });
      return;
    }

    deleteApps(deleteIds, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setDeleteItem(null);
        setDeleteIds([]);
        setSelectedIds([]);
      },
      onSettled: () => {
        setDeleting(false);
      },
    });
  };

  const toggleSort = () => setIsAscending((prev) => !prev);




  return (
    <Box>
      {selectedIds.length > 0 ? (
        <ActionBar
          selectedCount={selectedIds.length}
          actions={[
            {
              label: "Delete",
              onClick: () => {
                setDeleteIds(selectedIds);
                setDeleteItem(null);
                setDeleteModalOpen(true);
              },
              color: "error",
            },
            {
              label: "Create Suite",
              onClick: () => {
                setInitialData(null);
                setSuiteOpendialog(true);
              },
            },
          ]}
          onClose={() => setSelectedIds([])}
        />
      ) : (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1}}>
          <Box>
            <CommonTextField
              value={searchterm}
              onChange={(e) => setSearchterm(e.target.value)}
              startAdornment={<SearchIcon fontSize="small" sx={{ color: "icon.main" }} />}
              placeholder="Search App"
              width="180px"
              mt={0}
              mb={1}
            />
          </Box>

          <CommonButton
            label="Create App"
            onClick={() => {
              setInitialData(null);
              setOpendialog(true);
            }}
          />
        </Box>
      )}

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        onRowClick={handleNavtodetails}
        maxHeight="calc(96vh - 200px)"
        sortableColumns={["appName"]}
        onSortChange={toggleSort}
      />

      {/* Create/Edit App Dialog */}
      <CreateApplication
        open={opendialog}
        setOpen={setOpendialog}
        initialData={initialData}
      />

      {/* Common Drawer */}
      <CommonDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerTitle}
        topWidth={1000}
        anchor="top"
      >
        {drawerContent}
      </CommonDrawer>

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        deleting={deleteLoading || singleDeleteLoading || deleting}
        title={"Application"}
        itemType={
          deleteItem?.productName ||
          (deleteIds.length > 1 ? "Selected Apps" : "App")
        }
      />

      {/* Create Plan */}
      <CreatePlan
        open={planDrawerOpen}
        setOpen={setPlanDrawerOpen}
        selectedProduct={selectedProduct}
      />

      <CreateSuite
        open={suiteopendialog}
        setOpen={setSuiteOpendialog}
        initialData={selectedProduct}
        selectedProduct={selectedIds}
      />
    </Box>
  );
};

export default ApplicationList;
