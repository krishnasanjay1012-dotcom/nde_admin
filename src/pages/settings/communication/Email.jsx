import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import EmailDetails from "../../../components/settings/communication/Email-Create-Edit"; 
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import CommonCheckbox from "../../../components/common/fields/NDE-Checkbox";
import { useEmails, useCreateEmail, useUpdateEmail, useDeleteEmail } from "../../../hooks/settings/email-hooks"; 
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";

const Email = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data, isLoading } = useEmails();
  const emails = data?.data || [];
  const createEmailMutation = useCreateEmail();
  const updateEmailMutation = useUpdateEmail();
  const deleteEmailMutation = useDeleteEmail();

  const handleSubmit = (formData) => {
    if (selectedRow) {
      updateEmailMutation.mutate({ id: selectedRow._id, data: formData });
    } else {
      createEmailMutation.mutate(formData);
    }
    setOpenDialog(false);
  };

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteEmailMutation.mutate(selectedRow._id);
    setDeleteModalOpen(false);
    setSelectedRow(null);
  };

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenDialog(true);
  };

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === emails.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(emails.map((row) => row._id));
    }
  };

  const exportToCSV = (rows) => {
    if (!rows || rows.length === 0) return;

    const headers = ["Host Name", "User Name", "Password", "Port", "Authentication"];
    const csvRows = [
      headers.join(","), 
      ...rows.map(row =>
        [row.hostname, row.username, row.password, row.port, row.authentication]
          .map(value => `"${value}"`) 
          .join(",")
      )
    ];

    const csvData = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(csvData);
    const link = document.createElement("a");
    link.href = url;
    link.download = "emails.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    // {
    //   id: "select",
    //   header: () => (
    //     <CommonCheckbox
    //       name="selectAll"
    //       checked={selectedIds.length === emails.length && emails.length > 0}
    //       indeterminate={
    //         selectedIds.length > 0 && selectedIds.length < emails.length
    //       }
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
    { accessorKey: "hostname", header: "Host Name" },
    { accessorKey: "username", header: "User Name" },
    { accessorKey: "password", header: "Password" },
    { accessorKey: "port", header: "Port" },
    { accessorKey: "authentication", header: "Authentication" },
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
      {/* Header with Buttons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          p: 1,
          gap: { xs: 2, sm: 0 }
        }}
      >
        <Typography variant="h4" gutterBottom noWrap>
          Manage Email
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mt: { xs: 1, sm: 0 }
          }}
        >
          {/* <CommonButton
            label="Export All"
            onClick={() => exportToCSV(emails)}
            startIcon={false}
          /> */}
          {/* <CommonButton
            label="Export Selected Data"
            onClick={() =>
              exportToCSV(emails.filter((e) => selectedIds.includes(e._id)))
            }
            disabled={selectedIds.length === 0}
            startIcon={false}
          /> */}
          <CommonButton
            label="Create New Email"
            onClick={() => {
              setSelectedRow(null);
              setOpenDialog(true);
            }}
            startIcon={false}
          />
        </Box>
      </Box>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={emails}
        selectedIds={selectedIds}
        isLoading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />

      {/* Email Dialog */}
      <EmailDetails
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        onSubmitAction={handleSubmit}
      />

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteEmailMutation.isLoading}
        title="Email"
        itemType={selectedRow?.hostname}
      />
    </Box>
  );
};

export default Email;
