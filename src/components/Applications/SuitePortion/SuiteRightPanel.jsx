import { Box, IconButton, Typography } from "@mui/material";
import CommonButton from "../../common/NDE-Button";
import FlowerLoader from "../../common/NDE-loader";
import { InfoOutlineRounded } from "@mui/icons-material";
import { useState } from "react";
import CommonImagePreview from "../../common/NDE-ImagePreview";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import { useDeleteSuitePlan } from "../../../hooks/application/application-hooks";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";

const PlansPage = ({
  selectedProduct,
  isLoading,
  handleEditApplication,
  handleCreatePlan,
  handleEdit,
  handleClone,
  handleShare,
  isBulkMode,
  plansList,
  setDeleteProductModalOpen
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");
  // const [priceDrawerOpen, setPriceDrawerOpen] = useState(false);
  // const [selectedPlan, setSelectedPlan] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const deletePlanMutation = useDeleteSuitePlan();

  const handleImageClick = (src) => {
    setPreviewSrc(src);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewSrc("");
  };

  const handleOpenPriceDrawer = () => {
    // setSelectedPlan(plan);
    // setPriceDrawerOpen(true);
  };

  // const handleClosePriceDrawer = () => {
  //   setPriceDrawerOpen(false);
  //   setSelectedPlan(null);
  // };

  // Open delete modal
  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setDeleteModalOpen(true);
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    if (!planToDelete) return;
    try {
      await deletePlanMutation.mutateAsync(planToDelete._id);
      setDeleteModalOpen(false);
      setPlanToDelete(null);
    } catch (error) {
      console.error("Failed to delete plan", error);
    }
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", maxHeight: { xs: "50vh", md: "100vh" }, overflowY: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #ddd", height: "53px" }}>
        <Typography sx={{ fontSize: "20px", color: "#000", fontWeight: 700, p: 2 }}>
          {selectedProduct?.suite_name ? selectedProduct.suite_name.trim() : "Select a Suite"}
        </Typography>

        <Box sx={{ display: "flex", gap: "10px" }}>
           <IconButton
            onClick={() => handleEditApplication(selectedProduct)}
            sx={{ border: "1px solid #D1D1DB", borderRadius: 2, height: 41, color: isBulkMode ? "#B0B0B0" : "#919191", cursor: isBulkMode ? "not-allowed" : "pointer" }}
          >
            <img src={Edit} style={{ height: 17 }} />
          </IconButton>
          <IconButton
            onClick={() => setDeleteProductModalOpen(true)}
            disabled={isBulkMode}
            sx={{ border: "1px solid #D1D1DB", borderRadius: 2, height: 41, color: isBulkMode ? "#B0B0B0" : "#919191", cursor: isBulkMode ? "not-allowed" : "pointer" }}
          >
            <img src={Delete} style={{ height: 20 }} />
          </IconButton>
          <CommonButton label={"Add Plan"} variant="contained" onClick={handleCreatePlan} />
        </Box>
      </Box>

      {/* Summary & Plans Table */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", overflowY: "auto" }}>
        <Box sx={{ backgroundColor: "#f5f5f5", display: "flex", width: "100%", padding: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h3">{plansList.length}</Typography>
            <Typography variant="body1" color="text.secondary">Plans</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", width: "100%", padding: 2 }}>
          <Box sx={{ mb: "15px" }}>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>PLANS</Typography>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5", border: "1px solid #ddd" }}>
                  <th style={{ textAlign: "left", padding: "12px 15px", width: "70%" }}>Plan Details</th>
                  <th style={{ textAlign: "right", padding: "12px 15px", width: "30%" }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={2}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}>
                        <FlowerLoader size={20} />
                      </Box>
                    </td>
                  </tr>
                ) : plansList.length > 0 ? (
                  plansList.map((plan) => (
                    <tr key={plan._id}>
                      <td style={{ padding: "15px", verticalAlign: "top", position: "relative" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                          <img
                            src={plan.productLogo || "https://via.placeholder.com/60"}
                            alt={plan.productName}
                            style={{ width: "60px", height: "60px", borderRadius: "6px", cursor: "pointer", background: "#3651d4" }}
                            onClick={() => handleImageClick(plan.productLogo || "https://via.placeholder.com/600")}
                          />
                          <div style={{ flex: 1, paddingBottom: "10px" }}>
                            <Typography variant="h5">{plan.plan_name}</Typography>
                            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>{plan.description || "No description"}</Typography>
                            <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>
                              <span style={{ cursor: "pointer" }} onClick={() => handleEdit(plan)}>Edit</span>{" "}
                              {/* | <span style={{ cursor: "pointer" }} onClick={() => handleOpenPriceDrawer(plan)}>Plan Price</span>{" "} */}
                              {/* | <span style={{ cursor: "pointer" }} onClick={() => handleClone(plan)}>Clone</span>{" "} */}
                              | <span style={{ cursor: "pointer" }} onClick={() => handleDeleteClick(plan)}>Delete</span>{" "}
                              {/* | <span style={{ cursor: "pointer" }} onClick={() => handleShare(plan)}>Share</span> */}
                            </Typography>
                          </div>
                        </div>
                        <div style={{ position: "absolute", bottom: 0, left: "11px", right: 0, borderBottom: "1px solid #ddd" }}></div>
                      </td>

                      <td style={{ padding: "15px", verticalAlign: "top", textAlign: "right", position: "relative" }}>
                        <Typography variant="h6">Rs.{plan.price || 0}</Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>per month</Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Rs.{plan.setupFee || 0} for initial setup</Typography>
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderBottom: "1px solid #ddd" }}></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} style={{ textAlign: "center" }}>
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 10 }}>
                        <InfoOutlineRounded sx={{ fontSize: 50, color:'primary.main' }} />
                        <Typography variant="h6">No plans found for this suite.</Typography>
                        <Typography variant="body2">Click on "Add Plan" to create a new plan for this suite.</Typography>
                      </Box>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>

      {/* Image Preview */}
      <CommonImagePreview open={previewOpen} onClose={handleClosePreview} src={previewSrc} title="Product Image" />

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        deleting={deletePlanMutation.isLoading}
        itemType={planToDelete?.plan_name || ""}
        title={"Suite Plan"}
      />
    </Box>
  );
};

export default PlansPage;
