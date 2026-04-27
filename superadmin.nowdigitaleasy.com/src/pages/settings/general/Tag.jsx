import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import TagDetails from "../../../components/settings/general/Tag-Create-Edit"; 
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";

const Tag = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Columns
  const columns = [
    { accessorKey: "type", header: "Type" },
    { accessorKey: "code", header: "Code" },
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

  // Table Data
  const [tableData, setTableData] = useState([
    {
      id: 1,
      type: "Language",
      code: "EN",
    },
    {
      id: 2,
      type: "Currency",
      code: "USD",
    },
    {
      id: 3,
      type: "Country",
      code: "IN",
    },
  ]);

  const addNewEntry = (newData) => {
    const id = tableData.length ? tableData[tableData.length - 1].id + 1 : 1;
    setTableData([...tableData, { id, ...newData }]);
  };

  // EDIT
  const updateEntry = (id, updatedData) => {
    setTableData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  // DELETE
  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setTableData(tableData.filter((item) => item.id !== selectedRow.id));
    setDeleteModalOpen(false);
    setSelectedRow(null);
  };

  // EDIT CLICK
  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenDialog(true);
  };


  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h4" gutterBottom>
          Tag Settings
        </Typography>
        <CommonButton 
          label={"Create Tag"} 
          onClick={() => {
            setSelectedRow(null); 
            setOpenDialog(true);
          }}
        />
      </Box>

      <ReusableTable columns={columns} data={tableData} height={{ xs: 380, sm: 400, md: 400, lg: 400, xl: 500 }} />

      <TagDetails 
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow} 
        onSubmitAction={(data) => {
          if (selectedRow) {
            updateEntry(selectedRow.id, data);
          } else {
            addNewEntry(data);
          }
        }}
      />
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={false}
        itemType="Tag"
      />
    </Box>
  )
}

export default Tag