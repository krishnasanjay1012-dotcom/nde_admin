import React, { memo, useState } from "react";
import { TableBody, TableRow, TableCell } from "@mui/material";
import { flexRender } from "@tanstack/react-table";

const MemoizedTableRow = memo(({ row, onRowClick, onCellClick, HoverComponent }) => {
  const [hover, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleRowClick = (e) => {
    e.stopPropagation();
    setClicked(true);

    setTimeout(() => {
      if (onRowClick) onRowClick(row.original);
      setClicked(false);
    }, 150);
  };

  return (
    <TableRow
      onClick={onRowClick ? handleRowClick : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      sx={{
        cursor: "pointer",
        backgroundColor: clicked === "select" ? "action.selected" : "transparent",
        "&:hover": { backgroundColor: "background.default" },
        position: "relative",
        height: 50,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          onClick={
            onCellClick && !["select", "actions"].includes(cell.column.id)
              ? (e) => {
                e.stopPropagation();
                onCellClick(row.original, cell.column.id);
              }
              : undefined
          }
          sx={{
            cursor: ["select", "actions"].includes(cell.column.id) ? "default" : "pointer",
            fontSize: { xs: "12px", sm: "14px" },
            color: "text.primary",
            fontWeight: 400,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: cell.column.id === "select" ? "50px" : 150,
            width: cell.column.id === "select" ? "50px" : "auto",
            py: 0.4,
            height: 50,
            transition: "color 0.15s ease",
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            position: "relative",
          }}
          title={cell.getValue()?.toString() || ""}
        // title={flexRender(cell.column.columnDef.cell, cell.getContext())}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}

      {hover && HoverComponent && (
        <div
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <HoverComponent row={row} />
        </div>
      )}

    </TableRow>
  );
});

const TableBodyComponent = ({ table, selectedIds, onRowClick, onCellClick, HoverComponent }) => {
  const rows = table.getRowModel().rows;

  return (
    <TableBody>
      {rows.length > 0 ? (
        rows.map((row) => (
          <MemoizedTableRow
            key={row.id}
            row={row}
            selectedIds={selectedIds}
            onRowClick={onRowClick}
            onCellClick={onCellClick}
            HoverComponent={HoverComponent}
          />
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={table.getAllColumns().length} align="center" sx={{ py: 2 }}>
            No Data Available
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default TableBodyComponent;
