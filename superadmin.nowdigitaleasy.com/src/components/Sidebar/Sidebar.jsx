import React, { useState, useEffect, cloneElement } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Popover,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  HomeOutlined,
  SettingsOutlined,
  ShoppingCartOutlined,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import Menuicon from "../../assets/icons/menu-icon.svg";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NextWeekOutlinedIcon from '@mui/icons-material/NextWeekOutlined';
import ProjectLogo from "../../assets/log/project-logo.svg";
import Logo from "../../assets/icons/logo.svg";

const menuItems = [
  { text: "Home", icon: <HomeOutlined />, path: "/home" },
  {
    text: "Customers",
    icon: <PeopleAltOutlinedIcon />,
    path: "/customers",
  },
  {
    text: "Product",
    icon: <CategoryOutlinedIcon />,
    path: "/products",
    // expandable: true,
    subItems: [
      // { label: "Applications", path: "/products/applications" },
      // { label: "Domain", path: "/domain" },
      // { label: "G-Suite", path: "/pricing/g-suite" },
      { label: "Products", path: "/products" },
    ],
  },
  {
    text: "Items",
    icon: <NextWeekOutlinedIcon />,
    expandable: true,
    subItems: [
      { label: "Items", path: "/items" },
    ],
  },
  {
    text: "Sales",
    icon: <ShoppingCartOutlined />,
    expandable: true,
    subItems: [
      // { label: "Orders", path: "/sales/order" },
      { label: "Invoices", path: "/sales/invoices" },
      { label: "Subscriptions", path: "/sales/subscriptions" },
      { label: "Payments Received", path: "/sales/payments" },
    ],
  },
  {
    text: "Purchased",
    icon: <LocalMallOutlinedIcon />,
    expandable: true,
    subItems: [
      { label: "Vendors", path: "/purchased/vendors" },
      { label: "Bills", path: "/purchased/bills" },
      { label: "Payments Made", path: "/purchased/payments" },
      { label: "G-Suite Transactions", path: "/g-suite-transactions" },
    ],
  },
  {
    text: "Accountant",
    icon: <ManageAccountsIcon />,
    expandable: true,
    subItems: [
      { label: "Accounts", path: "/accountant/accounts" },
    ],
  },
  {
    text: "Report",
    icon: <AssessmentOutlinedIcon />,
    expandable: true,
    subItems: [
      // { label: "Total Service", path: "/report/total-service" },
      // { label: "Renewal Report", path: "/report/renewal" },
      { label: "Purchased Product", path: "/report/purchasedProduct" },
      // { label: "G-Suite", path: "/report/g-suite" },
      // { label: "Domain", path: "/report/domain" },
      // { label: "Hosting", path: "/report/hosting" },
      // { label: "Overdue", path: "/report/overdue" },
      // { label: "Tax", path: "/pricing/tax" },
    ],
  },
  {
    text: "Settings",
    icon: <SettingsOutlined />,
    expandable: true,
    subItems: [
      { label: "General", path: "/settings/general" },
      { label: "Integration", path: "/settings/integration" },
      { label: "Communication", path: "/settings/communication" },
      { label: "SMS", path: "/settings/sms" },
      // { label: "Transaction Series", path: "/settings/transaction-series" },
      { label: "Configuration", path: "/settings/configuration" },
      { label: "User", path: "/settings/admin" },
      { label: "Template", path: "/settings/dns"},
      { label: "Free - Switch", path: "/settings/freeSwitch" },
    ],
  },

];

