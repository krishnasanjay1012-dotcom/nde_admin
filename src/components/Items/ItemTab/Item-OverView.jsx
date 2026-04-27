import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  Skeleton,
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import CommonImagePreview from "../../../components/common/NDE-ImagePreview";
import { useGetItemInfo } from "../../../hooks/Items/Items-hooks";
import {
  useUploadItemLogo,
  useRemoveItemLogo,
} from "../../../hooks/Items/Items-hooks";
import Delete from "../../../assets/icons/delete.svg";

const ItemOverview = ({ selectedItem }) => {
  const { data: itemData, isLoading } = useGetItemInfo(selectedItem?._id);
  const item = itemData?.data || {};

  const { mutate: uploadLogo, isLoading: uploading } = useUploadItemLogo();
  const { mutate: removeLogo, isLoading: removing } = useRemoveItemLogo();

  const [openDelete, setOpenDelete] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const currencySymbol = item?.currency?.symbol || "₹";

  useEffect(() => {
    if (item?.logo) {
      setImageSrc(item.logo);
    } else {
      setImageSrc(null);
    }
  }, [item]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("logo", file);

    uploadLogo(
      { id: selectedItem?._id, data: formData },
      {
        onError: () => {
          setImageSrc(item?.logo || null);
        },
      }
    );
  };

  const handleDeleteImage = () => {
    removeLogo(
      { id: selectedItem?._id },
      {
        onSuccess: () => {
          setImageSrc(null);
          setOpenDelete(false);
        },
      }
    );
  };

  const renderRow = (label, value) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 1,
      }}
    >
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
      {isLoading ? (
        <Skeleton width={120} height={20} />
      ) : (
        <Typography variant="body1" fontWeight={400}>
          {value}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box mx={2} mt={2}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* LEFT SIDE */}
        <Box sx={{ flex: 1 }}>
          {/* BASIC INFO */}
          <Box mb={3}>
            {renderRow("Item Type", item?.type?.toUpperCase() || "-")}
            {renderRow("Unit", item?.unit || "-")}
            {renderRow("Tax", item?.tax?.tax_name || "-")}
            {renderRow("Status", item?.status || "-")}
          </Box>

          <Divider />

          {/* SALES INFO */}
          <Box mt={2}>
            <Typography fontWeight={600} mb={1}>
              Sales Information
            </Typography>

            {renderRow(
              "Selling Price",
              item?.rate ? `${currencySymbol}${item.rate}` : "Not for sale"
            )}

            {renderRow(
              "Sales Account",
              item?.account?.accountName || "-"
            )}

            {renderRow(
              "Description",
              item?.description || "-"
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* PURCHASE INFO */}
          <Box>
            <Typography fontWeight={600} mb={1}>
              Purchase Information
            </Typography>

            {renderRow(
              "Cost Price",
              item?.purchaseRate
                ? `${currencySymbol}${item.purchaseRate}`
                : "Not for purchase"
            )}

            {renderRow(
              "Purchase Account",
              item?.purchaseAccount?.accountName || "-"
            )}

            {renderRow(
              "Vendor",
              item?.vendor
                ? `${item.vendor.first_name} ${item.vendor.last_name}`
                : "-"
            )}

            {renderRow(
              "Description",
              item?.purchaseDescription || "-"
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* REPORTING */}
          <Typography fontWeight={600}>Reporting Tags</Typography>
          {isLoading ? (
            <Skeleton width="80%" height={20} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              No reporting tag has been associated with this item.
            </Typography>
          )}
        </Box>

        {/* RIGHT SIDE IMAGE */}
        <Box sx={{ width: { xs: "100%", md: 300 } }}>
          <Box
            sx={{
              border: "1px dashed #ccc",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
            }}
          >
            {isLoading ? (
              <Skeleton variant="rectangular" width="100%" height={200} />
            ) : imageSrc ? (
              <Box
                onClick={() => setOpenPreview(true)}
                sx={{
                  position: "relative",
                  borderRadius: 1,
                  overflow: "hidden",
                  cursor: "pointer",
                  // height: 200,
                  "&:hover .overlay": { opacity: 1 },
                }}
              >
                <Box
                  component="img"
                  src={imageSrc}
                  alt="Preview"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />

                <Box
                  className="overlay"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "0.3s",
                  }}
                >
                  <VisibilityIcon sx={{ color: "#fff" }} />
                </Box>
              </Box>
            ) : (
              <Box
                component="label"
                sx={{
                  height: 120,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "#888",
                }}
              >
                <ImageOutlinedIcon sx={{ fontSize: 40 }} />
                <Typography>Upload Image</Typography>

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Box>
            )}

            {/* ACTION BUTTONS */}
            <Box display="flex" justifyContent="space-between" mt={1} mb={-1.5}>
              <Button component="label" disabled={uploading}>
                {uploading ? "Uploading..." : "Change"}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              <IconButton
                onClick={() => setOpenDelete(true)}
                disabled={removing || !imageSrc}
              >
                <img src={Delete} height={20} alt="delete" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* DELETE MODAL */}
      <CommonDeleteModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirmDelete={handleDeleteImage}
        deleting={removing}
        itemType="Image"
      />

      {/* IMAGE PREVIEW */}
      <CommonImagePreview
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        src={imageSrc}
      />
    </Box>
  );
};

export default ItemOverview;