import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  IconButton,
  Skeleton,
} from "@mui/material";
import CommonButton from "../../common/NDE-Button";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CreateSuite from "./CreateSuite";
import { useNavigate } from "react-router-dom";
import {
  useAllSuites,
  useDeleteSuite,
  useUpdateSuite,
} from "../../../hooks/application/application-hooks";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import { useAdminId } from "../../../utils/session";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";

const SuitesTab = () => {
  const adminId = useAdminId(); 
  const [opendialog, setOpendialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState(null);
  const [editSuiteData, setEditSuiteData] = useState(null);
  const [productDeleteDialog, setProductDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductSuite, setSelectedProductSuite] = useState(null);

  const navigate = useNavigate();
  const { data, isLoading } = useAllSuites();
  const { mutate: deleteSuite, isPending } = useDeleteSuite();
  const updateSuiteMutation = useUpdateSuite();

  const suiteList = data?.data || [];

  const handleNavigatetosuite = (suiteId) => {
    if (!suiteId) return;
    navigate("/products/applications/suite-details", {
      state: { selectedId: suiteId },
    });
  };

  const handleDeleteConfirm = (suite) => {
    setSelectedSuite(suite);
    setDeleteDialog(true);
  };

  const handleDelete = () => {
    if (!selectedSuite) return;
    deleteSuite(selectedSuite?._id, {
      onSuccess: () => {
        setDeleteDialog(false);
        setSelectedSuite(null);
      },
    });
  };

  const handleEditSuite = (suite) => {
    setEditSuiteData(suite);
    setOpendialog(true);
  };

  const handleOpenProductDeleteModal = (suite, product) => {
    setSelectedProduct(product);
    setSelectedProductSuite(suite);
    setProductDeleteDialog(true);
  };

  const handleDeleteProductConfirm = async () => {
    if (!selectedProductSuite?._id || !selectedProduct?._id) return;

    const updatedProducts = selectedProductSuite.products
      .filter((p) => p._id !== selectedProduct._id)
      .map((p) => p._id);

    const payload = {
      _id: selectedProductSuite._id,
      suite_name: selectedProductSuite.suite_name,
      products: updatedProducts,
      created_by:adminId,
    };

    try {
      await updateSuiteMutation.mutateAsync( { id: selectedProductSuite._id, data: payload });
      setProductDeleteDialog(false);
      setSelectedProduct(null);
      setSelectedProductSuite(null);
    } catch (err) {
      console.error("❌ Failed to update suite:", err);
    }
  };

  const renderSkeletonLoader = () => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: 2,
        p: 2,
      }}
    >
      {[...Array(2)].map((_, i) => (
        <Card
          key={i}
          sx={{
            p: 2,
            borderRadius: 2,
            height: 240,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Skeleton
            variant="text"
            width="60%"
            height={28}
            animation="wave"
            sx={{ alignSelf: "center", mb: 2 }}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Skeleton variant="circular" width={28} height={28} animation="wave" />
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              p: 1,
              alignItems: "center",
            }}
          >
            {[...Array(3)].map((_, j) => (
              <Box
                key={j}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 2,
                  border: "1px solid #ddd",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="70%" height={20} />
              </Box>
            ))}
          </Box>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box >
      <Box sx={{ textAlign: "end" }}>
        <CommonButton
          label="Create Suite"
          onClick={() => {
            setEditSuiteData(null);
            setOpendialog(true);
          }}
        />
      </Box>

      {isLoading ? (
        renderSkeletonLoader()
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: 2,
            p: 1,
            maxHeight:"calc(98vh - 200px)",
            overflowY: "auto",
          }}
        >
          {suiteList.length > 0 ? (
            suiteList.map((group, idx) => (
              <Card
                key={idx}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  height: 240,
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  boxShadow: "5px 5px 15px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
                onClick={() => handleNavigatetosuite(group?._id)}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    color="#000"
                    sx={{
                      fontWeight: 600,
                      textAlign: "left",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "60%",
                    }}
                    title={group?.suite_name}
                  >
                    {group?.suite_name || "Untitled Suite"}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSuite(group);
                      }}
                    >
                      <img src={Edit} style={{ height: 16 }} />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConfirm(group);
                      }}
                    >
                       <img src={Delete} style={{ height: 20 }} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Product list */}
                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  {group?.products?.length > 0 ? (
                    group.products.map((app, i) => (
                      <Box
                        key={`${app._id || i}`}
                        sx={{
                          position: "relative",
                          width: 100,
                          height: 100,
                          borderRadius: 2,
                          boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #D1D1DB",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            background: "rgba(255,255,255,0.25)",
                            boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
                            "& .deleteIcon": { opacity: 1 },
                          },
                        }}
                      >
                        <IconButton
                          className="deleteIcon"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenProductDeleteModal(group, app); 
                          }}
                          sx={{
                            position: "absolute",
                            top: -4,
                            right: -4,
                            opacity: 0,
                            transition: "opacity 0.3s",
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>

                        <Box
                          component="img"
                          src={app?.productLogo || ""}
                          alt={app?.productName || "Product"}
                          sx={{
                            width: 60,
                            height: 40,
                            borderRadius: 1,
                            objectFit: "contain",
                            mb: 1,
                            border: "1px solid #ddd",
                            bgcolor: "#dbe0ff",
                          }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 500,
                            textAlign: "center",
                            maxWidth: "90px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.8rem",
                          }}
                          title={app?.productName}
                        >
                          {app?.productName || "Unnamed"}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", width: "100%" }}
                    >
                      No applications found
                    </Typography>
                  )}
                </Box>
              </Card>
            ))
          ) : (
            <Box
              sx={{
                gridColumn: "1 / -1",
                textAlign: "center",
                mt: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#f0f2f5",
                  width: 80,
                  height: 80,
                  mb: 2,
                }}
              >
                <FolderOpenIcon sx={{ fontSize: 40, color: "primary.main" }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                No Suites Available
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  mb: 3,
                  maxWidth: 400,
                  lineHeight: 1.6,
                }}
              >
                You haven’t created any suites yet. Suites help you organize and
                manage your applications efficiently.
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Suite Create/Edit Dialog */}
      <CreateSuite
        open={opendialog}
        setOpen={setOpendialog}
        initialData={editSuiteData}
      />

      {/* Suite Delete Modal */}
      <CommonDeleteModal
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirmDelete={handleDelete}
        deleting={isPending}
        itemType={selectedSuite?.suite_name || "Suite"}
        title={"Suite"}
      />

      <CommonDeleteModal
        open={productDeleteDialog}
        onClose={() => setProductDeleteDialog(false)}
        onConfirmDelete={handleDeleteProductConfirm}
        deleting={updateSuiteMutation.isPending}
        itemType={selectedProduct?.productName || "Application"}
        title={"Suite Paln"}
      />
    </Box>
  );
};

export default SuitesTab;
