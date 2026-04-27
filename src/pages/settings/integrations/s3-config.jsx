import { useState, useMemo } from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";

import ReusableTable from "../../../components/common/Table/ReusableTable";

import Edit from "../../../assets/icons/edit.svg";
import { useS3Configs } from "../../../hooks/settings/gsuite";
import S3ConfigDetails from "../../../components/settings/integrations/S3-Config-Edit";

const S3config = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data, isLoading } = useS3Configs();


  const tableData = useMemo(() => {
    if (!data?.configs) return [];

    return data.configs.map((item) => ({
      id: item._id,
      region: item.region,
      status: item.isActive,
      createdAt: new Date(item.createdAt).toLocaleDateString(),
      raw: item, 
    }));
  }, [data]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "region",
        header: "Region",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) =>
          row.original.status ? (
            <Chip label="Active" color="success" size="small" />
          ) : (
            <Chip label="Inactive" color="error" size="small" />
          ),
      },
      {
        accessorKey: "createdAt",
        header: "Created On",
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleEdit(row.original)}
            >
              <img src={Edit} alt="edit" height={16} />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenDialog(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
        }}
      >
        <Typography variant="h4">S3 Config Settings</Typography>

      </Box>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={tableData}
        loading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />

      {/* Create / Edit Dialog */}
      
      <S3ConfigDetails
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow?.raw || null}
        
      />
     
    </Box>
  );
};

export default S3config;
