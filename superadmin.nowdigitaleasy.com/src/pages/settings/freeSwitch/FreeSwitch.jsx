import React, { useState, useMemo } from 'react';
import { Box, Typography, IconButton } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import AddIcon from '@mui/icons-material/Add';
import ReusableTable from "../../../components/common/Table/ReusableTable";
import Edit from "../../../assets/icons/edit.svg";
import Delete from "../../../assets/icons/delete.svg";
import { connectFreeSwitch, getFreeSwitchData, updateFreeSwitch, deleteFreeSwitch } from '../../../services/freeSwitch/freeSwitch-service';
import { useEffect } from 'react';
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import FreeSwitchDetails from '../../../components/settings/freeSwitch/FreeSwitch-Create-Edit';

const FreeSwitch = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentEditData, setCurrentEditData] = useState(null);

  const fetchFreeSwitchData = async () => {
    setIsLoading(true);
    try {
      const response = await getFreeSwitchData();
      setData(response?.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFreeSwitchData();
  }, []);

  const columns = useMemo(() => [
    {
      accessorKey: "serial",
      header: "Id",
      cell: ({ row }) => row.index + 1,
    },
    { accessorKey: "host", header: "IP Address" },
    { accessorKey: "port", header: "Port" },
    {
      accessorKey: "password",
      header: "Password",
      cell: () => "*******"
    },
    {
      accessorKey: "action",
      header: "Actions",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton size="small" onClick={() => handleEdit(row.original)}>
            <img src={Edit} alt="edit" style={{ height: 15 }} />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(row.original)}>
            <img src={Delete} alt="delete" style={{ height: 20 }} />
          </IconButton>
        </Box>
      ),
    },
  ], [data]);

  const handleEdit = (rowData) => {
    setCurrentEditData(rowData);
    setOpen(true);
  };

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const response = await deleteFreeSwitch(selectedRow._id);
      if (response) {
        setDeleteModalOpen(false);
        fetchFreeSwitchData();
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = () => {
    setCurrentEditData(null);
    setOpen(true);
  };

  const onSubmitAction = async (formData) => {
    try {
      const payload = {
        host: formData.host,
        port: Number(formData.port),
        password: formData.password
      };
      
      const response = currentEditData
        ? await updateFreeSwitch(currentEditData._id, payload)
        : await connectFreeSwitch(payload);
        
      if (response) {
        setOpen(false);
        fetchFreeSwitchData();
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          p: 1,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography variant="h4" gutterBottom noWrap>
          FreeSwitch
        </Typography>
        <Box sx={{ mt: { xs: 1, sm: 0 } }}>
          <CommonButton
            label="Create FreeSwitch"
            onClick={handleOpen}
            startIcon={<AddIcon sx={{ color: '#FFF' }} />}
          />
        </Box>
      </Box>

      <Box>
        <ReusableTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          maxHeight="calc(100vh - 180px)"
        />
      </Box>
      <FreeSwitchDetails
        open={open}
        setOpen={setOpen}
        initialData={currentEditData}
        onSubmitAction={onSubmitAction}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={isLoading}
        title="FreeSwitch"
        itemType={selectedRow?.host}
      />
    </Box>
  );
};

export default FreeSwitch;

