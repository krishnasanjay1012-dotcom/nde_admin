import { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import Edit from "../../../assets/icons/edit.svg";
import { useAllEmailTemplates } from "../../../hooks/settings/email-hooks";
import CommonButton from "../../../components/common/NDE-Button";
import CreateTemplate from "./Create-Template";
import EditTemplateDrawer from "./Edit-Template";

const EmailTemplate = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formOpen, setFormOpen] = useState(false);


  const { data: templates, isLoading } = useAllEmailTemplates();

  const email = templates?.data

  useEffect(() => {
    if (email && email.length) {
      const mappedData = email.map((item, index) => ({
        id: item._id,
        index: index + 1,
        name: item.Name,
        subject: item.subject,
      }));
      setTableData(mappedData);
    }
  }, [email]);

  const columns = [
    { accessorKey: "index", header: "Id" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "subject", header: "Subject" },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => handleEdit(row.original.id)}>
            <img src={Edit} style={{ height: 16 }} />
          </IconButton>
        </Box>
      ),
    },
  ];


  const confirmDelete = () => {
    setTableData(tableData.filter((item) => item.id !== selectedRow.id));
    setDeleteModalOpen(false);
    setSelectedRow(null);
  };

  const handleEdit = (row) => {
    setSelectedRow(row)
    setFormOpen(true);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Email Template
        </Typography>
        <CommonButton
          label="Create Template"
          onClick={() => {
            setOpenDialog(true);
          }}
          startIcon={false}
        />
      </Box>

      <ReusableTable
        columns={columns}
        data={tableData}
        maxHeight="calc(100vh - 200px)"
        isLoading={isLoading}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={false}
        itemType="Email Template"
      />
      <CreateTemplate open={openDialog} handleClose={() => setOpenDialog(false)} />
      <EditTemplateDrawer open={formOpen} handleClose={() => setFormOpen(false)} selectedRow={selectedRow}/>
    </Box>
  );
};

export default EmailTemplate;
