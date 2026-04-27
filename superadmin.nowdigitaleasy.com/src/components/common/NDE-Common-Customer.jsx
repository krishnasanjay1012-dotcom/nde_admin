import React, { useState, useEffect, useRef, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import { useDebounce } from "use-debounce";
import { CommonAutocomplete } from "./fields";
import { useCustomerList } from "../../hooks/Customer/Customer-hooks";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BusinessIcon from "@mui/icons-material/Business";
import CommonSelectedItem from './fields/NDE-SelectedItem';

const CommonCustomerList = ({
    name,
    control,
    rules,
    label = "Customer Name",
    placeholder = "Select Customer",
    limit = 50,
    width = "100%",
    mt = 1,
    mb = 2,
    customerData,
    disabled = false
}) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const listRef = useRef(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);


    const [debouncedSearch] = useDebounce(searchTerm, 400);

    const { data: fetchedData, isLoading, isFetching } = useCustomerList({
        page,
        limit,
        searchTerm: debouncedSearch,
    });

    useEffect(() => {
        if (fetchedData?.data) {
            setData((prev) => {
                const merged =
                    page === 1 ? fetchedData.data : [...prev, ...fetchedData.data];

                return merged.filter(
                    (item, index, self) =>
                        index === self.findIndex((t) => t._id === item._id)
                );
            });

            setHasNext(fetchedData.data.length === limit);
        }
    }, [fetchedData, page, limit]);

    const handleInputChange = (_, value, reason) => {
        setSearchTerm(value);
        if (reason === "input") {
            setPage(1);
            setHasNext(true);
            setData([]);
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
        <Box sx={{ display: 'flex' }}>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field, fieldState }) => (
                    <Box width={width}>
                        <CommonAutocomplete
                            value={field.value || null}
                            onChange={(selected) => {
                                field.onChange(selected || null);
                                setSelectedCustomer(selected?.fullData);
                            }}
                            onInputChange={handleInputChange}
                            options={options}
                            label={label}
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
                            disabled={disabled}
                            sx={{
                                bgcolor: (theme) =>
                                    theme.palette.mode === "dark"
                                        ? "background.muted"
                                        : "#FFF"
                                ,
                                borderRadius: 1,
                            }}
                            renderOption={(props, option, { selected }) => {
                                const customer = option.fullData;
                                const name =
                                    `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim() ||
                                    "Unnamed";

                                const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

                                const email = customer?.email || "";
                                const companyName = customer.workspaceDetails?.workspace_name || "";

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
                                                transition: "0.2s ease",
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
                                                <Typography fontSize={14} color={selected ? "#fff" : "text.primary"}>
                                                    {capitalizedName}
                                                </Typography>

                                                {/* Email with icon */}
                                                <Box display="flex" alignItems="center" gap={0.5} mt={0.3}>
                                                    <MailOutlineIcon
                                                        sx={{
                                                            fontSize: 16,
                                                            color: selected ? "#E3E8FF" : "#777",
                                                        }}
                                                    />
                                                    <Typography fontSize={12} color={selected ? "#E3E8FF" : "#777"}>
                                                        {email}
                                                    </Typography>
                                                    {companyName && (() => {
                                                        const color = selected ? "#E3E8FF" : "#777";
                                                        return (
                                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                                <span style={{ color }}>|</span>
                                                                <BusinessIcon sx={{ fontSize: 16, color }} />
                                                                <Typography fontSize={12} color={color}>
                                                                    {companyName}
                                                                </Typography>
                                                            </Box>
                                                        );
                                                    })()}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </li>
                                );
                            }}
                        />
                    </Box>
                )}
            />
            {customerData && (
                <Box sx={{ ml: "auto", display: 'flex', justifyContent: 'flex-end' }}>
                    <CommonSelectedItem
                        listData={customerData}
                    />
                </Box>
            )}
        </Box>
    );
};

export default CommonCustomerList;