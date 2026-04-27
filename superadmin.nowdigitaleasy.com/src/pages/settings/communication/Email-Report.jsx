import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonBackButton from "../../../components/common/NDE-BackButton";


const EmailReport = () => {

  // Columns
    const columns = [
    { accessorKey: "userName", header: "User Name" },
    { accessorKey: "mail", header: "Mail" },
    { accessorKey: "subject", header: "Subject" },
    { accessorKey: "isSent", header: "Is Sent" },
    { accessorKey: "viewedDate", header: "Viewed Date" },
    { accessorKey: "viewCount", header: "View Count" },
    ];

  const [tableData] = useState([
   {
    userName: "Campaign A",
    mail: "2025-08-22",
    subject: "Sent",
    issent: true,
    viewedDate: "5",
    viewCount: 3,
  },
  {
    userName: "Campaign B",
    mail: "2025-08-21",
    subject: "Pending",
    issent: false,
    viewedDate: "0",
    viewCount: 0,
  },
  {
    userName: "Campaign C",
    mail: "2025-08-20",
    subject: "Sent",
    issent: true,
    viewedDate: "10",
    viewCount: 7,
  },
  ]);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CommonBackButton to="/settings/communication/bulk-email" />
        <Typography variant="h4" gutterBottom>
          Report
        </Typography>
        </Box>
      </Box>
      <ReusableTable columns={columns} data={tableData} />
    </Box>
  );
};

export default EmailReport;
