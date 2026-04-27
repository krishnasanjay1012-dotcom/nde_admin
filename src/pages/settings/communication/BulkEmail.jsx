import { useState, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonButton from "../../../components/common/NDE-Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BulkEmailDetails from "../../../components/settings/communication/BulkEmail-Create"; 
import CommonSelect from "../../../components/common/fields/NDE-Select";
import { useBulkMail, useEmailCampaignNames } from "../../../hooks/settings/email-hooks"; 
import CustomPagination from "../../../components/common/Table/TablePagination";

const BulkEmail = () => {
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState("all"); 
  const [campaignId, setCampaignId] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useBulkMail({
    filter,
    page,
    limit,
    campaignId,
  });

  const { data: campaignList = [] } = useEmailCampaignNames();

  const campaignOptions = [
    { label: "All", value: "all" },
    ...campaignList.map((c) => ({
      label: c.campaignName,
      value: c._id, 
    })),
  ];


  const tableData =
    data?.data?.map((item) => ({
      id: item._id,
      campaign: item.campaignName,
      sendDate: item.sendDate
        ? new Date(item.sendDate).toLocaleDateString()
        : "-",
      status: item.status
        ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
        : "-",
      subject: item.subject || "-",
      totalMail: item.totalEmail || 0,
      viewCount: item.viewedCount || 0,
    })) || [];

  
  const handleView = (row) => {
    navigate(`/settings/communication/bulk-email/report`, {
      state: { id: row.id },
    });
  };

  
  const handleCampaignChange = (value) => {
    if (value === "all") {
      setFilter("all");
      setCampaignId("");
    } else {
      setFilter("custom");
      setCampaignId(value);
    }
    setPage(1);
  };

  
  const columns = useMemo(
    () => [
      { accessorKey: "campaign", header: "Campaign" },
      { accessorKey: "sendDate", header: "Send Date" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "subject", header: "Subject" },
      { accessorKey: "totalMail", header: "Total Mail" },
      { accessorKey: "viewCount", header: "View Count" },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton onClick={() => handleView(row.original)}>
              <VisibilityIcon sx={{ color: "#919191", fontSize: 20 }} />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <Box>
      {/* Header & Select */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={{ xs: 2, sm: 0 }}
        p={1}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={2}
        >

          <CommonSelect
            value={campaignId || "all"} 
            onChange={(e) => handleCampaignChange(e.target.value)}
            options={campaignOptions}
            mt={0}
            width="120px"
            mb={0}
          />
        </Box>
        <CommonButton label="Send Mail" onClick={() => setOpenDialog(true)} />
      </Box>

      {/* Table */}
      <>
        <ReusableTable
          columns={columns}
          data={tableData}
          isLoading={isLoading}
          maxHeight="calc(94vh - 200px)"
        />

        {/* Pagination */}
        <CustomPagination
          count={data?.paginatedData?.totalPages || 0}
          page={page - 1}
          rowsPerPage={limit}
          onPageChange={(_, newPage) => setPage(newPage + 1)}
          onRowsPerPageChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        />
      </>

      {/* Bulk Email Dialog */}
      <BulkEmailDetails open={openDialog} setOpen={setOpenDialog} />
    </Box>
  );
};

export default BulkEmail;
