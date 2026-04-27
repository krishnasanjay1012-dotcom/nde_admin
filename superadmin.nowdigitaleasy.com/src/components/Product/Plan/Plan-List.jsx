import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Skeleton,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import {
  useDeletePlan,
  useUploadPlanProfile,
  useRemovePlanProfile,
} from "../../../hooks/products/products-hooks";

import BgImage from "../../../assets/image/images.svg";

import CommonDeleteModal from "../../common/NDE-DeleteModal";
import CommonDrawer from "../../common/NDE-Drawer";
import PlanDetails from "./Plan-Details";
import HostingPlan from "../Product-Hosting";

const PlansList = ({
  fetchedPlans = [],
  planLoading,
  handlePrice,
  handleEdit,
  handleClonePlan,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [plan, setPlan] = useState(null);
  const [specPlan, setSpecPlan] = useState(null);

  const [planImages, setPlanImages] = useState({});
  const [openSpecModal, setOpenSpecModal] = useState(false);
  const [specMode, setSpecMode] = useState("add");

  const fileInputRef = useRef(null);

  const { mutate: deletePlanMutate, isLoading: deleting } =
    useDeletePlan();

  const { mutate: uploadProfile } = useUploadPlanProfile();
  const { mutate: removeProfile } = useRemovePlanProfile();

  const plansList = fetchedPlans?.data || [];
  const isLoading = planLoading;

  const handleCardClick = (plan) => {
    setPlan(plan);
    setDrawerOpen(true);
  };

  const handleSpecClick = (plan) => {
    setSpecPlan(plan);

    if (plan?.specifications) {
      setSpecMode("edit");
    } else {
      setSpecMode("add");
    }

    setOpenSpecModal(true);
  };

  const handleCloseSpecModal = () => {
    setOpenSpecModal(false);
    setSpecPlan(null);
  };

  const handleDeleteClick = (plan) => {
    setSelectedPlan(plan);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedPlan) return;

    deletePlanMutate(selectedPlan._id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedPlan(null);
      },
    });
  };

  const handleImageClick = (planId) => {
    fileInputRef.current.dataset.planId = planId;
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const planId = e.target.dataset.planId;
    const file = e.target.files[0];
    if (!file || !planId) return;

    const previewUrl = URL.createObjectURL(file);
    setPlanImages((prev) => ({ ...prev, [planId]: previewUrl }));

    const formData = new FormData();
    formData.append("profile", file);

    uploadProfile(
      { planId, data: formData },
      {
        onError: () => {
          setPlanImages((prev) => {
            const copy = { ...prev };
            delete copy[planId];
            return copy;
          });
        },
      }
    );

    e.target.value = "";
  };

  const handleRemoveImage = (planId) => {
    removeProfile(planId, {
      onSuccess: () => {
        setPlanImages((prev) => {
          const copy = { ...prev };
          delete copy[planId];
          return copy;
        });
      },
    });
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        hidden
        onChange={handleFileChange}
      />

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        PLANS
      </Typography>

      <TableContainer>
        <Table>

          {/* Header */}
          <TableHead>
            <TableRow
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "background.muted"
                    : "#f9f9fb",
              }}
            >
              <TableCell sx={{ fontWeight: 400, fontSize: 13 }}>Plan Details</TableCell>
              <TableCell align="right" sx={{ fontWeight: 400, fontSize: 13 }}>
                Price
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
            {isLoading ? (
              Array.from({ length: 2 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton variant="rectangular" height={80} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="rectangular" width={80} height={30} />
                  </TableCell>
                </TableRow>
              ))
            ) : plansList.length ? (
              plansList.map((plan) => (
                <TableRow
                  key={plan._id}
                  hover
                  sx={{
                    cursor: "pointer",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                  onClick={() => handleCardClick(plan)}
                >

                  {/* Plan Details */}
                  <TableCell>
                    <Box display="flex" gap={2}>

                      {/* Image */}
                      <Box
                        sx={{
                          position: "relative",
                          width: 70,
                          height: 70,
                          borderRadius: 1,
                          cursor: "pointer",
                          "&:hover .upload-overlay": { opacity: 0.5 },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick(plan._id);
                        }}
                      >
                        <img
                          src={planImages[plan._id] || plan.profile || BgImage}
                          alt={plan.plan_name}
                          width={70}
                          height={70}
                          style={{
                            borderRadius: 6,
                            objectFit: "cover",
                          }}
                        />

                        <Box
                          className="upload-overlay"
                          sx={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 1,
                            bgcolor: "rgba(0,0,0,0.45)",
                            color: "#fff",
                            fontSize: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.2s ease",
                          }}
                        >
                          Upload
                        </Box>

                        {planImages[plan._id] && (
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: -10,
                              right: -10,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(plan._id);
                            }}
                          >
                            <CloseRoundedIcon
                              fontSize="small"
                              sx={{ color: "error.main" }}
                            />
                          </IconButton>
                        )}
                      </Box>

                      {/* Details */}
                      <Box>
                        <Typography variant="h6" mb={0.5}>
                          {plan.plan_name}
                        </Typography>

                        {["app", "suite"].includes(plan?.type) && (
                          <Typography variant="body2" color="text.secondary">
                            {plan?.trial_days || 0} day(s) free trial
                          </Typography>
                        )}
                        {plan.type === "gsuite" && (
                          <Typography variant="body2" color="text.secondary">
                            Max Users : {plan.max_users || 0}
                          </Typography>
                        )}

                        <Typography variant="subtitle2" color="primary" mt={1}
                          sx={{
                            "& span": {
                              cursor: "pointer",
                            },
                            "& span:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          <span onClick={(e) => { e.stopPropagation(); handleEdit(plan); }}>Edit</span>{" | "}
                          <span onClick={(e) => { e.stopPropagation(); handlePrice(plan); }}>Plan Price</span>{" | "}
                          <span onClick={(e) => { e.stopPropagation(); handleClonePlan(plan); }}>Clone</span>{" | "}
                          <span onClick={(e) => { e.stopPropagation(); handleDeleteClick(plan); }}>Delete</span>
                        </Typography>
                      </Box>

                    </Box>
                  </TableCell>

                  {/* Price */}
                  <TableCell align="right">
                    <Typography variant="h6">
                      {plan?.basePriceConfig?.currencyDetails?.symbol} {plan?.basePriceConfig?.register_price || 0}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      per {plan?.basePriceConfig?.billing_cycle}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {plan?.basePriceConfig?.currencyDetails?.symbol} {plan?.basePriceConfig?.setup_fee || 0} for initial setup
                    </Typography>

                    {plan?.type === "hosting" && (
                      <Typography
                        variant="body2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpecClick(plan);
                        }}
                        sx={{
                          mt: 1,
                          fontWeight: 800,
                          fontSize: "14px",
                          background:
                            "linear-gradient(45deg, #FFD700, #FFA000, #FF6F00)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Add Specification
                      </Typography>
                    )}
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <Box mt={2}>
                    <InfoOutlinedIcon fontSize="large" />
                    <Typography>No plans found</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </TableContainer>

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleting}
        itemType={selectedPlan?.plan_name}
        title="Plan"
      />

      {/* Drawer */}
      <CommonDrawer
        open={drawerOpen}
        anchor="right"
        width={600}
        onClose={() => {
          setDrawerOpen(false);
          setPlan(null);
        }}
      >
        <PlanDetails plan={plan} />
      </CommonDrawer>

      <HostingPlan
        open={openSpecModal}
        initialData={specPlan}
        mode={specMode}
        handleClose={handleCloseSpecModal}
      />
    </Box>
  );
};

export default PlansList;