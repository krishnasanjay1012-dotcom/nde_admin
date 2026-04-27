import React, { useState } from "react";
import { Box, Typography, IconButton, Avatar, Modal, Dialog, keyframes, Slide, Tooltip } from "@mui/material";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonButton from "../../../components/common/NDE-Button";
import ClientLogDetails from "../../../components/settings/general/ClientLogo-Create-Edit";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import CommonImagePreview from "../../../components/common/NDE-ImagePreview";
import {
  useLogos,
  useCreateLogo,
  useUpdateLogo,
  useDeleteLogo
} from "../../../hooks/settings/logo";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
import UploadIcon from "@mui/icons-material/CloudUploadOutlined";
import ImageUploadCrop from "../../../components/common/ImageUploadCrop";


const bounceIn = keyframes`
  0% { transform: translateY(100%); opacity: 0; }
  60% { transform: translateY(-15px); opacity: 1; }
  80% { transform: translateY(10px); }
  100% { transform: translateY(0); }
`;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} timeout={{ enter: 500, exit: 300 }} />;
});

const ClientLogo = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const { data: logos, isLoading } = useLogos();
  const createLogoMutation = useCreateLogo();
  const updateLogoMutation = useUpdateLogo();
  const deleteLogoMutation = useDeleteLogo();

  const mappedLogos = Array.isArray(logos?.data)
    ? logos.data.map((logo, index) => ({
      _id: logo._id || index + 1,
      name: logo.name,
      image: logo.image?.data || "",
      link: logo.link,
      text: logo.Text,
    }))
    : [];


  const [openUpload, setOpenUpload] = useState(false);

  const handleOpenUpload = (row) => {
    setSelectedRow(row);
    setOpenUpload(true);
  };

  const handleCloseUpload = () => {
    setOpenUpload(false);
    setSelectedRow(null);
  };

  const columns = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: row.original.image ? "pointer" : "not-allowed",
          }}
          onClick={() => {
            if (row.original.image) {
              setPreviewImage(row.original.image);
              setPreviewOpen(true);
            }
          }}
        >
          <Avatar
            alt={row.original.name}
            src={row.original.image}
            sx={{
              width: 40,
              height: 40,
              border: "1px solid #e0e0e0",
            }}
          />
        </Box>
      ),
    },

    {
      accessorKey: "link",
      header: "Link",
      cell: ({ row }) => (
        <a href={row.original.link} target="_blank" rel="noreferrer">{row.original.link}</a>
      )
    },
    { accessorKey: "text", header: "Text" },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Upload Client Logo" arrow>
            <IconButton
              onClick={() => handleOpenUpload(row.original)}
              color="primary"
            >
              <UploadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton onClick={() => handleEdit(row.original)}>
            <img src={Edit} style={{ height: 15 }} />
          </IconButton>

          <IconButton onClick={() => handleDelete(row.original)}>
            <img src={Delete} style={{ height: 20 }} />
          </IconButton>

        </Box>
      ),
    },

  ];

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenDialog(true);
  };

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRow) {
      deleteLogoMutation.mutate(selectedRow._id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedRow(null);
        }
      });
    }
  };

  const handleSubmit = (data) => {
    const body = {
      name: data.name,
      link: data.link,
      text: data.text,
    };

    if (selectedRow) {
      body._id = selectedRow._id;

      updateLogoMutation.mutate(body, {
        onSuccess: () => {
          setOpenDialog(false);
          setSelectedRow(null);
        },
      });
    } else {
      createLogoMutation.mutate(body, {
        onSuccess: () => {
          setOpenDialog(false);
        },
      });
    }
  };



  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: 'space-between', p: 1 }}>
        <Typography variant="h4" gutterBottom>
          Client Logo Settings
        </Typography>
        <CommonButton
          label={"Create Client Logo"}
          onClick={() => {
            setSelectedRow(null);
            setOpenDialog(true);
          }}
        />
      </Box>

      <ReusableTable columns={columns} data={mappedLogos || []} isLoading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />

      {/* Create / Edit Modal */}
      <ClientLogDetails
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
        deleting={deleteLogoMutation.isLoading}
        title="Client Logo"
        itemType={selectedRow?.name}
      />

      <CommonImagePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        src={previewImage}
        alt="Logo Preview"
        width="600px"
        height="500px"
        bgcolor="#fff"
        borderRadius={4}
      />
      <Dialog
        open={openUpload}
        onClose={handleCloseUpload}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "10px",
            animation: `${bounceIn} 0.7s ease-out`,
            width: 400,
          },
        }}
      >
        <ImageUploadCrop
          rowData={selectedRow?._id}
          onClose={handleCloseUpload}
        />
      </Dialog>
    </Box>
  );
};

export default ClientLogo;
