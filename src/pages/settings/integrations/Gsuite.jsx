import { useMemo, useState } from "react";
import { Box, Typography, IconButton, Checkbox, Tooltip, Stack } from "@mui/material";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonButton from "../../../components/common/NDE-Button";
import GSuiteDetails from "../../../components/settings/integrations/GSuite-Create-Edit";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import {
  useGSuite,
  useCreateGSuite,
  useDeleteGSuite,
  useMakeGSuiteDefaultConfig,
  useMakeGSuiteOAuth,
} from "../../../hooks/settings/gsuite";
import Delete from "../../../assets/icons/delete.svg";
import Edit from "../../../assets/icons/edit.svg";
import GoogleIcon from '@mui/icons-material/Google';
import { CommonCheckbox, CommonSelect } from "../../../components/common/fields";
import { useCurrencies } from "../../../hooks/settings/currency";

const GoogleColorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.49 12.27c0-.78-.07-1.53-.18-2.25H12v4.26h6.4c-.28 1.47-1.13 2.71-2.42 3.54v2.92h3.91c2.28-2.1 3.6-5.19 3.6-8.47z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.91-2.92c-1.09.73-2.48 1.16-4.02 1.16-3.09 0-5.7-2.08-6.64-4.88H1.32v3.06C3.28 21.79 7.35 24 12 24z" />
    <path fill="#FBBC05" d="M5.36 14.41c-.25-.73-.39-1.5-.39-2.41s.14-1.68.39-2.41V6.53H1.32C.48 8.03 0 9.97 0 12s.48 3.97 1.32 5.47l4.04-3.06z" />
    <path fill="#EA4335" d="M12 4.77c1.76 0 3.32.61 4.55 1.81l3.41-3.41C17.95 1.38 15.24 0 12 0 7.35 0 3.28 2.21 1.32 5.53l4.04 3.06c.94-2.8 3.55-4.82 6.64-4.82z" />
  </svg>
);

const Gsuite = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);


  const { data: tableResponse, isLoading } = useGSuite();
  const tableData = tableResponse?.data || [];
  const createGSuiteMutation = useCreateGSuite();
  const deleteGSuiteMutation = useDeleteGSuite();
  const updateServerMutation = useMakeGSuiteDefaultConfig();
  const configureGoogle = useMakeGSuiteOAuth();

  const normalizedData = tableData.map((item, index) => ({
    id: item._id,
    aliasName: item.aliasName,
    clientId: item.clientID,
    defaultServer: item.defaultserver,
    isCompletedOauth: item.isCompletedOauth,
    currency: item.currency,
    clientID: item.gsuite_config,
    original: item,
    index,
  }));

  const handleDefaultServerChange = (row, checked) => {
    updateServerMutation.mutate({
      id: row.id,
      enable: checked,
    });
  };

  const handleSubmit = () => {
    createGSuiteMutation.mutate({}, {
      onSuccess: (response) => {
        const redirectUrl = response.authUrl;
        if (redirectUrl) {
          window.open(redirectUrl, "_blank", "noopener,noreferrer");
        }
      },
    });
    setOpenDialog(false);
  };

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRow?.id) {
      deleteGSuiteMutation.mutate(selectedRow.id);
      setDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };

  const handleClick = () => {
    configureGoogle.mutate(
      {},
      {
        onSuccess: (response) => {
          const redirectUrl = response?.authUrl;
          if (redirectUrl) {
            window.open(redirectUrl, "_blank", "noopener,noreferrer");
          }
        },
        onError: (error) => {
          console.error("Google OAuth failed:", error);
        },
      }
    );
  };

  const { data: currenciesResponse = {} } = useCurrencies();
  const currencies = currenciesResponse?.data || [];


  const currencyOptions = useMemo(
    () =>
      currencies.map((item) => ({
        label: `${item.code} - ${item.country}`,
        value: item._id,
      })),
    [currencies]
  );


  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenDialog(true);
  };


  const columns = [
    {
      accessorKey: "serial",
      header: "Id",
      cell: ({ row }) => row.index + 1,
    },
    { accessorKey: "aliasName", header: "Alias Name" },
    {
      accessorKey: "clientSecret", header: "Client Secret",
      cell: ({ row }) => row.original.clientID?.clientSecret || "-",
    },

    {
      accessorKey: "currency",
      header: "Currency",
      cell: ({ row }) => row.original.currency?.code || "-",
    },
    {
      accessorKey: "defaultServer",
      header: "Default Server",
      cell: ({ row }) => (
        <CommonCheckbox
          checked={row.getValue("defaultServer")}
          onChange={(e) =>
            handleDefaultServerChange(row.original, e.target.checked)
          }
        />
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const isCompleted = row.original.isCompletedOauth;
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title={isCompleted ? "Verified" : "Google OAuth Verify"} arrow>
              <span>
                <IconButton
                  onClick={handleClick}
                  disabled={isCompleted}
                >
                  <GoogleColorIcon />
                </IconButton>
              </span>
            </Tooltip>
            <IconButton onClick={() => handleEdit(row.original)}>
              <img src={Edit} style={{ height: 15 }} />
            </IconButton>

            <IconButton onClick={() => handleDelete(row.original)}>
              <img src={Delete} style={{ height: 20 }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      {/* Header */}
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
          G-suite Configuration
        </Typography>
        <Box sx={{ mt: { xs: 1, sm: 0 } }}>
          <CommonButton
            label="Create G-OAuth"
            onClick={handleSubmit}
            startIcon={<GoogleIcon sx={{ color: '#FFF' }} />}
          />
        </Box>
      </Box>

      {/* Table */}
      <Box>
        <ReusableTable
          columns={columns}
          data={normalizedData}
          isLoading={isLoading}
          maxHeight="calc(100vh - 180px)"
        />
      </Box>

      {/* Create/Edit Dialog */}
      <GSuiteDetails
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        currencyOptions={currencyOptions}
      />

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteGSuiteMutation.isLoading}
        title="G-Suite entry"
        itemType={selectedRow?.aliasName}
      />
    </Box>
  );
};

export default Gsuite;
