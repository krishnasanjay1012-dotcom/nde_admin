import { useState } from "react";
import {
  Select,
  FormLabel,
  FormControl,
  FormHelperText,
  Avatar,
  Box,
  Typography,
  Chip,
  MenuItem,
  ListSubheader,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import useIntersectionObserver from "../../../hooks/common/useInfinityScroll";
import CommonSearchBar from "./NDE-SearchBar";
import {
  ExpandLessRounded,
  ExpandMoreRounded,
  KeyboardArrowDownOutlined,
  KeyboardArrowDownRounded,
} from "@mui/icons-material";

const CommonMultiSelectWithPagination = ({
  label,
  value = [],
  onChange,
  mandatory,
  name,
  options = [],
  error,
  helperText,
  sx,
  width = "100%",
  height = 42,
  mt = 0,
  mb = 0,
  placeholder,
  querySuffix,
  queryFn,
  searchable,
  borderRadius,
}) => {
  const [search, setSearch] = useState("");
  const theme = useTheme();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: [`multi-select-${querySuffix}`, search],
      queryFn: ({ pageParam }) => queryFn({ pageParam, search }),
      getNextPageParam: (lastPage) => {
        if (lastPage?.pagination?.hasNextPage) {
          return lastPage?.pagination?.nextPage;
        }
        return null;
      },
      staleTime: 5 * 60 * 1000,
      enabled: !!querySuffix && typeof queryFn === "function",
    });

  const observerRefPages = useIntersectionObserver({
    onIntersect: fetchNextPage,
    isEnabled: hasNextPage && !isFetchingNextPage,
  });

  const allOptions =
    data?.pages?.flatMap((page) => page?.data ?? []) ?? options;
  const selectedOptions = allOptions.filter((opt) => value.includes(opt.value));

  const handleDelete = (optValue) => {
    onChange({
      target: { name, value: value.filter((v) => v !== optValue) },
    });
  };

  const renderChip = (opt, props = {}) => (
    <Chip
      key={opt.value}
      size="small"
      label={
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {opt.avatar && (
            <Avatar sx={{ bgcolor: "primary.100", width: 16, height: 16 }}>
              {typeof opt.avatar === "string" ? (
                <img
                  src={opt.avatar}
                  alt={opt.heading || opt.label}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                opt.avatar
              )}
            </Avatar>
          )}
          <Typography variant="body2" noWrap>
            {opt.heading || opt.label}
          </Typography>
        </Box>
      }
      {...props}
    />
  );

  return (
    <FormControl error={error} sx={{ width, display: "block", mt, mb, ...sx }}>
      {label && (
        <FormLabel sx={{ display: "block", mb: 0.5 }}>
          {label}
          {mandatory && (
            <Typography component="span" color="error">
              {" "}
              *
            </Typography>
          )}
        </FormLabel>
      )}

      <Select
        multiple
        name={name}
        IconComponent={ExpandMoreRounded}
        value={value}
        onChange={(e) => onChange({ target: { name, value: e.target.value } })}
        displayEmpty
        renderValue={(values) => {
          if (selectedOptions.length === 0) {
            return (
              <Typography variant="body1" color="text.secondary">
                {placeholder || "Select"}
              </Typography>
            );
          }

          const selected = allOptions?.filter((i) =>
            values?.includes(i?.value),
          );

          if (!selected?.length) {
            return (
              <Typography variant="body2" color="text.secondary">
                {values.length} selected
              </Typography>
            );
          }

          return (
            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap",
                alignItems: "center",
                gap: "4px",
                overflow: "hidden",
                height: "100%",
                py: 0,
              }}
            >
              {renderChip(selected?.[0], {
                onMouseDown: (e) => e.stopPropagation(),
                onDelete: () => handleDelete(selected?.[0]?.value),
                sx: {
                  flexShrink: 0,
                  maxWidth: 100,
                  borderRadius: 3,
                  border: "1px solid",
                  height: "25px",
                  borderColor: "divider",
                  "& .MuiChip-deleteIcon": {
                    color: "text.secondary",
                  },
                },
              })}

              {selected?.length > 1 && (
                <Chip
                  size="small"
                  label={`+ ${selected?.length - 1}`}
                  sx={{
                    flexShrink: 0,
                    borderRadius: 10,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "action.selected",
                    fontSize: "13px",
                    fontWeight: 500,
                    minWidth: 36,
                    p: 0,
                    height: "25px",
                  }}
                />
              )}
            </Box>
          );
        }}
        sx={{
          width,
          height,
          borderRadius,
          "& .MuiSelect-icon": {
            fontSize: 20,
            color: theme.palette.icon?.main || theme.palette.text.secondary,
          },
          "& .MuiSelect-select": {
            py: "0 !important",
            display: "flex",
            alignItems: "center",
            height: "100% !important",
          },
        }}
        MenuProps={{
          disableScrollLock: true,
          disableAutoFocusItem: true,
          PaperProps: {
            sx: { borderRadius: 2, maxWidth: width },
            style: { maxHeight: 250 },
          },
        }}
      >
        {searchable && (
          <ListSubheader
            disableSticky
            sx={{ px: 1, backgroundColor: "transparent" }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <CommonSearchBar
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
              placeholder="Search..."
              autoFocus
              height={36}
              mt={0}
              mb={0}
              sx={{ bgcolor: "background.paper", borderRadius: 2 }}
            />
          </ListSubheader>
        )}

        {allOptions.map((opt) => (
          <MenuItem
            key={opt.value}
            value={opt.value}
            sx={{
              mx: 0.5,
              mt: 0.2,
              height: 30,
              fontWeight: 400,
              "& .MuiTypography-root": { fontWeight: 400, fontSize: 12 },
              borderRadius: 1,
              "&.Mui-selected": {
                backgroundColor: "primary.light",
                "& .MuiTypography-root": {
                  color: "text.primary",
                  fontSize: 12,
                  fontWeight: 400,
                },
                "&:hover": { backgroundColor: "primary.light" },
              },
              "&:hover": {
                backgroundColor: "primary.light",
                "& .MuiTypography-root": {
                  color: "text.primary",
                  fontSize: 12,
                  fontWeight: 400,
                },
              },
            }}
          >
            {opt.avatar && (
              <Avatar
                sx={{ bgcolor: "primary.100", width: 28, height: 28, mr: 1 }}
              >
                {typeof opt.avatar === "string" ? (
                  <img
                    src={opt.avatar}
                    alt={opt.heading || opt.label}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  opt.avatar
                )}
              </Avatar>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                flex: 1,
              }}
            >
              <Typography
                variant="body1"
                noWrap
                sx={{
                  fontWeight: 500,
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {opt.heading || opt.label}
              </Typography>
              {opt.description && (
                <Typography variant="subtitle2" color="text.secondary">
                  {opt.description}
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}

        {!isFetchingNextPage && (
          <MenuItem
            disabled
            ref={observerRefPages}
            sx={{ minHeight: 4, p: 0 }}
          />
        )}
        {isFetchingNextPage && (
          <MenuItem disabled sx={{ minHeight: 4, p: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                mt: 1,
              }}
            >
              <CircularProgress size={"2.8vh"} />
            </Box>
          </MenuItem>
        )}
      </Select>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CommonMultiSelectWithPagination;
