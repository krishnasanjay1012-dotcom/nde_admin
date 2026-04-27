import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
  Typography,
  Menu,
  Badge,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationIcon from "../../assets/icons/notification-icon.svg";
import { getUserSession, clearUserSession } from "../../utils/session";
import CommonDrawer from "../common/NDE-Drawer";
import NotificationsPanel from "../Notificaations/Notification";
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import HeaderSearch from "../common/NDE-GlobalSearch";
import { useNotifications } from "../../hooks/notification/notification-hooks";
import { useNotificationSound } from "../../hooks/notification/useNotificationSound";
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ProfileSideBar from "../Sidebar/Profile-SideBar";

const Header = () => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();
  const isUserActive = location.pathname === "/admin";
  const isUserProfile = location.pathname === "/user-profile";

  const page = 1;




  const { username, role } = getUserSession();
  const open = Boolean(anchorEl);

  const { data: notificationsData, isLoading: notifLoading, isFetching } = useNotifications(page);
  const unreadCount = notificationsData?.data?.docs.filter((n) => !n.read).length || 0;



  useNotificationSound(notificationsData?.data?.docs || [], (newNotif) => {
    setPopup(newNotif);
  });

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);
  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    clearUserSession();
    window.location.replace("/");
  };
  const handleClosePopup = () => setPopup(null);

  const handleUser = () => {
    navigate("/admin")
    handleCloseMenu()
  };

  const handleProfile = () => {
    navigate("/user-profile");
  };

  const menuItems = [
    {
      id: "user",
      label: "User",
      icon: <Person2RoundedIcon fontSize="small" />,
      onClick: handleUser,
      active: isUserActive,
    },
    // {
    //   id: "profile",
    //   label: "Profile",
    //   icon: <AccountCircleRoundedIcon fontSize="small" />,
    //   onClick: handleProfile,
    //   active :isUserProfile,
    // },
    {
      id: "logout",
      label: "Logout",
      icon: <LogoutIcon fontSize="small" />,
      onClick: handleLogout,
    },
  ];


  return (
    <>
      <AppBar position="static" elevation={0} color="transparent" >
        <Toolbar disableGutters
          sx={{
            minHeight: "50px !important",
            height: "50px",
            px: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>

          {/* Global Search */}
          <HeaderSearch />

          {/* Right-side actions */}
          <Box display="flex" alignItems="center" >
            {/* Notifications Badge */}
            <IconButton size="small" onClick={handleDrawerOpen}>
              <Badge badgeContent={unreadCount} color="error" overlap="circular"
                sx={{
                  "& .MuiBadge-badge": {
                    minWidth: 16,
                    height: 16,
                    fontSize: "10px",
                    padding: "0 4px",
                  },
                }}
              >
                <img
                  src={NotificationIcon}
                  alt="Notification"
                  style={{ cursor: "pointer", width: 28, height: 28 }}
                />
              </Badge>
            </IconButton>

            {/* Avatar + Menu */}
            <Box
              onClick={handleAvatarClick}
              display="flex"
              alignItems="center"
              sx={{ cursor: "pointer" }}
            >
              <Tooltip title={username ? username.charAt(0).toUpperCase() + username.slice(1) : "User"} arrow>
                <IconButton>
                  <Avatar sx={{ bgcolor: "primary.main", width: 34, height: 34, fontSize: 16, border: '2px solid #D5DBE580', color: 'icon.light' }}>
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>

            {/* Dropdown Menu */}
            {/* <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              PaperProps={{
                elevation: 3,
                sx: {
                  backgroundColor: "primary.contrastText",
                  borderRadius: "8px",
                  p: 1,
                  width: 200,
                  position: "relative",
                  overflow: "visible",
                  border: "1px solid #E0E0E0",
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    width: 10,
                    height: 10,
                    backgroundColor: "#FFFFFF",
                    top: 0,
                    left: "88%",
                    transform: "translateX(-50%) translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                    borderTop: "1px solid #E0E0E0",
                    borderLeft: "1px solid #E0E0E0",
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 600, color: "#000", fontSize: "0.9rem" }}>
                    {username ? username.charAt(0).toUpperCase() + username.slice(1) : "User"}
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "#6C6C89", lineHeight: 1, mt: 0.5 }}>
                    {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Role"}
                  </Typography>
                </Box>
              </Box>
              {menuItems.map((item) => (
                <Box
                  key={item.id}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{
                    cursor: "pointer",
                    p: 1,
                    mb: 0.5,
                    borderRadius: "8px",
                    backgroundColor: item.active ? "primary.extraLight" : "transparent",
                    "&:hover": { backgroundColor: "primary.extraLight" },
                  }}
                  onClick={() => {
                    handleCloseMenu();
                    item.onClick();
                  }}
                >
                  {item.icon}
                  <Typography sx={{ fontSize: "0.9rem" }}>{item.label}</Typography>
                </Box>
              ))}

            </Menu> */}
          </Box>
        </Toolbar>
      </AppBar>

      <ProfileSideBar
        open={open}
        onClose={handleCloseMenu}
        handleLogout={handleLogout}
      />

      {/* Notifications Drawer */}
      <CommonDrawer open={drawerOpen} onClose={handleDrawerClose} p={0} title={
        <Box display="flex" alignItems="center" gap={1}>
          <img
            src={NotificationIcon}
            alt="Notification"
            style={{ width: 26, height: 26 }}
          />
          Notifications
        </Box>
      }
        width={450}>
        <NotificationsPanel notifications={notificationsData?.data?.docs || []} isLoading={notifLoading || isFetching} />
      </CommonDrawer>

      {/* Notification Popup */}
      {popup && (
        <Snackbar
          open={!!popup}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={4000}
          onClose={handleClosePopup}
        >
          <Alert
            onClose={handleClosePopup}
            icon={false}
            sx={{
              borderRadius: 3,
              cursor: "pointer",
              background: "linear-gradient(135deg, #0288d1 30%, #03a9f4 90%)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <NotificationsActiveRoundedIcon
                sx={{
                  mr: 1,
                  fontSize: 28,
                  animation: "shake 1s ease",
                  color: 'icon.light',
                  "@keyframes shake": {
                    "0%": { transform: "rotate(0deg)" },
                    "20%": { transform: "rotate(-15deg)" },
                    "40%": { transform: "rotate(15deg)" },
                    "60%": { transform: "rotate(-10deg)" },
                    "80%": { transform: "rotate(10deg)" },
                    "100%": { transform: "rotate(0deg)" },
                  },
                }}
              />
              <Box>
                <Typography fontWeight={700} sx={{ color: "icon.light" }}>
                  {popup.type}
                </Typography>
                <Typography variant="body2" sx={{ color: "icon.light" }}>
                  {popup.message}
                </Typography>
              </Box>
            </Box>
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Header;
