import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import SeriesSettings from "./SeriesSettings";
import { useGetAllCounters } from "../../../hooks/settings/transaction-series-hooks";
import CommonButton from "../../../components/common/NDE-Button";
import Transactions from './../../../components/Customer/Tabs/Cust-Transactions';

const SeriesSettingsWrapper = () => {
  const [editMode, setEditMode] = useState(false);
  const handleClose = () => setEditMode(false);

  const { data: counterList, isLoading } = useGetAllCounters();

  return (
    <Box height={"100%"} display={"flex"} flexDirection={"column"}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={1}
      >
        <Typography variant="h4">Transaction Series</Typography>

        {!editMode && (
          <CommonButton
            variant="outlined"
            onClick={() => setEditMode(true)}
            label={"Edit"}
            startIcon={false}
          />
        )}
      </Box>

      <SeriesSettings
        editMode={editMode}
        onClose={handleClose}
        counterList={counterList?.counters ?? []}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default SeriesSettingsWrapper;