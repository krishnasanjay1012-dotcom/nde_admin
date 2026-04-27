import React, { useState } from "react";
import { Box, InputBase, Button, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const DomainSearch = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      // console.log("Searching domain:", query);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 900,
        mx: "auto",
        backgroundColor: "#fff",
        borderRadius: "6px",
        overflow: "hidden",
        border: '1px solid #D1D1D1',
        height: 42
      }}
    >
      <InputBase
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Find and Purchase a domain name"
        sx={{
          flex: 1,
          px: 2,
          height: 56,
          fontSize: "16px",
          "& input::placeholder": {
            fontSize: "12px",            
            opacity: 0.7,         
          },
        }}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      <Button
        onClick={handleSearch}
        variant="contained"
        disabled={loading}
        startIcon={
          loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon sx={{ color: '#FFF' }} />
        }
        sx={{
          height: 56,
          borderRadius: 0,
          fontSize: "13px",
          backgroundColor: "primary.main",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "primary.main",
          },
        }}
      >
        {loading ? "Searching..." : "Search"}
      </Button>
    </Box>
  );
};

export default DomainSearch;
