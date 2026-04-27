import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
  Select,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ActionBar from "../../../components/common/NDE-ActionBar"; 

const tabRoutes = ["overview", "transactions", "history"];

// ✅ Give every row a stable id
const customers = [
  { id: "iphone", name: "IPhone", rate: "60,000" },
  { id: "realme", name: "Realme", rate: "18,000" },
];

const customerFilters = [
  { label: "All Items", value: "allItems" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const OrderDeatils = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [filter, setFilter] = useState("allItems");

  const [selectedIds, setSelectedIds] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/products/item/details") {
      navigate("/products/item/details/overview", { replace: true });
    }
  }, [location.pathname, navigate]);

  const currentTabFromUrl = tabRoutes.findIndex((tab) =>
    location.pathname.includes(tab)
  );
  const currentTab = currentTabFromUrl >= 0 ? currentTabFromUrl : 0;

  const handleTabChange = (_e, newTab) => {
    navigate(`/products/item/details/${tabRoutes[newTab]}`);
  };

  // ✅ Master checkbox: select all ids
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(customers.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  // ✅ Toggle a single id
  const handleSelectCustomer = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreateItem = () => {
    navigate(`/products/item/create`);
  };

  const isBulkMode = selectedIds.length > 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: {
          xs: "89vh", 
          sm: "88vh", 
          md: "89vh", 
          lg: "89vh",
          xl: "89vh", 
        },
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
          background: "#fff",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          maxHeight: { xs: "40vh", md: "100vh" },
          overflowY: "auto",
        }}
      >
        {isBulkMode ? (
          <ActionBar
            selectedCount={selectedIds.length}
            onClose={() => setSelectedIds([])}
            actions={[
            {
              label: "Bulk Actions",
              menuItems: [
                { label: "Archive", onClick: () => alert("Archive clicked") },
                { label: "Move", onClick: () => alert("Move clicked") },
                { label: "Duplicate", onClick: () => alert("Duplicate clicked") },
              ],
            },
          ]}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              borderBottom: "1px solid #EBEBEF",
            }}
          >
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              variant="standard"
              disableUnderline
              sx={{ color: "#4D4F5C" }}
            >
              {customerFilters.map((f) => (
                <MenuItem key={f.value} value={f.value}>
                  {f.label}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              size="small"
              onClick={handleCreateItem}
              sx={{
                minWidth: 0,
                borderRadius: "6px",
                backgroundColor: "primary.main",
                textTransform: "none",
                color: "primary.contrastText",
                px: 1,
                py: 0.5,
                boxShadow: "none",
                "&:hover": { backgroundColor: "primary.main", boxShadow: "none" },
              }}
            >
              <AddIcon fontSize="small" />
            </Button>
          </Box>
        )}

        {/* Column header row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#EBEBEF",
            px: 2.3,
            py: 0.5,
            flexShrink: 0,
          }}
        >
          <Checkbox
            size="small"
            checked={selectedIds.length === customers.length && customers.length > 0}
            indeterminate={
              selectedIds.length > 0 && selectedIds.length < customers.length
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
            Name
          </Typography>
          <IconButton size="small">
            <MoreVertIcon fontSize="small" sx={{ color: "#000334B2" }} />
          </IconButton>
        </Box>

        {/* List */}
        <List disablePadding>
          {customers.map((customer) => (
            <React.Fragment key={customer.id}>
              <ListItem
                sx={{
                  cursor: "pointer",
                  borderBottom: "1px solid #E9E9F8",
                  backgroundColor:
                    selectedCustomer.id === customer.id ? "#F7F7F8" : "transparent",
                  "&:hover": { backgroundColor: "#F7F7F8" },
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    size="small"
                    checked={selectedIds.includes(customer.id)}
                    onChange={() => handleSelectCustomer(customer.id)}
                    sx={{
                      color: "#000334B2",
                      "&.Mui-checked": { color: "#000334B2" },
                    }}
                  />
                </ListItemIcon>

                <ListItemText
                  onClick={() => setSelectedCustomer(customer)}
                  primary={customer.name}
                  secondary={customer.rate}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxHeight: { xs: "50vh", md: "100vh" },
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Typography sx={{ fontSize: "20px", color: "#000", fontWeight: 700 }}>
            {selectedCustomer.name}
          </Typography>

          <Box>
            <IconButton
              size="small"
              color="inherit"
              sx={{
                mr: 1,
                border: "1px solid #D1D1D1",
                borderRadius: "8px",
                backgroundColor: "#F7F7F8",
                "&:hover": { backgroundColor: "#F7F7F8" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="inherit"
              size="small"
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
          sx={{
            borderBottom: "1px solid #E0E0E0",
            "& .MuiTab-root": {
              textTransform: "none",
              color: "#8A8AA3",
              "&.Mui-selected": { color: "#4752EB" },
            },
            "& .MuiTabs-indicator": {
              display: "flex",
              justifyContent: "center",
              backgroundColor: "transparent",
            },
            "& .MuiTabs-indicatorSpan": {
              maxWidth: 40,
              width: "100%",
              backgroundColor: "#4752EB",
              borderRadius: "3px",
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Transactions" />
          <Tab label="History" />
        </Tabs>

        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default OrderDeatils;
