import React, { useState } from "react";
import { Avatar, Box, Tooltip, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import BusinessIcon from "@mui/icons-material/Business";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import FlowerLoader from "../NDE-loader";
import CommonDrawer from "../NDE-Drawer";
import CommonTabs from "../NDE-No-Route-Tab";
import CommonOverview from "../NDE-CommonOverview";
import CommonHistory from "../NDE-CommonHistory";
import UnpaidInvoice from "../../../pages/sales/invoice/UnPaid-Invoice";

const CommonSelectedItem = ({
  listData,
  width = "auto",
  height = 40,
  mt = 1,
  mb = 2,
  title
}) => {

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setOpen(true);
    }, 500);
  };

  return (
    <>
      <Box
        sx={{
          width,
          height,
          mt,
          mb,
          bgcolor: "#454D66",
          position: "absolute",
          right: 9,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          cursor: "pointer",
          transition: "transform 0.3s ease",
          transformOrigin: "right",
          "&:hover": {
            bgcolor: "#383f54",
            transform: "scaleX(1.05)",
          },
        }}

        onClick={handleClick}
      >
        <Box>
            <Typography
              sx={{
                color: "icon.light",
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100px",
                mr: 1,
              }}
            >
              {listData?.first_name + " " + listData?.last_name}
            </Typography>

          {listData?.unpaidInvoiceCount > 0 && (
            <Typography
              sx={{
                color: "icon.light",
                fontSize: 12,
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                mr: 1,
              }}
            >
              {listData?.unpaidInvoiceCount} Unpaid Invoice
            </Typography>
          )}
        </Box>

        <Box display="flex" alignItems="center" flexShrink={0}>
          {!loading && (
            <KeyboardArrowRightIcon sx={{ color: "icon.light" }} />
          )}

          {loading && (
            <Box ml={1}>
              <FlowerLoader color={"#FFFF"} size={12} />
            </Box>
          )}
        </Box>
      </Box>

      <CommonDrawer
        open={open}
        onClose={() => setOpen(false)}
        title={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1
            }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
                color: "icon.light",
                bgcolor: "primary.main",
              }}
            >
              {`${listData?.first_name?.charAt(0)?.toUpperCase() || ""}${listData?.last_name?.charAt(0)?.toUpperCase() || ""
                }`}
            </Avatar>

            <Box>
              <Typography variant="subtitle1" fontWeight={400}>
                {title || "Customer"}
              </Typography>
              <Typography variant="h6">
                {`${listData?.first_name || ""} ${listData?.last_name || ""}`}
              </Typography>
            </Box>
          </Box>
        }
        width={500}
      >
        <Box display="flex" flexDirection="column" gap={0.5}>

          <Box display="flex" alignItems="center" gap={0.5}>
            <BusinessIcon sx={{ fontSize: 16 }} />
            <Typography fontSize={14}>
              {listData?.workspaceDetails?.workspace_name || listData?.companyName || "-"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={0.5}>
            <MailOutlineIcon sx={{ fontSize: 16 }} />
            <Typography fontSize={14}>
              {listData?.email || "-"}
            </Typography>
          </Box>
          <Box >

            <CommonTabs
              tabs={[
                { label: "Details", component: <CommonOverview data={listData} /> },

                ...(listData?.unpaidInvoiceCount > 0
                  ? [
                    {
                      label: "Unpaid Invoice",
                      component: <UnpaidInvoice data={listData} />,
                    },
                  ]
                  : []),

                { label: "History", component: <CommonHistory historyData={listData} title={title} /> },
              ]}
            />

          </Box>
        </Box>
      </CommonDrawer>
    </>
  );
};

export default CommonSelectedItem;