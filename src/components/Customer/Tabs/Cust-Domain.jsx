import { useState } from "react";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import { useParams } from "react-router-dom";
import CommonButton from "../../common/NDE-Button";
import DomainDetails from "./Customer-Domain-Create-Edit";
import ReusableTable from "../../common/Table/ReusableTable";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import CustomPagination from "../../common/Table/TablePagination";
import { useDomains } from "../../../hooks/Customer/Customer-hooks";
import DomainRenewal from "../../common/Domain-Renewal";
import IconButton from "@mui/material/IconButton";
import DnsIcon from "@mui/icons-material/Dns";
import CommonDrawer from "../../common/NDE-Drawer";
import RowActions from "../../common/NDE-CustomMenu";
import RepartitionIcon from '@mui/icons-material/Repartition';
import MainDns from "./DnsRecordsTable/index";
import { useZoneByName } from "../../../hooks/dns/useDnshooks";

const CustomerDomain = ({ selectedWorkspaceId }) => {
  const { customerId } = useParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dnsDrawerOpen, setDnsDrawerOpen] = useState(false);

  const { data, isLoading } = useDomains({
    page,
    limit: limit,
    userId: customerId,
    workspace_Id: selectedWorkspaceId,
  });
  const activeDomain = selectedProduct?.domainName;
  const domainQuery = activeDomain ? (activeDomain.endsWith('.') ? activeDomain : `${activeDomain}.`) : null;
  const { data: zoneData } = useZoneByName("example.com.");
  const zoneId = zoneData?._id;

  const paginatedInfo = data?.paginatedData || {};

  const tableData = (data?.data || []).map((item) => ({
    _id: item._id,
    domainName: item.DomainName,
    planName: item.planName,
    productName: item.productName,
    productId: item?.productId,
    Status: item?.Status,
    workspaceId: item?.workspaceId,
    purchasedDate: new Date(item.purchasedDate).toLocaleDateString(),
    expiryDate: new Date(item.expiryDate).toLocaleDateString(),
  }));

  const addNewEntry = async (newData) => {
    try {
      // await createDomain(customerId, newData);
    } catch (err) {
      console.error("Error adding domain:", err);
    }
  };

  const updateEntry = async (id, updatedData) => {
    try {
      // await updateDomain(id, updatedData);
    } catch (err) {
      console.error("Error updating domain:", err);
    }
  };

  const handleDelete = (rowData) => {
    setSelectedRow(rowData);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedRow) return;
    try {
      // await deleteDomain(selectedRow.id);
    } catch (err) {
      console.error("Error deleting domain:", err);
    } finally {
      setDeleteModalOpen(false);
      setSelectedRow(null);
    }
  };

  const handleEdit = (rowData) => {
    setSelectedRow(rowData);
    setOpenDialog(true);
  };

  const handleRowClick = (rowData) => {
    setSelectedProduct(rowData);
    setDrawerOpen(true);
  };

  const columns = [
    { accessorKey: "domainName", header: "Domain Name" },
    { accessorKey: "Status", header: "Status" },
    { accessorKey: "purchasedDate", header: "Purchased Date" },
    { accessorKey: "expiryDate", header: "Expiry Date" },
    // {
    //   accessorKey: "action",
    //   header: "Action",
    //   cell: ({ row }) => (
    //     <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
    //       <Tooltip title="DNS Settings" arrow>
    //         <IconButton
    //           size="small"
    //           onClick={(e) => {
    //             e.stopPropagation();
    //             setSelectedProduct(row.original);
    //             setDnsDrawerOpen(true);
    //           }}
    //         >
    //           <DnsIcon fontSize="small" sx={{ color: 'primary.main' }} />
    //         </IconButton>
    //       </Tooltip>

    //       <Button
    //         variant="outlined"
    //         size="small"
    //         onClick={(e) => {
    //           e.stopPropagation();
    //           handleRowClick(row.original);
    //         }}
    //         sx={{
    //           height: 26,
    //           borderColor: "primary.main",
    //           backgroundColor: "primary.extraLight",
    //           fontSize: 12,
    //           color: "primary.main",
    //           "&:hover": {
    //             backgroundColor: "primary.extraLight",
    //             borderColor: "primary.main",
    //           },
    //         }}
    //       >
    //         Renew
    //       </Button>
    //     </Box>
    //   ),
    // }
  ];

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1
        }}
      >
        <Typography variant="h4" gutterBottom>
          Domain
        </Typography>
        <CommonButton
          label="Add Domain"
          onClick={() => {
            setSelectedRow(null);
            setOpenDialog(true);
          }}
        />
      </Box>

      {/* Table */}
      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        // onRowClick={handleRowClick}
        skeletonRowCount={5}
        maxHeight="calc(100vh - 280px)"
        HoverComponent={({ row }) => (
          <RowActions
            rowData={row.original}
            actions={[
              {
                key: "dns",
                label: "DNS Settings",
                icon: <DnsIcon sx={{ color: "primary.main", fontSize: 20 }} />,
                onClick: (data, e) => {
                  e?.stopPropagation();
                  setSelectedProduct(data);
                  setDnsDrawerOpen(true);
                },
              },
              {
                key: "renew",
                label: "Renew",
                icon: <RepartitionIcon sx={{ color: "primary.main", fontSize: 20 }} />,
                onClick: (data, e) => {
                  e?.stopPropagation();
                  handleRowClick(data);
                },
              },
            ]}
          />
        )}
      />

      {/* Pagination */}
      <CustomPagination
        count={paginatedInfo.totalPages || 0}
        page={(paginatedInfo.page ? Number(paginatedInfo.page) : page) - 1}
        rowsPerPage={Number(paginatedInfo.limit) || limit}
        onPageChange={(_, newPage) => setPage(newPage + 1)}
        onRowsPerPageChange={(e) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      />

      {/* Add/Edit Dialog */}
      <DomainDetails
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedRow}
        clientId={customerId}
        selectedWorkspaceId={selectedWorkspaceId}
        onSubmitAction={(data) => {
          if (selectedRow) {
            updateEntry(selectedRow.id, data);
          } else {
            addNewEntry(data);
          }
        }}
      />

      {/* Delete Modal */}
      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={false}
        itemType="Domain"
      />

      {/* Domain Renewal Drawer */}
      <DomainRenewal
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        productId={selectedProduct?.productId}
        userId={customerId}
        selectedProduct={selectedProduct}
      />

      <CommonDrawer
        open={dnsDrawerOpen}
        onClose={() => setDnsDrawerOpen(false)}
        anchor="right"
        width={1000}
        title="DNS Record"
      >
        <Box>
          {zoneId ? (
            <MainDns domain={"example.com."} ZONE_ID={zoneId} />
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "60vh"
              }}
            >
              <Typography color="text.secondary">No DNS Zone data found</Typography>
            </Box>
          )}
        </Box>
      </CommonDrawer>
    </Box>
  );
};

export default CustomerDomain;
