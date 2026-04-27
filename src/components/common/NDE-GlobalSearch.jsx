import React, { useRef, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import ClearIcon from "@mui/icons-material/Clear";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

import FlowerLoader from "./NDE-loader";
import { InputBase, MenuItem, Select, Stack } from "@mui/material";

import SerachIcon from "../../assets/icons/search-icon.svg";
import { useGlobalSearch } from "../../hooks/auth/login";

const SEARCH_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Customer", value: "customer" },
  { label: "Domain", value: "reseller" },
  { label: "G-suite", value: "gsuite" },
  { label: "Hosting", value: "plesk" },
  { label: "Invoice", value: "invoice" },
  { label: "App", value: "app" },
];

const HeaderSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [selectedModule, setSelectedModule] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);

  /* ---------------- Path Module Detection ---------------- */

  useEffect(() => {
    const path = location.pathname.toLowerCase();

    const pathModuleMap = [
      { match: "/customers", value: "customer" },
      { match: "/domain", value: "reseller" },
      { match: "/gsuite", value: "gsuite" },
      { match: "/hosting", value: "plesk" },
      { match: "/invoices", value: "invoice" },
      { match: "/apps", value: "app" },
    ];

    const matched = pathModuleMap.find((item) =>
      path.includes(item.match)
    );

    if (matched) {
      setSelectedModule(matched.value);
    } else {
      setSelectedModule("all");
    }
  }, [location.pathname]);

  const { data: results = [], isLoading } = useGlobalSearch({
    searchValue: debouncedValue,
    category: selectedModule,
  });


  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchValue.trim().length === 0) {
      setDebouncedValue("");
      setSearchOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      setDebouncedValue(searchValue);
      setSearchOpen(true);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [searchValue]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);


  const groupedData = useMemo(() => {
    if (!results?.data) {
      return {
        customer: [],
        reseller: [],
        gsuite: [],
        plesk: [],
        app: [],
        invoice: [],
      };
    }

    const {
      customer = [],
      reseller = [],
      gsuite = [],
      plesk = [],
      app = [],
      invoice = [],
    } = results.data;

    return { customer, reseller, gsuite, plesk, app, invoice };
  }, [results]);


  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleClearSearch = (e) => {
    e.stopPropagation();
    setSearchValue("");
    setSearchOpen(false);
    setDebouncedValue("");
    searchInputRef.current?.focus();
  };

  const handleSearchClose = () => setSearchOpen(false);

  const handleItemClick = (category, id) => {
    const tabMap = {
      customer: "overview",
      gsuite: "gsuite",
      app: "app",
      plesk: "hosting",
      reseller: "domain",
    };

    navigate(
      `/customers/details/${id}/${tabMap[category] || "overview"}?filter=&page=1&search=&sort=&customFilters=`
    );

    setSearchValue("");
    setDebouncedValue("");
    setSearchOpen(false);
    searchInputRef.current?.blur();
  };

  const handleInvoiceClick = (id) => {
    navigate(
      `/sales/invoices/details/${id}?page=1&limit=10&filter=allInvoice&search=&sort=`
    );

    setSearchValue("");
    setDebouncedValue("");
    setSearchOpen(false);
    searchInputRef.current?.blur();
  };


  const highlightText = (text, search) => {
    if (!text || !search) return text;

    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedSearch})`, "gi");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span
          key={index}
          style={{
            backgroundColor: "rgba(79,124,243,0.15)",
            color: "primary.light",
            fontWeight: 600,
            borderRadius: 4,
            padding: "0 2px",
          }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };


  const renderCategory = (title, items, categoryKey) => {
    if (!items?.length) return null;

    return (
      <Box sx={{ mb: -2 }}>
        <List sx={{ mt: 0.5, p: 0 }}>
          {items.map((item) => (
            <ListItem
              key={item._id}
              onClick={() => handleItemClick(categoryKey, item._id)}
              sx={{
                borderRadius: 2,
                px: 1,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(108,117,239,0.08)",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 32,
                    height: 32,
                  }}
                >
                  {(item.name || "?").charAt(0)}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Typography fontWeight={600}>
                    {highlightText(item.name || "Unknown", debouncedValue)}
                  </Typography>
                }
                secondary={
                  <Stack spacing={0.3}>
                    {item.companyName && (
                      <Typography variant="body2" color="text.secondary">
                        {highlightText(item.companyName, debouncedValue)}
                      </Typography>
                    )}

                    {item.email && (
                      <Typography variant="body2" color="text.secondary">
                        {highlightText(item.email, debouncedValue)}
                      </Typography>
                    )}

                    {(item.city || item.country) && (
                      <Typography variant="body2" color="text.secondary">
                        {highlightText(
                          item.city && item.country
                            ? `${item.city}, ${item.country}`
                            : item.country,
                          debouncedValue
                        )}
                      </Typography>
                    )}
                  </Stack>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };


  const renderInvoiceCategory = (items) => {
    if (!items?.length) return null;

    return (
      <Box sx={{ mb: -1 }}>
        <List sx={{ mt: 0.5, p: 0 }}>
          {items.map((item) => (
            <ListItem
              key={item._id}
              sx={{
                px: 2,
                py: 1.5,
                cursor: "pointer",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "rgba(79,124,243,0.06)",
                },
              }}
              onClick={() => handleInvoiceClick(item?.invoiceId)}
            >
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography fontWeight={500}>
                    {highlightText(item.name, debouncedValue)}
                  </Typography>

                  <Typography fontWeight={500}>
                    {item.symbol}
                    {item.invoiceAmount}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 0.5,
                  }}
                >
                  <Typography color="primary.main" fontWeight={500}>
                    {highlightText(item.invoiceNo, debouncedValue)}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color:
                        item.status === "paid"
                          ? "#2E7D32"
                          : item.status === "draft"
                            ? "text.secondary"
                            : "#FF6B00",
                    }}
                  >
                    {item.status.toUpperCase()}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  const noResults = Object.values(groupedData).every(
    (list) => list.length === 0
  );

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* Search Bar */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "background.paper",
          borderRadius: "10px",
          px: 2,
          py: 0.5,
          mt: 1,
          height: 44,
        }}
      >
        <img src={SerachIcon} alt="Search" style={{ width: 16, marginRight: 8 }} />

        <Select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          variant="standard"
          disableUnderline
          renderValue={() => null}
                    sx={{
            fontWeight: 500,
            color: "text.primary",
            mr: 1,
            ml: -3,
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            "& .MuiSelect-icon": {
              color: "primary.light",

            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                mt: 1.5,
                ml: 2,
                borderRadius: 2,
                boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
                maxHeight: 320,
              },
            },
            MenuListProps: {
              sx: {
                py: 0,
              },
            },
          }}
        >
          {SEARCH_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}sx={{
                fontSize: 14,
                py: 1.2,
                mx: 0.5,
                my: 0.5,
                borderRadius: 1,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                "&:hover": {
                  backgroundColor: "rgba(79,124,243,0.08)",
                },

                "&.Mui-selected": {
                  bgcolor: "primary.light",
                  color: "#fff",
                  "&:hover": {
                    bgcolor: "primary.light",
                  },
                },
              }}
            >
              {option.label}
              {selectedModule === option.value && (
                <DoneRoundedIcon sx={{ fontSize: 18, ml: 1, color: "inherit" }} />
              )}
            </MenuItem>
          ))}
        </Select>

        <InputBase
          inputRef={searchInputRef}
          placeholder={`Search in ${SEARCH_OPTIONS.find((o) => o.value === selectedModule)?.label
            }`}
          value={searchValue}
          onChange={handleSearchChange}
          sx={{ flex: 1 }}
          inputProps={{ "data-no-dirty": true }}
        />

        {searchValue && (
          <IconButton onClick={handleClearSearch} size="small">
            <ClearIcon sx={{ color: "#FF4D4F", fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      {/* Results */}

      {searchOpen && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1300,
            mt: 0.5,
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: "0px 10px 25px rgba(0,0,0,0.12)",
            maxHeight: 350,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
              bgcolor: "primary.light",
            }}
          >
            <Typography sx={{ fontWeight: 600, color: "white" }}>
              Search Results for "{debouncedValue}"
            </Typography>

            <IconButton onClick={handleSearchClose}>
              <ClearIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", p: 0.5 }}>
            {isLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <FlowerLoader size={20} />
              </Box>
            ) : (
              <>
                {renderCategory("Customers", groupedData.customer, "customer")}
                {renderInvoiceCategory(groupedData.invoice)}
                {renderCategory("GSuite", groupedData.gsuite, "gsuite")}
                {renderCategory("Apps", groupedData.app, "app")}
                {renderCategory("Plesk", groupedData.plesk, "plesk")}
                {renderCategory("Domain", groupedData.reseller, "reseller")}

                {noResults && (
                  <Box sx={{ textAlign: "center", py: 6 }}>
                    <Typography
                      sx={{ fontWeight: 600, color: "text.secondary" }}
                    >
                      No results found.
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default HeaderSearch;