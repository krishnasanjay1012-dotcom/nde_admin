import { TableCell, TableHead, TableRow } from "@mui/material";
import React from "react";

const headerCells = [
  { label: "ITEM DETAILS", width: "45%", align: "left" },
  { label: "ACCOUNT", width: "10%", align: "right" },
  { label: "QUANTITY", width: "10%", align: "right" },
  { label: "TAX", width: "15%", align: "right" },
  { label: "RATE", width: "12%", align: "right" },
  // { label: "CUSTOMER DETAILS", width: "15%", align: "right" },
  { label: "AMOUNT", width: "12%", align: "right" },
  { label: "", width: "5%", align: "left" },
];

const cellSx = {
  fontSize: 13,
  fontWeight: 400,
  color: "text.primary",
  borderBottom: "1px solid #e0e0e0",
  borderRight: "1px solid #e0e0e0",
  padding: "4px 8px",
};

const BillItemTableHeader = () => {
  return (
    <TableHead>
      <TableRow sx={{ bgcolor: "background.muted" }}>
        {headerCells.map(({ label, width, align }, i) => (
          <TableCell
            key={i}
            align={align}
            sx={{
              ...cellSx,
              width,
              ...(i === headerCells.length - 1 && { borderRight: "none" }),
            }}
          >
            {label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default BillItemTableHeader;
