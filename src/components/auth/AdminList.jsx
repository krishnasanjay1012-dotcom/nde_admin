import { Box, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import ReusableTable from "../common/Table/ReusableTable";
import CommonButton from "../common/NDE-Button";
import Delete from "../../assets/icons/delete.svg";
import Edit from "../../assets/icons/edit.svg";
import { useAdminList, useDeleteAdmin } from "../../hooks/auth/login";
import UserCreateForm from "./User-Create-Edit";
import CommonDeleteModal from "../common/NDE-DeleteModal";
import { useAdminId, clearUserSession } from "../../utils/session";
import { useNavigate } from "react-router-dom";


const AdminList = () => {
  const { data: admins, isLoading } = useAdminList();
  const navigate = useNavigate();
  const currentAdminId = useAdminId();
  const { mutate: deleteAdmin, isPending: deleting } = useDeleteAdmin();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleCreateUser = () => {
    setInitialData(null);
    setOpenDrawer(true);
  };

  const handleEditUser = (rowData) => {
    setInitialData(rowData);
    setOpenDrawer(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedRow?._id) return;

    deleteAdmin(selectedRow._id, {
      onSuccess: () => {
        setDeleteModalOpen(false);

        if (currentAdminId === selectedRow._id) {
          toast.info("Your account has been deleted. Logging out...");

          setTimeout(() => {
            clearUserSession();
            navigate("/login");
          }, 2000);
        } else {
          setSelectedRow(null);
          toast.success("Admin deleted successfully");
        }
      },
    });
  };

  const handleCloseDrawer = () => {
    setInitialData(null);
    setOpenDrawer(false);
  };

  const tableData =
    admins?.data?.map((item) => ({
      id: item._id,
      username: item?.username,
      email: item?.emailId || "-",
      role: item.role,
      raw: item,
    })) || [];

  const columns = [
    { accessorKey: "username", header: "User Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    {
      accessorKey: "action",
      header: "Actions",
      cell: ({ row }) => (
        <Box
          sx={{ display: "flex", gap: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton onClick={() => handleEditUser(row.original.raw)}>
            <img src={Edit} style={{ height: 15 }} />
          </IconButton>

          <IconButton onClick={() => handleDeleteClick(row.original.raw)}>
            <img src={Delete} style={{ height: 20 }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box >
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
        <Typography variant="h4" gutterBottom mt={1}>
          Admin User
        </Typography>
        <CommonButton label="New User" onClick={handleCreateUser} />
      </Box>

      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
      />

      <UserCreateForm
        open={openDrawer}
        onClose={handleCloseDrawer}
        initialData={initialData}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleting}
        title="Admin"
        itemType={selectedRow?.username}
      />
    </Box>
  );
};

export default AdminList;