export default function Sidebar() {
  const theme = useTheme();
  const [expandedItem, setExpandedItem] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverItems, setPopoverItems] = useState([]);
  const [popoverTitle, setPopoverTitle] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const isMobileOrTablet = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    setCollapsed(isMobileOrTablet);
  }, [isMobileOrTablet]);

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  useEffect(() => {
    const activeParent = menuItems.find(
      (item) =>
        item.expandable && item.subItems?.some((sub) => isActive(sub.path)),
    );
    if (activeParent) setExpandedItem(activeParent.text);
  }, [location.pathname]);

  const handleToggle = (text) => {
    setExpandedItem((prev) => (prev === text ? "" : text));
  };

  const handleNavigation = (path) => {
    if (location.pathname === path) return;
    navigate(path);
  };

  const handlePopoverOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setPopoverItems(item.subItems || []);
    setPopoverTitle(item.text);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverItems([]);
  };

  const handleCollapseToggle = () => {
    if (!collapsed) {
      setExpandedItem("");
    }
    setCollapsed((prev) => !prev);
  };

  const renderMenu = () => (
    <Box
      sx={{
        width: collapsed ? 80 : 200,
        display: "flex",
        flexDirection: "column",
        p: 0.5,
        transition: "width 0.3s ease",
        overflow: "hidden",
        position: "relative",
        borderTopRightRadius: 8,
      }}
    >
      {/* Menu List */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          transition: "all 0.3s ease",
          maxHeight: "calc(100vh - 60px)",
        }}
      >
        <List
          sx={{
            transition: "all 0.3s ease",
            width: "100%",
          }}
        >
          {menuItems.map((item) => {
            const hasActiveChild =
              item.expandable &&
              item.subItems?.some((sub) => isActive(sub.path));
            const parentActive =
              hasActiveChild || (!item.expandable && isActive(item.path));

            return (
              <React.Fragment key={item.text}>
                {collapsed ? (
                  <Box
                    onClick={(event) => {
                      if (item.expandable) {
                        handlePopoverOpen(event, item);
                      } else {
                        handleNavigation(item.path);
                      }
                    }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                      mb: 0.5,
                      bgcolor: parentActive ? "primary.main" : "inherit",
                      color: parentActive ? "icon.main" : "text.primary",
                      px: 1,
                      py: 1,
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: parentActive ? "primary.main" : "action.hover",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: parentActive ? "icon.light" : "grey.6",
                        // mb: 0.5,
                      }}
                    >
                      {cloneElement(item.icon, {
                        sx: {
                          color: parentActive ? "icon.light" : "grey.6",
                          fontSize: 22,
                          transition: "all 0.3s ease",
                        },
                      })}
                    </Box>

                    <Box
                      sx={{
                        fontSize: 11,
                        fontWeight: 400,
                        color: parentActive ? "icon.light" : "text.primary",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.text}
                    </Box>
                  </Box>
                ) : (
                  <>
                    <ListItemButton
                      onClick={() => {
                        if (item.expandable) {
                          handleToggle(item.text);
                        } else {
                          handleNavigation(item.path);
                        }
                      }}
                      sx={{
                        borderRadius: "8px",
                        mb: 0.5,
                        bgcolor: parentActive ? "primary.main" : "inherit",
                        color: parentActive ? "icon.main" : "text.primary",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        px: 2,
                        height: 38,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: parentActive ? "primary.main" : "action.hover",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 20,
                          mr: 1.5,
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                          color: parentActive ? "icon.light" : "grey.6",
                        }}
                      >
                        {cloneElement(item.icon, {
                          sx: {
                            color: parentActive ? "icon.light" : "grey.6",
                            fontSize: 24,
                            transition: "all 0.3s ease",
                          },
                        })}
                      </ListItemIcon>

                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: 400,
                          color: parentActive ? "icon.light" : "text.primary",
                        }}
                      />

                      {item.expandable &&
                        (expandedItem === item.text ? (
                          <ExpandLess
                            sx={{
                              color: parentActive ? "icon.light" : "icon.main",
                              ml: "auto",
                              flexShrink: 0,
                              transition: "all 0.3s ease",
                            }}
                          />
                        ) : (
                          <ExpandMore
                            sx={{
                              color: parentActive ? "icon.light" : "icon.main",
                              ml: "auto",
                              flexShrink: 0,
                              transition: "all 0.3s ease",
                            }}
                          />
                        ))}
                    </ListItemButton>

                    {item.expandable && (
                      <Collapse
                        in={expandedItem === item.text}
                        timeout="auto"
                        unmountOnExit
                        sx={{
                          transition: "all 0.3s ease",
                        }}
                      >
                        <List
                          component="div"
                          disablePadding
                          sx={{
                            pl: 4,
                            transition: "all 0.3s ease",
                          }}
                        >
                          {item.subItems?.map((sub) => (
                            <ListItemButton
                              key={sub.label}
                              sx={{
                                py: 0.5,
                                pl: 4,
                                borderRadius: "6px",
                                mb: 0.3,
                                height: 34,
                                bgcolor: isActive(sub.path)
                                  ? "primary.light"
                                  : "inherit",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  bgcolor: isActive(sub.path)
                                    ? "primary.light"
                                    : "action.hover",
                                },
                              }}
                              onClick={() => handleNavigation(sub.path)}
                            >
                              <ListItemText
                                title={sub.label}
                                primary={sub.label}
                                primaryTypographyProps={{
                                  fontSize: 14,
                                  fontWeight: 400,
                                  color: isActive(sub.path)
                                    ? "text.white"
                                    : "text.primary",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  maxWidth: 150,
                                }}
                              />
                            </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </>
                )}
              </React.Fragment>
            );
          })}
        </List>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "center",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          PaperProps={{
            sx: {
              p: 1,
              borderRadius: 2,
              minWidth: 180,
              ml: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              backgroundColor: "background.paper",
              transition: "all 0.3s ease",
            },
          }}
        >
          <Box
            sx={{
              px: 1,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <ListItemText
              primary={popoverTitle}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 600,
                color: "text.primary",
              }}
            />
          </Box>

          <List dense>
            {popoverItems.map((sub) => {
              const active = isActive(sub.path);
              return (
                <ListItemButton
                  key={sub.label}
                  sx={{
                    py: 0.7,
                    borderRadius: 1,
                    mb: 0.4,
                    bgcolor: active ? "primary.light" : "transparent",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: active ? "primary.light" : "action.hover",
                      "& .MuiListItemText-primary": { color: active ? "text.white" : "text.primary" },
                    },
                  }}
                  onClick={() => {
                    handleNavigation(sub.path);
                    handlePopoverClose();
                  }}
                >
                  <ListItemText
                    primary={sub.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: active ? "text.white" : "text.primary",

                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Popover>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: collapsed ? 2 : 0,
          height: 60,
        }}
      >
        {/* Menu Icon */}
        {!isMobileOrTablet && (
          <Box
            sx={{
              ml: collapsed ? 1 : 2,
              display: "inline-flex",
              borderRadius: 2,
              transition: "background-color 0.2s ease",
              "&:hover": {
                bgcolor: "background.default",
                height: 40
              },
            }}
          >
            <Box
              onClick={handleCollapseToggle}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                p: 1,
              }}
            >
              <img
                src={Menuicon}
                alt="Menu"
                style={{
                  height: 20,
                  transition: "all 0.3s ease",
                  filter: theme.palette.mode === "dark" ? "invert(1)" : "none",
                }}
              />
            </Box>
          </Box>
        )}

        {/* Logo */}
        <Box
          onClick={() => navigate("/home")}
          sx={{
            display: "flex",
            alignItems: "center",
            transition: "all 0.3s ease",
            ml: collapsed ? 0 : 2,
            cursor: "pointer"
          }}
        >
          <img
            src={isMobileOrTablet ? Logo : collapsed ? null : ProjectLogo}
            style={{
              height: 40,
              transition: "all 0.3s ease",
            }}
          />
        </Box>
      </Box>

      <Box sx={{ flex: 1, mt: collapsed ? -1 : 0 }}>{renderMenu()}</Box>
    </Box>
  );
}
