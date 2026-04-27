import React, { useState } from "react";
import { TableHead, TableRow, TableCell, Box } from "@mui/material";
import { flexRender } from "@tanstack/react-table";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";

const TableHeader = ({ table, sortableColumns = [], onSortChange, topOffset = 0 }) => {

  const [sortedColumn, setSortedColumn] = useState("");
  const [sortAscending, setSortAscending] = useState(true);

  const handleSortClick = (columnId, ascending = null) => {
    let newAscending = true;

    if (ascending !== null) {
      newAscending = ascending;
    } else if (sortedColumn === columnId) {
      newAscending = !sortAscending;
    }

    setSortedColumn(columnId);
    setSortAscending(newAscending);
    onSortChange?.(columnId, newAscending ? "asc" : "desc");
  };

  return (
    <TableHead>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const columnId = header.column.id;
            const isSortable = sortableColumns.includes(columnId);
            const isActive = sortedColumn === columnId;

            return (
              <TableCell
                key={header.id}
                sx={{
                  top: topOffset,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : '#f9f9fb',
                  fontWeight: 500,
                  fontSize: "13px",
                  color: (theme) => theme.palette.mode === 'dark' ? 'text.secondary' : 'grey.800',
                  whiteSpace: "nowrap",
                  userSelect: "none",
                  height: "40px",
                  p: 0.1,
                  ...(columnId === "select" && { pl: 2, width: "50px", maxWidth: "50px" }),
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  textTransform: "uppercase",
                  cursor: isSortable ? "pointer" : "default",
                }}
                onClick={() => isSortable && handleSortClick(columnId)}
              >
                {header.isPlaceholder ? null : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      ml: columnId === "select" ? 0 : 1.5,
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {isSortable && (
                      <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 0 }}>
                        <KeyboardArrowUpRoundedIcon
                          fontSize="small"
                          sx={{
                            color: isActive && sortAscending ? "primary.main" : "grey.400",
                            cursor: "pointer",
                            mb: "-7px",
                          }}
                          onClick={() => handleSortClick(columnId, true)}
                        />
                        <KeyboardArrowDownRoundedIcon
                          fontSize="small"
                          sx={{
                            color: isActive && !sortAscending ? "primary.main" : "grey.400",
                            cursor: "pointer",
                            mt: "-5px",
                          }}
                          onClick={() => handleSortClick(columnId, false)}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableHead>
  );
};

export default TableHeader;
