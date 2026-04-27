import { Box } from "@mui/material";
import ReusableTable from "../../common/Table/ReusableTable";

import { useSubscriptionsByUser } from "../../../hooks/Customer/Customer-hooks";
import { useParams } from "react-router-dom";

const SubscriptionsByUser = ({ selectedWorkspaceId }) => { 

  const { customerId } = useParams();
  const  workspace = selectedWorkspaceId
  const { data, isLoading } = useSubscriptionsByUser({user:customerId,workspace:workspace});
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
      <ReusableTable columns={columns} data={tableData} isLoading={isLoading} skeletonRowCount={5}  />
    </Box>
  );
};

export default SubscriptionsByUser;
