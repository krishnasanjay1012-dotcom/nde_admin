import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import PleskDetails from "../../../components/settings/integrations/Plesk-Create-Edit";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import CommonCheckbox from "../../../components/common/fields/NDE-Checkbox";

import {
  usePlesk,
  useCreatePlesk,
  useUpdatePlesk,
  useDeletePlesk,
} from "../../../hooks/settings/plesk-hooks";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";

const Plesk = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data: tableData = [], isLoading } = usePlesk();
  const createPleskMutation = useCreatePlesk();
  const updatePleskMutation = useUpdatePlesk();
  const deletePleskMutation = useDeletePlesk();

  const addNewEntry = async (newData) => {
    try {
      await createPleskMutation.mutateAsync(newData);
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const updateEntry = async (id, updatedData) => {
    try {
      await updatePleskMutation.mutateAsync({ id, data: updatedData });
      setOpenDialog(false);
    } catch (error) {
      console.error(error);
    }
  };  

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedRow) {
      await deletePleskMutation.mutateAsync(selectedRow._id);
      setDeleteModalOpen(false);
      setSelectedRow(null);
      setSelectedIds((prev) => prev.filter((id) => id !== selectedRow._id));
    }
  };

  // EDIT CLICK
  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenDialog(true);
  };

  // CHECKBOX
  const toggleCheckbox = (_id) => {
    setSelectedIds((prev) =>
      prev.includes(_id) ? prev.filter((item) => item !== _id) : [...prev, _id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === tableData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tableData.map((row) => row._id));
    }
  };

  const exportCSV = (data, filename = "export.csv") => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map(row =>
        headers.map(header => `"${row[header] ?? ""}"`).join(",")
      )
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    // {
    //   id: "select",
    //   header: () => (
    //     <CommonCheckbox
    //       name="selectAll"
    //       checked={selectedIds.length === tableData.length && tableData.length > 0}
    //       indeterminate={selectedIds.length > 0 && selectedIds.length < tableData.length}
    //       onChange={toggleSelectAll}
    //       sx={{ p: 0 }}
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <CommonCheckbox
    //       name={`row-${row.original._id}`}
    //       checked={selectedIds.includes(row.original._id)}
    //       onChange={() => toggleCheckbox(row.original._id)}
    //       sx={{ p: 0 }}
    //     />
    //   ),
    // },
    { accessorKey: "aliasName", header: "Alias Name" },
    { accessorKey: "serverName", header: "Server Name" },
    { accessorKey: "hostingtype", header: "Hosting Type" },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "username", header: "Username" },
    { accessorKey: "ipAddress", header: "IP Address" },
    {
      accessorKey: "defaultserver",
      header: "Default Server",
      cell: ({ row }) => (row.original.defaultserver ? "Yes" : "No"),
    },
    {
      id: "action",
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



  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1 }}>
        <Typography variant="h4" gutterBottom>
          Plesk Settings
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>

          {/* <CommonButton
          label="Export All Data"
          onClick={() => exportCSV(tableData, "plesk_all.csv")}
          startIcon={false}
        />
        <CommonButton
          label="Export Selected Data"
          disabled={selectedIds.length === 0}
          startIcon={false}
          onClick={() =>
            exportCSV(
              tableData.filter((row) => selectedIds.includes(row._id)),
              "plesk_selected.csv"
            )
          }
        /> */}
          <CommonButton
            label="Create Plesk"
            onClick={() => {
              setSelectedRow(null);
              setOpenDialog(true);
            }}
          />
        </Box>
      </Box>

      <ReusableTable columns={columns} data={tableData} selectedIds={selectedIds} isLoading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />

      <PleskDetails
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        onSubmitAction={async (data) => {
          if (selectedRow) {
            await updateEntry(selectedRow._id, data);
          } else {
            await addNewEntry(data);
          }
        }}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deletePleskMutation.isLoading}
        title="Plesk"
        itemType={selectedRow?.aliasName}
      />
    </Box>
  );
};

export default Plesk;
