import React, { useState, useEffect, useRef, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { CommonAutocomplete } from "./fields";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useVendorList } from "../../hooks/Vendor/Vendor-hooks";
import CommonSelectedItem from "./fields/NDE-SelectedItem";

const CommonVendorList = ({
  name,
  control,
  rules,
  label = "Vendor Name",
  placeholder = "Select Vendor",
  limit = 50,
  width = "100%",
  mt = 1,
  mb = 2,
  vendorData,
  setValue,
  noLabel = false,
  onVendorSelect,
  selectedVendor,
}) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    if (vendorData) {
      setValue(name, vendorData);
    }
  }, [vendorData, name, setValue]);

  const [debouncedSearch] = useDebounce(searchTerm, 400);

  const {
    data: fetchedData,
    isLoading,
    isFetching,
  } = useVendorList({
    page,
    limit,
    searchTerm: debouncedSearch,
    type: "ACTIVE",
  });

  useEffect(() => {
    if (fetchedData?.data) {
      setData((prev) => {
        const merged =
          page === 1 ? fetchedData.data : [...prev, ...fetchedData.data];

        return merged.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t._id === item._id),
        );
      });

      setHasNext(fetchedData.data.length === limit);
    }
  }, [fetchedData, page, limit]);

  useEffect(() => {
    if (vendorData && data.length) {
      const exists = data.some((item) => item._id === vendorData);

      if (!exists) {
        const selectedVendor = fetchedData?.data?.find(
          (item) => item._id === vendorData,
        );

        if (selectedVendor) {
          setData((prev) => [selectedVendor, ...prev]);
        }
      }
    }
  }, [vendorData, data, fetchedData]);

  const handleInputChange = (_, value, reason) => {
    setSearchTerm(value);
    if (reason === "input") {
      setPage(1);
      setHasNext(true);
      // setData([]);
    }
  };

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight + 20 &&
      !isFetching &&
      hasNext
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const options = useMemo(() => {
    return data.map((item) => ({
      value: item._id,
      label:
        `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
        item.name ||
        "Unnamed",
      subLabel: item.email,
      fullData: item,
    }));
  }, [data]);

  return (
    <Box>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={vendorData}
        render={({ field, fieldState }) => {
          const selectedOption = options.find((opt) => opt.value === field.value);

          return (
            <Box width={width}>
              <CommonAutocomplete
                value={selectedOption}
                onChange={(selected) => {
                  field.onChange(selected ? selected.value : null);
                  if (onVendorSelect) {
                    onVendorSelect(selected ? selected.fullData : null);
                  }
                }}
                onInputChange={handleInputChange}
                options={options}
                label={noLabel ? undefined : label}
                placeholder={placeholder}
                loading={isLoading || isFetching}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                ListboxProps={{
                  onScroll: handleScroll,
                  ref: listRef,
                  style: { maxHeight: 250, overflowY: "auto" },
                }}
                mt={mt}
                mb={mb}
                width={422}
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "background.muted" : "#FFF",
                  borderRadius: 1,
                }}
                renderOption={(props, option, { selected }) => {
                  const customer = option.fullData;

                  const name =
                    `${customer?.first_name || ""} ${customer?.last_name || ""
                      }`.trim() || "Unnamed";

                  const capitalizedName =
                    name.charAt(0).toUpperCase() + name.slice(1);

                  const email = customer?.email || "";

                  return (
                    <li
                      {...props}
                      style={{
                        borderRadius: 8,
                        margin: "4px 8px",
                        padding: "6px",
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                        sx={{
                          width: "100%",
                          color: selected ? "#fff" : "#000",
                        }}
                      >
                        {/* Avatar */}
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            backgroundColor: selected ? "#ffffff33" : "#E0E0E0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                            color: selected ? "#fff" : "#555",
                          }}
                        >
                          {name?.charAt(0)?.toUpperCase()}
                        </Box>

                        <Box>
                          <Typography
                            fontSize={14}
                            color={selected ? "#fff" : "text.primary"}
                          >
                            {capitalizedName}
                          </Typography>

                          <Box
                            display="flex"
                            alignItems="center"
                            gap={0.5}
                            mt={0.3}
                          >
                            <MailOutlineIcon
                              sx={{
                                fontSize: 16,
                                color: selected ? "#E3E8FF" : "#777",
                              }}
                            />
                            <Typography
                              fontSize={12}
                              color={selected ? "#E3E8FF" : "#777"}
                            >
                              {email}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </li>
                  );
                }}
              />
            </Box>
          );
        }}
      />
      {selectedVendor && (
        <Box>
          <CommonSelectedItem
            listData={selectedVendor}
            title="Vendor"
            mt={-7}
          />
        </Box>
      )}
    </Box>

  );
};

export default CommonVendorList;
