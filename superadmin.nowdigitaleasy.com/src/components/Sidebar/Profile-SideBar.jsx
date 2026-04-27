import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  Divider,
  Link,
  Stack,
  Button,
} from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useAdminId } from "../../utils/session";
import { useAdminDetailsById } from "../../hooks/auth/login";
import CorporateFareRoundedIcon from '@mui/icons-material/CorporateFareRounded';
import ShutterSpeedIcon from '@mui/icons-material/ShutterSpeed';

import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import { Skeleton } from "@mui/material";


import { useNavigate } from "react-router-dom";
import ThemePanel from "./Theme-Panel";

const productCards = [
  {
    title: "NDE Vision Now (CRM)",
    subtitle: "Customer Relationship Management",
    icon: <CorporateFareRoundedIcon sx={{ fontSize: 30 }} />,
  },
  {
    title: "NDE Drive",
    subtitle: "Cloud Storage & File Sharing",
    icon: <CloudOutlinedIcon sx={{ fontSize: 30 }} />,
  },
  {
    title: "NDE MAIL",
    subtitle: "Business Email Platform",
    icon: <MailOutlineOutlinedIcon sx={{ fontSize: 30 }} />,
  },
  {
    title: "NDE CHAT",
    subtitle: "Team Messaging & Collaboration",
    icon: <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 30 }} />,
  },
];

const ProfileSideBar = ({ open, onClose, handleLogout }) => {
  const navigate = useNavigate();

  const adminId = useAdminId();
  const { data, isLoading } = useAdminDetailsById({
    id: adminId,
    open,
  });

  const profile = data?.data || {}


  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      PaperProps={{
        sx: {
          width: 400,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}>
        {/* Profile Info */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {isLoading ? (
              <Skeleton variant="rounded" width={48} height={48} />
            ) : (
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  color: "#FFF",
                  bgcolor: "primary.main",
                }}
              >
                {profile?.username?.charAt(0)?.toUpperCase()}
              </Avatar>
            )}

            <Box>
              {isLoading ? (
                <>
                  <Skeleton width={180} height={20} />
                  <Skeleton width={220} height={20} sx={{ mt: 0.5 }} />
                </>
              ) : (
                <>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    color="text.secondary"
                    fontSize={16}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 300,
                    }}
                  >
                    {profile?.username
                      ? profile.username.charAt(0).toUpperCase() +
                      profile.username.slice(1)
                      : "-"}
                  </Typography>

                  <Typography variant="subtitle1" fontWeight={500}>
                    {profile?.emailId || "-"}
                  </Typography>
                </>
              )}
            </Box>
          </Stack>

          <IconButton size="small" onClick={onClose} color="error">
            <CloseIcon fontSize="small" sx={{ color: "error.main" }} />
          </IconButton>
        </Stack>
        <Box display="flex">
          {isLoading ? (
            <Skeleton width={250} height={20} />
          ) : (
            <>
              {/* <Typography
                variant="body1"
                color="text.secondary"
                mb={0.5}
                title={profile?._id}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 200,
                }}
              >
                User ID: {profile?._id}
              </Typography> */}

              {/* <span style={{ marginRight: 11 }}>•</span> */}

              <Typography variant="body1" color="text.secondary" mb={1}>
                Designation: {profile?.designation}
              </Typography>
            </>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Account Links */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Link
            href="#"
            underline="hover"
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin");
              onClose();
            }}
          >
            Add New User
          </Link>
          <Link
            href="#"
            underline="hover"
            color="error"
            onClick={handleLogout}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <ExitToAppIcon sx={{ fontSize: 16, color: 'error.main' }} />
            Sign Out
          </Link>
        </Stack>
        {/* <Divider sx={{ mb: 2 }} /> */}

        {/* Trial Info */}
        {/* <Box
          sx={{
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            p: 1,
            mb: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: "background.muted",
              borderRadius: 1,
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <ShutterSpeedIcon sx={{ fontSize: 15 }} />
            <Typography variant="body2" color="text.secondary">
              Your trial plan <strong>Expires in 11 day(s)</strong>
            </Typography>
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="body1" color="text.secondary">
              Current trial plan
            </Typography>
            <Link href="#" underline="hover">
              Try Other Editions
            </Link>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "success.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                <CorporateFareRoundedIcon sx={{ color: 'icon.light', fontSize: 16 }} />
              </Box>

              <Typography variant="body1" >
                Enterprise Edition
              </Typography>
            </Stack>

            <Button
              variant="outlined"
              size="small"
              sx={{
                textTransform: "uppercase",
                fontWeight: 500,
                borderColor: "#F59E0B",
                color: "#F59E0B",
                "&:hover": {
                  borderColor: "#D97706",
                  backgroundColor: "transparent",
                },
              }}
            >
              Upgrade
            </Button>
          </Stack>
        </Box> */}

        <Divider sx={{ mb: 2 }} />
        <ThemePanel />
        <Divider sx={{ mb: 2, mt: 2 }} />

        {/* <Typography variant="body1" fontSize={16} mb={2}>
          All NDE Apps
        </Typography> */}
        {/* <Box
          sx={{
            pr: 1,
          }}
        >
          {/* Tips Sections */}
          {/* <Stack spacing={2}>
            {productCards.map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 1,
                  borderRadius: 3,
                  bgcolor: "background.muted",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.iconColor,
                  }}
                >
                  {item.icon}
                </Box>

                <Box>
                  <Typography fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.subtitle}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack> */}
        {/* </Box> */} 
      </Box>
    </Drawer>
  );
};

export default ProfileSideBar;