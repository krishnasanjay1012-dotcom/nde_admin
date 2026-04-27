import { Box, Badge, IconButton, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ViewListIcon from "@mui/icons-material/ViewList";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import DropdownMenu from "../../common/NDE-DropdownFilter";
import MoreActionsMenu from "../../common/NDE-MoreActionsMenu";
import CommonButton from "../../common/NDE-Button";

const BillsToolbar = ({
  viewMode,
  onViewChange,
  onNew,
  showInlineFilter,
  setShowInlineFilter,
  customFilters,
  filterdata,
  filterType,
  handleBillOptionChange,
  favorites,
  handleFavoriteToggle,
  handleEditFilter,
  handleDeleteFilter,
  billMenuItems,
  handleSortChange,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1,
        width: "100%",
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        {!showInlineFilter && (
          <Badge
            variant="dot"
            color="error"
            invisible={!customFilters?.length}
            sx={{
              "& .MuiBadge-badge": {
                fontSize: 9,
                height: 8,
                minWidth: 8,
                padding: "0 4px",
              },
            }}
          >
            <IconButton
              onClick={() => setShowInlineFilter(true)}
              size="small"
              sx={{
                bgcolor: "primary.extraLight",
                width: 32,
                height: 32,
                "&:hover": { bgcolor: "primary.extraLight" },
              }}
            >
              <FilterListRoundedIcon sx={{ color: "primary.main", fontSize: 20 }} />
            </IconButton>
          </Badge>
        )}

        <DropdownMenu
          options={filterdata}
          selectedKey={filterType}
          onChange={handleBillOptionChange}
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
          width={230}
          footerAction={{
            label: "New Custom View",
            onClick: () => onNew("custom-view"),
            icon: <AddCircleRoundedIcon fontSize="small" sx={{ color: "primary.main" }} />,
          }}
          onEdit={handleEditFilter}
          onDelete={handleDeleteFilter}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={onViewChange}
          size="small"
          aria-label="view mode"
          sx={{ height: 36 }}
        >
          <Tooltip title="List View" placement="bottom">
            <ToggleButton value="list" aria-label="list view">
              <ViewListIcon />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Calendar View" placement="bottom">
            <ToggleButton value="calendar" aria-label="calendar view">
              <CalendarMonthIcon />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>

        <CommonButton onClick={() => onNew("bill")} label="New Bill" />

        <MoreActionsMenu
          items={billMenuItems}
          onChange={(data) => {
            if (data.type === "child" && data.parent === "Sort by") handleSortChange(data.value);
            if (data.type === "parent") console.log("Parent clicked:", data.label);
            if (data.type === "child" && data.parent === "Import" && data.label === "Import Bills") onNew("import");
          }}
        />
      </Box>
    </Box>
  );
};

export default BillsToolbar;