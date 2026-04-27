import { useState, useEffect } from "react";
import { Box, Chip } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CommonButton from "../NDE-Button";

const TableFilterBar = ({ filtersConfig = [], onSaveFilters, onDelete }) => {
  const [activeFilters, setActiveFilters] = useState(
    filtersConfig.map((f) => ({ key: f.key, value: "" })),
  );

  const handleDeleteFilter = (key) => {
    setActiveFilters((prev) => prev.filter((f) => f.key !== key));
    if (onDelete) {
      onDelete(key);
    }
  };

  const handleSave = () => {
    onSaveFilters?.(activeFilters);
  };

  useEffect(() => {
    setActiveFilters(filtersConfig.map((f) => ({ key: f.key, value: "" })));
  }, [filtersConfig]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          flex: 1,
          gap: 1,
          width: 480,
        }}
      >
        {activeFilters.map((f) => {
          const label =
            filtersConfig.find((c) => c.key === f.key)?.label || f.key;
          return (
            <Chip
              key={f.key}
              label={label}
              onDelete={() => handleDeleteFilter(f.key)}
              color="primary"
              variant="outlined"
              sx={{ flexShrink: 0 }}
            />
          );
        })}
      </Box>

      <Box sx={{ ml: 1, flexShrink: 0 }}>
        <CommonButton
          variant="contained"
          startIcon={<SaveIcon sx={{ color: "icon.light" }} />}
          onClick={handleSave}
          label="Save Filter"
          disabledColor="#9198F3"
          disabled={activeFilters.length === 0}
          sx={{
            height: 38,
            minWidth: 120,
            backgroundColor:
              activeFilters.length === 0 ? "primary.light" : undefined,
            borderRadius: 6,
            textTransform: "none",
          }}
        />
      </Box>
    </Box>
  );
};

export default TableFilterBar;
