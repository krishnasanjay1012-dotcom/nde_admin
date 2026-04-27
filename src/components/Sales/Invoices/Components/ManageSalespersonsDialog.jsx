import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Menu,
  MenuItem,
  Divider,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { CommonTextField } from "../../../common/fields";
import SelectMasterSalespersonDialog from "./SelectMasterSalespersonDialog";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ManageSalespersonsDialog({ open, onClose }) {
  const [salespersons, setSalespersons] = useState([
    { id: 1, name: "selva", email: "selva@iaaxin.com", inactive: false },
    {
      id: 2,
      name: "nww",
      email: "selvamarreswaranb@gmail.com",
      inactive: false,
    },
  ]);

  const [selectedIds, setSelectedIds] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [bulkAnchorEl, setBulkAnchorEl] = useState(null);
  const [mode, setMode] = useState("view");
  const [editRow, setEditRow] = useState(null);
  const [search, setSearch] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    if (editRow) reset(editRow);
    else reset({ name: "", email: "" });
  }, [editRow, reset]);

  const openForm = (row = null) => {
    setSelectedIds([]);
    setEditRow(row);
    setMode("form");
  };

  const closeForm = () => {
    setEditRow(null);
    setMode("view");
  };

  const onSubmit = (data) => {
    if (editRow) {
      setSalespersons((prev) =>
        prev.map((item) =>
          item.id === editRow.id ? { ...item, ...data } : item,
        ),
      );
    } else {
      setSalespersons((prev) => [
        ...prev,
        { id: Date.now(), ...data, inactive: false },
      ]);
    }

    closeForm();
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(salespersons.map((row) => row.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isSelected = (id) => selectedIds.includes(id);

  const handleBulkDelete = () => {
    setSalespersons((prev) =>
      prev.filter((item) => !selectedIds.includes(item.id)),
    );
    setSelectedIds([]);
    setBulkAnchorEl(null);
  };

  const handleBulkInactive = (value) => {
    setSalespersons((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, inactive: value } : item,
      ),
    );
    setSelectedIds([]);
    setBulkAnchorEl(null);
  };

  const filtered = salespersons.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()),
  );

  const isBulkMode = mode === "view" && selectedIds.length > 0;

  const [openMerge, setOpenMerge] = useState(false);
  const handleMergeOpen = () => {
    setOpenMerge(true);
    onClose();
  };
  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Manage Salespersons
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: "red" }} />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {mode === "form" && (
            <Paper sx={{ p: 2, mb: 2, background: "#f9fafb" }}>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                display="flex"
                flexWrap="wrap"
              >
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <CommonTextField
                      {...field}
                      label="Name"
                      size="small"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <CommonTextField
                      {...field}
                      label="Email"
                      size="small"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      fullWidth
                    />
                  )}
                />

                <Box display="flex" gap={2} mt={1}>
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{ backgroundColor: "#22a06b" }}
                  >
                    Save
                  </Button>

                  <Button variant="outlined" onClick={closeForm}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}

          <Box display="flex" justifyContent="space-between" mb={2}>
            <TextField
              size="small"
              placeholder="Search Salesperson"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            {selectedIds.length === 0 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ backgroundColor: "#22a06b" }}
                onClick={() => openForm()}
              >
                New Salesperson
              </Button>
            )}
          </Box>

          {isBulkMode && (
            <Box display="flex" gap={1} mb={2}>
              <Button variant="outlined" size="small" onClick={handleMergeOpen}>
                Merge
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={(e) => setBulkAnchorEl(e.currentTarget)}
              >
                More Actions
              </Button>
            </Box>
          )}

          {/* TABLE */}
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f4f5f7" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    disabled={mode === "form"}
                    checked={
                      selectedIds.length === salespersons.length &&
                      salespersons.length > 0
                    }
                    indeterminate={
                      selectedIds.length > 0 &&
                      selectedIds.length < salespersons.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>SALESPERSON NAME</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>EMAIL</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  selected={isSelected(row.id)}
                  sx={{ opacity: row.inactive ? 0.5 : 1 }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      disabled={mode === "form"}
                      checked={isSelected(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </TableCell>

                  <TableCell sx={{ px: 2, py: 1.5 }}>{row.name}</TableCell>
                  <TableCell sx={{ px: 2, py: 1.5 }}>{row.email}</TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      width: 100,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        visibility:
                          hoveredRow === row.id ? "visible" : "hidden",
                      }}
                    >
                      <IconButton size="small" onClick={() => openForm(row)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() =>
                          setSalespersons((prev) =>
                            prev.filter((item) => item.id !== row.id),
                          )
                        }
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Menu
            anchorEl={bulkAnchorEl}
            open={Boolean(bulkAnchorEl)}
            onClose={() => setBulkAnchorEl(null)}
          >
            <MenuItem onClick={() => handleBulkInactive(false)}>
              Mark as Active
            </MenuItem>
            <MenuItem onClick={() => handleBulkInactive(true)}>
              Mark as Inactive
            </MenuItem>
            <MenuItem sx={{ color: "red" }} onClick={handleBulkDelete}>
              Delete
            </MenuItem>
          </Menu>
        </DialogContent>
      </Dialog>
      <SelectMasterSalespersonDialog
        open={openMerge}
        onClose={() => setOpenMerge(false)}
        salespersons={salespersons}
        onContinue={(masterId) => {
          console.log("Selected Master:", masterId);
        }}
      />
    </>
  );
}
