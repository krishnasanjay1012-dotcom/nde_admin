import { Box } from "@mui/material";
import React, { useState } from "react";
import DnsRecordsTable from "./components/DnsRecordsTable";
import { removeTrailingDot } from "./utils/dnsValidationSchema";

const initialRecords = [
  {
    id: 1,
    host: "guna",
    type: "A",
    value: "192.168.0.1",
    ttl: 1800,
    domain: "iaaxin.com",
  },
  {
    id: 2,
    host: "gokul",
    type: "AAAA",
    value: "2001:0db8::1",
    ttl: 1800,
    domain: "iaaxin.com",
  },
];

const customStyles = {
  container: {
    mb: 0,
    p: 0,
  },
  scroll: {
    maxHeight: 480,
    overflow: "auto"
  },
  cell: {
    fontWeight: "bold",
    width: "32%",
    fontSize: 16,
    backgroundColor: "#f9f9fb",
    position: "sticky",
    top: 0,
    zIndex: 10
  },
  tableElevation: 0,
};

const MainDns = ({ domain, ZONE_ID }) => {
  const [records, setRecords] = useState(initialRecords);

  const handleSaveAll = (updatedRecords) => {
    console.log("Saving to backend:", updatedRecords);
    // axios.post("/api/dns/records", updatedRecords);
  };

  const handleRecordsChange = (updatedRecords) => {
    setRecords(updatedRecords);
  };

  return (
    <Box>
      <DnsRecordsTable
        records={records}
        domain={removeTrailingDot(domain)}
        ZONE_ID={ZONE_ID}
        onSaveAll={handleSaveAll}
        onRecordsChange={handleRecordsChange}
        showHeader={false}
        isModal={false}
        customStyles={customStyles}
      />
    </Box>
  );
};

export default MainDns;
