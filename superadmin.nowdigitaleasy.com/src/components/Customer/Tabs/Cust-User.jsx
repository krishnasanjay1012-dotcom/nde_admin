import { Box, Typography } from "@mui/material";
import ReusableTable from "../../common/Table/ReusableTable";

import { useUserByWorkspaceId } from "../../../hooks/Customer/Customer-hooks";


const CustomerUser = ({ selectedWorkspaceId }) => { 
  const  workspace_Id = selectedWorkspaceId
  const { data, isLoading } = useUserByWorkspaceId(workspace_Id);
  const tableData = data?.data || [];

  const columns = [
  {
    accessorKey: "first_name",
    header: "First Name",
    cell: ({ row }) => row.original?.first_name || "-",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original?.email || "-",
  },
   {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => row.original?.role || "-",
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
    cell: ({ row }) => row.original?.phone_number || "-",
  },
  {
    accessorKey: "country_code",
    header: "Country",
    cell: ({ row }) => row.original?.country_code || "-",
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => row.original?.city || "-",
  },

];


  return (
    <Box >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between",p:1 }}>
        <Typography variant="h4" gutterBottom>
           Users
        </Typography>
      </Box>

      {/* Table */}
      <ReusableTable columns={columns} data={tableData} isLoading={isLoading} maxHeight="calc(100vh - 240px)" skeletonRowCount={5}  />

    </Box>
  );
};

export default CustomerUser;
