import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { CommonTextField } from "../../components/common/fields";
import CommonDrawer from "../../components/common/NDE-Drawer";
import { useHSNSearch } from "../../hooks/Items/Items-hooks";
import ReusableTable from "../../components/common/Table/ReusableTable";

const useDebounce = (value, delay = 400) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
};

const ItemsHSNSearch = ({
    open,
    onClose,
    onSelect,
    isService = false,
    title,
}) => {
    const [searchText, setSearchText] = useState("");

    const debouncedSearch = useDebounce(searchText);

    const codeType = isService ? "SAC" : "HSN";

    const drawerTitle = title || `Find ${codeType} Code`;
    const label = `Search ${codeType} code for your item`;
    const placeholder = `Search ${codeType} code...`;

    const { data, isLoading } = useHSNSearch({
        searchText: debouncedSearch,
        isService,
    });

    useEffect(() => {
        if (!open) setSearchText("");
    }, [open]);

    const highlightText = (text, search) => {
        if (!search) return text;
        const regex = new RegExp(`(${search})`, "gi");
        return text.replace(regex, "<mark>$1</mark>");
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "hsnCode",
                header: `${codeType} Code`,
                cell: ({ row }) => (
                    <Typography
                        sx={{
                            color: "primary.main",
                            fontWeight: 600,
                            cursor: "pointer",
                            "&:hover": {
                                textDecoration: "underline",
                            },
                        }}
                    >
                        {row.original.hsnCode}
                    </Typography>
                ),
            },
            {
                accessorKey: "description",
                header: "Description",
                cell: ({ row }) => (
                    <span
                        dangerouslySetInnerHTML={{
                            __html: highlightText(
                                row.original.rawDescription,
                                debouncedSearch
                            ),
                        }}
                    />
                ),
            },
        ],
        [debouncedSearch, codeType]
    );

    const tableData = useMemo(() => {
        return (data?.data || []).map((item, index) => ({
            id: `${item.hsnCode}-${index}`,
            hsnCode: item.hsnCode || item?.sacCode,
            rawDescription: item.description,
            description: item.description,
            cgst: item.cgst,
            sgst: item.sgst,
            igst: item.igst,
            cess: item.cess,
            schedule: item.schedule,
        }));
    }, [data]);

    const handleRowClick = (row) => {
        onSelect?.(row.hsnCode);
        onClose();
    };

    return (
        <CommonDrawer open={open} onClose={onClose} title={drawerTitle} anchor="top">
            <Box>
                <CommonTextField
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder={placeholder}
                    fullWidth
                    label={label}
                    mb={2}
                />
                <ReusableTable
                    columns={columns}
                    data={tableData}
                    isLoading={isLoading}
                    maxHeight="calc(100vh - 220px)"
                    onRowClick={handleRowClick}
                />
            </Box>
        </CommonDrawer>
    );
};

export default ItemsHSNSearch;