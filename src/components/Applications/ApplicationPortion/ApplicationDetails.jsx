import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
  Button,
  IconButton,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import CommonDeleteModal from "../../common/NDE-DeleteModal";
import ActionBar from "../../common/NDE-ActionBar";
import CreateApplication from "./CreateApplication";
import CreatePlan from "../SuitePortion/CreatePlan";
import MoreDetailsDrawer from "./MoreDetailsDrawer";
import PlansPage from "./Application-RightPanel";
import FlowerLoader from "../../common/NDE-loader";
import CommonTextField from "../../common/fields/NDE-TextField";

import {
  useAppProducts,
  useDeleteApp,
  useDeleteAppProduct,
  useDeleteApps,
} from "../../../hooks/application/application-hooks";

const ApplicationDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [isAscending, setIsAscending] = useState(
    searchParams.get("sort") === "true" ? true : false
  );
  const selectedIdFromNav =
    searchParams.get("selectedId") || location.state?.selectedId || null;

  const [showSearch, setShowSearch] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [opendialog, setOpendialog] = useState(false);
  const [opendrawer, setOpendrawer] = useState(false);
  const [openmenu, setOpenmenu] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteProductModalOpen, setDeleteProductModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [planToEdit, setPlanToEdit] = useState(null);
  const [applicationToEdit, setApplicationToEdit] = useState(null);

  const searchInputRef = useRef(null);

  const { data, isLoading } = useAppProducts({
    isAscending,
    searchTerm: debouncedSearchTerm,
  });

  const deleteMutation = useDeleteAppProduct();
  const { mutate: deleteApps, isLoading: deletingProducts } = useDeleteApps();
  const { mutate: deleteApp, isLoading: singleDeleteLoading } = useDeleteApp(); 
  

  const products = data?.data || [];
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lastSelectedProduct, setLastSelectedProduct] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const params = {};
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (isAscending !== "") params.sort = isAscending;
    if (selectedProduct?.product?._id) params.selectedId = selectedProduct.product._id;

    setSearchParams(params);
  }, [debouncedSearchTerm, isAscending, selectedProduct, setSearchParams]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) searchInputRef.current.focus();
  }, [showSearch]);

  useEffect(() => {
    if (products.length > 0) {
      let initial = products[0];
      if (selectedIdFromNav) {
        const found = products.find((p) => p.product._id === selectedIdFromNav);
        if (found) initial = found;
      }
      setSelectedProduct(initial);
      setLastSelectedProduct(initial);
    } else {
      setSelectedProduct(null);
      setLastSelectedProduct(null);
    }
  }, [products, selectedIdFromNav]);

  const plansList = selectedProduct?.plans || [];

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(products.map((prod) => prod.product._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectProductCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectProductClick = (prod) => {
    setSelectedProduct(prod);
    setLastSelectedProduct(prod);
  };

  const isBulkMode = selectedIds.length > 0;

  const handleNew = () => {
    setPlanToEdit(null);
    setOpendialog(true);
  };

  const handleEdit = (plan) => {
    setPlanToEdit(plan);
    setOpendrawer(true);
  };

  const handleEditApplication = (app) => {
    const formattedApp = {
      appId: app._id,
      applogo: app?.productLogo || null,
      appname: app?.productName || "",
      appcategory: app?.ProductType || "",
      appdescription: app?.desc || "",
      appscreenshot: app?.sampleImage || null,
    };
    setApplicationToEdit(formattedApp);
    setOpendialog(true);
  };

  const handleDelete = (plan) => {
    setDeleteItem(plan);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      setDeleting(true);
      await deleteMutation.mutateAsync(deleteItem._id);
      setDeleteModalOpen(false);
      setDeleteItem(null);
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkInactive = () => alert("Mark as Inactive clicked!");
  const handleClone = () => alert("Clone clicked!");
  const handleShare = () => alert("Share Hosted Payment Page clicked!");
  const handleCreatePlan = () => {
    setPlanToEdit(null);
    setOpendrawer(true);
  };

  const toggleSort = () => {
    setIsAscending((prev) => !prev);
  };

  const handleSingleDeleteProduct = () => {
    if (!selectedProduct?.product) return;
    deleteApp([selectedProduct.product._id], {
      onSuccess: () => setDeleteProductModalOpen(false),
    });
  };

  const handleBulkDeleteProduct = () => {
    if (!selectedIds.length) return;
    deleteApps(selectedIds, {
      onSuccess: () => {
        setSelectedIds([]);
        setDeleteProductModalOpen(false);
      },
    });
  };



  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        maxHeight: "calc(100vh - 80px)",
        overflow: "hidden",
        p: 1,
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", md: 350 },
          borderRight: { md: "1px solid #EBEBEF" },
          borderBottom: { xs: "1px solid #EBEBEF", md: "none" },
          borderRadius: "8px",
          background: "primary.contrastText",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          maxHeight: { xs: "40vh", md: "100vh" },
        }}
      >
        {isBulkMode ? (
          <ActionBar
            selectedCount={selectedIds.length}
            onClose={() => setSelectedIds([])}
            actions={[
              {
                label: "Bulk Delete",
                onClick: () => setDeleteProductModalOpen(true),
                color: "error",
              },
            ]}
          />
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderBottom: "1px solid #EBEBEF",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", }}>
                <IconButton
                 onClick={() => {
                    const params = new URLSearchParams();
                    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
                    if (isAscending !== "") params.set("sort", isAscending);
                    if (selectedProduct?.product?._id) params.set("selectedId", selectedProduct.product._id);

                    navigate(`/products/applications?${params.toString()}`);
                  }}

                >
                  <ArrowBackIcon fontSize="small" color="primary" />
                </IconButton>

                <Typography variant="h5">Applications</Typography>
              </Box>

              {!showSearch ? (
                <IconButton
                  onClick={() => setShowSearch(true)}
                  sx={{
                    height: 30,
                    width: 35,
                    borderRadius: 1.5,
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.main" },
                  }}
                >
                  <SearchIcon sx={{ color: "icon.light" }} />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    setShowSearch(false);
                    setSearchTerm("");
                    if (lastSelectedProduct)
                      setSelectedProduct(lastSelectedProduct);
                  }}
                  sx={{
                    height: 30,
                    width: 35,
                    borderRadius: 1.5,
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.main" },
                  }}
                >
                  <CloseIcon sx={{ color: "icon.light" }} />
                </IconButton>
              )}

              <IconButton
                onClick={toggleSort}
                sx={{
                  height: 30,
                  width: 35,
                  borderRadius: 1.5,
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.main" },
                }}
              >
                <SwapVertRoundedIcon sx={{ color: "icon.light" }} />
              </IconButton>

              <Button
                onClick={handleNew}
                variant="contained"
                size="small"
                sx={{
                  minWidth: 0,
                  borderRadius: "6px",
                  bgcolor: "primary.main",
                  textTransform: "none",
                  color: "primary.contrastText",
                  px: 1,
                  py: 0.5,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "primary.main", boxShadow: "none" },
                }}
              >
                <AddIcon fontSize="small" sx={{ color: "icon.light" }} />
              </Button>
            </Box>

            <Collapse in={showSearch} orientation="vertical">
              <Box sx={{ px: 1 }}>
                <CommonTextField
                  inputRef={searchInputRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  startAdornment={
                    <SearchIcon fontSize="small" sx={{ color: "icon.main" }} />
                  }
                  placeholder="Search App"
                  width="100%"
                  autoFocus
                />
              </Box>
            </Collapse>
          </>
        )}

        {/* Header with Checkbox */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "background.default",
            px: 2,
            py: 0.5,
            flexShrink: 0,
          }}
        >
          <Checkbox
            size="small"
            checked={selectedIds.length === products.length && products.length > 0}
            indeterminate={
              selectedIds.length > 0 && selectedIds.length < products.length
            }
            onChange={handleSelectAll}
            sx={{
              color: "#000334B2",
              "&.Mui-checked": { color: "#000334B2" },
            }}
          />
          <Typography
            sx={{
              flexGrow: 1,
              fontSize: "14px",
              fontWeight: 500,
              color: "#000334B2",
            }}
          >
            Product Name
          </Typography>
          <IconButton size="small">
            <MoreVertIcon fontSize="small" sx={{ color: "#000334B2" }} />
          </IconButton>
        </Box>

        {/* Products List */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "60vh",
              }}
            >
              <FlowerLoader size={20} />
            </Box>
          ) : products.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
              }}
            >
              <Typography>No applications available</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {products
                .filter((prod) => prod.product.productName)
                .map((prod) => (
                  <React.Fragment key={prod.product._id}>
                    <ListItem
                      sx={{
                        cursor: "pointer",
                        borderBottom: "1px solid #E9E9F8",
                        backgroundColor:
                          selectedProduct?.product._id === prod.product._id
                            ? "background.default"
                            : "transparent",
                        "&:hover": { backgroundColor: "background.default" },
                      }}
                      onClick={() => handleSelectProductClick(prod)}
                    >
                      <ListItemIcon onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          size="small"
                          checked={selectedIds.includes(prod.product._id)}
                          onChange={() =>
                            handleSelectProductCheckbox(prod.product._id)
                          }
                          sx={{
                            color: "#000334B2",
                            "&.Mui-checked": { color: "#000334B2" },
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          prod.product.productName.charAt(0).toUpperCase() +
                          prod.product.productName.slice(1)
                        }
                        secondary={prod.product.desc}
                        primaryTypographyProps={{ variant: "body2", fontSize: 14 }}
                        secondaryTypographyProps={{ color: 'grey.2', fontSize: 12 }}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
            </List>
          )}
        </Box>
      </Box>

      {/* Right Panel */}
      {selectedProduct ? (
        <PlansPage
          selectedProduct={selectedProduct}
          plansList={plansList}
          isLoading={isLoading}
          handleEditApplication={handleEditApplication}
          handleCreatePlan={handleCreatePlan}
          handleEdit={handleEdit}
          handleMarkInactive={handleMarkInactive}
          handleClone={handleClone}
          handleDelete={handleDelete}
          handleShare={handleShare}
          isBulkMode={isBulkMode}
          setDeleteProductModalOpen={setDeleteProductModalOpen}
        />
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "text.secondary",
          }}
        >
          <Typography variant="body1">No application selected</Typography>
        </Box>
      )}

      <CreateApplication
        open={opendialog}
        setOpen={(val) => {
          setOpendialog(val);
          if (!val) setApplicationToEdit(null);
        }}
        initialData={applicationToEdit}
      />

      <CreatePlan
        open={opendrawer}
        setOpen={setOpendrawer}
        initialData={planToEdit}
        selectedProduct={selectedProduct}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        deleting={deleting}
        itemType={deleteItem?.planName || ""}
        title={"Plans"}
      />

      <CommonDeleteModal
        open={deleteProductModalOpen}
        onClose={() => setDeleteProductModalOpen(false)}
        onConfirmDelete={
          isBulkMode ? handleBulkDeleteProduct : handleSingleDeleteProduct
        }
        deleting={deletingProducts  || singleDeleteLoading}
        title={"Application"}
        itemType={
          isBulkMode
            ? `${selectedIds.length} products`
            : selectedProduct?.product?.productName || ""
        }
      />

      <MoreDetailsDrawer open={openmenu} setOpen={setOpenmenu} />
    </Box>
  );
};

export default ApplicationDetails;
