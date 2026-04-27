import { useState } from "react";
import { Box, IconButton } from "@mui/material";

import CommonButton from "../../../components/common/NDE-Button";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";

import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";

import {
    useProductSuggestionList,
    useCreateProductSuggestion,
    useUpdateProductSuggestion,
    useDeleteProductSuggestion,
    useUpdateProductSuggestionStatus,
} from "../../../hooks/products/products-hooks";

import ProductSuggestionDialog from "./Create-Edit-Suggestion";
import CommonDrawer from "../../common/NDE-Drawer";
import CommonToggleSwitch from "../../common/NDE-CommonToggleSwitch";

const ProductSuggestion = ({ open, handleClose }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const { data: productSuggestions, isLoading } = useProductSuggestionList();

    const createMutation = useCreateProductSuggestion();
    const updateMutation = useUpdateProductSuggestion();
    const deleteMutation = useDeleteProductSuggestion();

    const {
        mutate: changeProductStatus,
        isPending: updateProductLoading,
    } = useUpdateProductSuggestionStatus();

    const tableData =
        productSuggestions?.data?.flatMap((item) =>
            item.suggested_products?.map((s) => ({
                id: item._id,
                suggestionId: s._id,

                name: item.product_name || "N/A",
                order: s.order ?? "N/A",
                suggestions: s.product?.product_name || "N/A",
                plan:
                    s.plans?.map((p) => p.plan?.plan_name).join(", ") || "N/A",

                is_active: s.isActive ?? false,

                fulldata: item,
            }))
        ) || [];

    const handleToggle = (row) => {
        changeProductStatus({
            id: row.id,
            suggestionId: row.suggestionId,
            data: {
                isActive: !row.is_active,
            },
        });
    };

    const columns = [
        {
            accessorKey: "serial",
            header: "ID",
            cell: ({ row }) => row.index + 1,
        },
        {
            accessorKey: "name",
            header: "Product Name",
        },
        {
            accessorKey: "plan",
            header: "Plan",
        },
        {
            accessorKey: "suggestions",
            header: "Suggested Product",
        },
        {
            accessorKey: "is_active",
            header: "Visible",
            cell: ({ row }) => (
                <CommonToggleSwitch
                    checked={row.original.is_active}
                    onChange={() => handleToggle(row.original)}
                    disabled={updateProductLoading}
                />
            ),
        },
        {
            accessorKey: "action",
            header: "Action",
            cell: ({ row }) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton onClick={() => handleEdit(row.original)}>
                        <img src={Edit} style={{ height: 16 }} />
                    </IconButton>

                    <IconButton onClick={() => handleDelete(row.original)}>
                        <img src={Delete} style={{ height: 20 }} />
                    </IconButton>
                </Box>
            ),
        },
    ];

    const handleSubmit = (data) => {
        if (selectedRow) {
            updateMutation.mutate(
                {
                    productId: selectedRow.id,
                    suggestionId: selectedRow.suggestionId,
                    data,
                },
                {
                    onSuccess: () => {
                        setOpenDialog(false);
                        setSelectedRow(null);
                    },
                }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => {
                    setOpenDialog(false);
                },
            });
        }
    };

    const handleDelete = (rowData) => {
        setSelectedRow(rowData);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        deleteMutation.mutate(
            {
                productId: selectedRow.id,
                suggestionId: selectedRow.suggestionId,
            },
            {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setSelectedRow(null);
                },
            }
        );
    };

    const handleEdit = (rowData) => {
        setSelectedRow(rowData);
        setOpenDialog(true);
    };

    return (
        <CommonDrawer
            open={open}
            onClose={handleClose}
            title="Product Suggestion"
            width={900}
            p={0}
        >
            <Box>
                {/* Top Button */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        mb: 1,
                    }}
                >
                    <CommonButton
                        label="Product Suggestion"
                        onClick={() => {
                            setSelectedRow(null);
                            setOpenDialog(true);
                        }}
                    />
                </Box>

                {/* Table */}
                <ReusableTable
                    columns={columns}
                    data={tableData}
                    isLoading={isLoading}
                    maxHeight="calc(100vh - 180px)"
                />

                {/* Dialog */}
                <ProductSuggestionDialog
                    open={openDialog}
                    setOpen={setOpenDialog}
                    initialData={selectedRow}
                    onSubmitAction={handleSubmit}
                    isPending={
                        createMutation.isPending ||
                        updateMutation.isPending
                    }
                />

                {/* Delete Modal */}
                <CommonDeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirmDelete={confirmDelete}
                    deleting={deleteMutation.isPending}
                    title="Product Suggestion"
                    itemType={selectedRow?.name}
                />
            </Box>
        </CommonDrawer>
    );
};

export default ProductSuggestion;