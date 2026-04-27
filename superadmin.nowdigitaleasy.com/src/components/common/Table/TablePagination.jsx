import { TablePagination } from "@mui/material";

const CustomPagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={[10, 20, 50, 100]}
      sx={{
        "& .MuiTablePagination-toolbar": {
          minHeight: 20,
          paddingTop: 0,
          paddingBottom: 0,
        },
        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
          {
            color: "text.secondary",
            fontSize: "0.875rem",
          },
        "& .MuiTablePagination-selectIcon": {
          color: "text.secondary",
        },
        "& .MuiTablePagination-actions button": {
          color: "text.secondary",
        },
        //
        "& .MuiTablePagination-displayedRows": {
          // display: "none",
        },
        // Also remove margin from the InputBase wrapper if needed
        "& .MuiInputBase-root.MuiTablePagination-select": {
          // marginRight: -2,
        },
      }}
    />
  );
};

export default CustomPagination;
