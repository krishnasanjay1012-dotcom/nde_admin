import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";

import CommonSearchBar from "../common/fields/NDE-SearchBar";
import { CommonSelect } from "../common/fields";
import CommonButton from "../common/NDE-Button";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CommonDrawer from "../common/NDE-Drawer";
import DomainList from "./Domain-Product";

const products = [
  { id: 1, name: "Domain" },
  { id: 2, name: "Hosting" },
  { id: 3, name: "Google Workspace" },
  { id: 4, name: "App" },
];

export default function ProductSelector() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  const handleChooseProduct = (product) => {
    setActiveProduct(product);
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setActiveProduct(null);
  };

  return (
    <>
      <Box
        sx={{
          p: { xs: 1, md: 1 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 3,
        }}
      >
        {/* LEFT */}
        <Card sx={{ p: 2, borderRadius: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              mb: 1,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Choose Product
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <CommonSearchBar placeholder="Search" height={40} mt={0} mb={0} />
              <CommonSelect
                options={[
                  { label: "All", value: "All" },
                  { label: "Domain", value: "Domain" },
                  { label: "Hosting", value: "Hosting" },
                  { label: "Google Workspace", value: "Google Workspace" },
                  { label: "App", value: "App" },
                ]}
                height={40}
                mt={0}
                mb={0}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {products.map((item) => (
              <Card
                key={item.id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderColor: "primary.main",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1,
                      bgcolor: "#E0E0E0",
                    }}
                  />
                  <Box>
                    <Typography fontWeight={600} color="primary.main">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Configure and manage {item.name} services.
                    </Typography>
                  </Box>
                </Box>

                <CommonButton
                  onClick={() => handleChooseProduct(item)}
                  variant="contained"
                  startIcon
                  sx={{
                    height: 34,
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                  label="Choose"
                />
              </Card>
            ))}
          </Box>
        </Card>

        {/* RIGHT */}
        <Card sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Product Configuration
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {!activeProduct ? (
            <Typography color="text.secondary" align="center">
              Choose a product to configure
            </Typography>
          ) : (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#F5F7FF",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography fontWeight={500}>
                {activeProduct.name}
              </Typography>

              <IconButton size="small" onClick={handleCloseDrawer}>
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Card>
      </Box>

      {/* COMMON DRAWER */}
      <CommonDrawer
        open={openDrawer}
        onClose={handleCloseDrawer}
        title={activeProduct?.name}
        width={550}
        actions={[
          {
            label: "Cancel",
            variant: "outlined",
            onClick: handleCloseDrawer,
          },
          {
            label: "Next",
            onClick: () => {
              console.log("Next clicked for", activeProduct?.name);
            },
          },
        ]}
      >
        {activeProduct?.name === "Domain" && <DomainList />}

        {activeProduct?.name === "Hosting" && (
          <Typography>Hosting configuration goes here</Typography>
        )}

        {activeProduct?.name === "Google Workspace" && (
          <Typography>Google Workspace configuration goes here</Typography>
        )}

        {activeProduct?.name === "App" && (
          <Typography>App configuration goes here</Typography>
        )}
      </CommonDrawer>
    </>
  );
}
