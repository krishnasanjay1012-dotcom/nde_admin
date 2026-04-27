import React from "react";
import { useItemTransactions } from "../../hooks/account/account-hooks";
import { Box, Typography } from "@mui/material";
import ReusableTable from "../common/Table/ReusableTable";

const JournalComponent = ({ journalId }) => {
  const { data, isLoading } = useItemTransactions(journalId);

  const journalData = data?.data?.entries || [];
  const journalDetails = data?.data?.accountDetails || {};

  const columns = [
    { accessorKey: "accountName", header: "Account" },
    { accessorKey: "formattedDebit", header: "Debit" },
    { accessorKey: "formattedCredit", header: "Credit" },
  ];

  return (
    <Box>
      <Typography variant="body1" mt={2}>
        Amount is displayed in your base currency{" "}
        <Box
          component="span"
          sx={{
            backgroundColor: "success.main",
            color: "icon.light" ,
            borderRadius: 1,
            p:0.5,
          }}
        >
          {journalDetails?.accountCurrency?.currencyId?.code}
        </Box>
      </Typography>

      <Typography variant="h6" mb={2} mt={2}>
        {journalDetails?.formattedEntity}
      </Typography>

      <ReusableTable
        columns={columns}
        data={journalData}
        isLoading={isLoading}
        maxHeight="calc(100vh - 180px)"
      />
    </Box>
  );
};

export default JournalComponent;