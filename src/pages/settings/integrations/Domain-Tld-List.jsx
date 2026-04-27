import { useState } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";


import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
import { useAddTld, useDeleteTld, useUpdateTld } from "../../../hooks/domain/domain-hooks";
import { useGetTlds } from "../../../hooks/settings/resellers-hooks";
import DomainTld from "../../../components/settings/integrations/TLD-Create-Edit";

const DomainTLD = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);    

    const { data: domainTld, isLoading } = useGetTlds();

    const createResellerMutation = useAddTld();
    const updateResellerMutation = useUpdateTld();
    const deleteResellerMutation = useDeleteTld();

    const tableData = domainTld?.data?.map((item) => ({
        id: item._id,
        tld: item?.tld,
        description: item?.description,
        config: item?.config?._id
    })) || [];

    const columns = [
        {
            accessorKey: "serial",
            header: "ID",
            cell: ({ row }) => row.index + 1,
        },
        { accessorKey: "tld", header: "Domain tld" },
        { accessorKey: "description", header: "Description" },
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
            updateResellerMutation.mutate(
                { id: selectedRow.id, data },
                {
                    onSuccess: () => {
                        setOpenDialog(false);
                    },
                }
            );
        } else {
            createResellerMutation.mutate(data, {
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
        deleteResellerMutation.mutate(selectedRow.id);
        setDeleteModalOpen(false);
        setSelectedRow(null);
    };

    const handleEdit = (rowData) => {
        setSelectedRow(rowData);
        setOpenDialog(true);
    };



    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1 }}>
                <Typography variant="h4" gutterBottom>
                    Domain TLD Settings
                </Typography>
                <CommonButton
                    label={"Create TLD"}
                    onClick={() => {
                        setSelectedRow(null);
                        setOpenDialog(true);
                    }}
                />
            </Box>

            <ReusableTable columns={columns} data={tableData} isLoading={isLoading} maxHeight="calc(100vh - 180px)" />

            <DomainTld
                open={openDialog}
                setOpen={setOpenDialog}
                initialData={selectedRow}
                onSubmitAction={handleSubmit}
            />

            <CommonDeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirmDelete={confirmDelete}
                deleting={deleteResellerMutation.isLoading}
                title="Domain"
                itemType={selectedRow?.tld}
            />
        </Box>
    );
};

export default DomainTLD;
