import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CommonButton from "../../../components/common/NDE-Button";
import ImpLinkDetails from "../../../components/settings/general/ImpLink-Create-Edit";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import {
  useImpLinks,
  useCreateImpLink,
  useUpdateImpLink,
  useDeleteImpLink
} from "../../../hooks/settings/imp-link";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";

const ImpLink = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data: linksData, isLoading } = useImpLinks();
  const createImpLinkMutation = useCreateImpLink();
  const updateImpLinkMutation = useUpdateImpLink();
  const deleteImpLinkMutation = useDeleteImpLink();

  const tableData = linksData?.data?.map(item => ({
    id: item._id,
    linkName: item.LinkName,
    description: item.Description,
    url: item.Url
  })) || [];

  const columns = [
    {
      accessorKey: "linkName",
      header: "Link Name",
      cell: ({ row }) => (
        <Box
          sx={{
            maxWidth: 200,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={row.original.linkName}
        >
          {row.original.linkName}
        </Box>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <Box
          sx={{
            maxWidth: 300,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={row.original.description}
        >
          {row.original.description}
        </Box>
      ),
    },
    {
      accessorKey: "url",
      header: "Url",
      cell: ({ row }) => (
        <a
          href={row.original.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            maxWidth: 250,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          title={row.original.url}
        >
          {row.original.url}
        </a>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
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

const handleSubmit = async (data) => {
  const payload = {
    Url: data.url,
    LinkName: data.linkName,
    Description: data.description,
  };

  try {
    if (selectedRow) {
      await updateImpLinkMutation.mutateAsync({
        id: selectedRow.id,
        data: payload,
      });
    } else {
      await createImpLinkMutation.mutateAsync(payload);
    }

    setOpenDialog(false);
    setSelectedRow(null);

  } catch (error) {
    console.error(error);
  }
};

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteImpLinkMutation.mutate(selectedRow.id);
    setDeleteModalOpen(false);
    setSelectedRow(null);
  };

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: 'space-between', p:1 }}>
        <Typography variant="h4" gutterBottom>
          Imp Link Settings
        </Typography>
        <CommonButton
          label={"Create Imp Links"}
          onClick={() => {
            setSelectedRow(null);
            setOpenDialog(true);
          }}
        />
      </Box>

      <ReusableTable columns={columns} data={tableData} isLoading={isLoading} maxHeight="calc(100vh - 180px)" />

      <ImpLinkDetails
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        onSubmitAction={handleSubmit}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteImpLinkMutation.isLoading}
        title="Important Link"
        itemType={selectedRow?.linkNamea}
      />
    </Box>
  );
};

export default ImpLink;
