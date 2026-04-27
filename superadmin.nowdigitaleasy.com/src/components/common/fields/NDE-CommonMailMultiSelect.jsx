import { useState, useRef } from "react";
import {
  TextField,
  FormLabel,
  Box,
  Typography,
  Avatar,
  Chip,
  Paper,
  Popper,
  ClickAwayListener,
  List,
  ListItemButton,
  Divider,
  Button,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

const CommonemailMultiSelect = ({
  label,
  value = [],
  onChange,
  name,
  options = [],
  mandatory,
  cc,
  bcc,
  handleCc = () => {},
  handleBcc = () => {},
  addNewLabel,
  multiple = true,
  onAddNew = () => {},
  disabled = false,
}) => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // helper to extract first name
  const getFirstName = (opt) =>
    opt?.first_name || opt?.name_details?.first_name || "";

  // helper to extract last name
  const getLastName = (opt) =>
    opt?.last_name || opt?.name_details?.last_name || "";

  // helper to extract full name
  const getDisplayName = (opt) =>
    opt?.heading ||
    opt?.label ||
    opt?.full_name ||
    `${getFirstName(opt)} ${getLastName(opt)}`.trim();

  const selectedOptions = options.filter((o) =>
    value.find((v) => v.email === o.email)
  );

  const filteredOptions = options.filter(
    (o) =>
      o?.label?.toLowerCase().includes(search.toLowerCase()) ||
      o?.heading?.toLowerCase().includes(search.toLowerCase()) ||
      o?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (opt) => {
    let newValues;

    if (multiple) {
      const exists = value.filter((v) => v.email === opt.email);

      newValues = exists.length
        ? value.filter((v) => v.email !== opt.email)
        : [
            ...value,
            {
              email: opt.email,
              first_name: getFirstName(opt),
              last_name: getLastName(opt),
            },
          ];
    } else {
      newValues = [
        {
          email: opt.email,
          first_name: getFirstName(opt),
          last_name: getLastName(opt),
        },
      ];
      setOpen(false);
    }

    onChange({
      target: {
        name,
        value: newValues,
      },
    });

    handleClose();
  };

  const handleRemove = (opt) => {
    const newValues = value.filter((v) => v.email !== opt.email);

    onChange({
      target: {
        name,
        value: newValues,
      },
    });
  };

  return (
    <>
      {label && (
        <FormLabel>
          {label}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </FormLabel>
      )}

      <Box
        ref={anchorRef}
        onClick={() => {
          if (disabled) return;
          handleOpen();
        }}
        sx={{ cursor: "pointer" }}
        display={"flex"}
        alignItems={"center"}
        minHeight={30}
      >
        <Box
          sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
          width={"100%"}
        >
          {selectedOptions.map((opt) =>
            multiple ? (
              <Chip
                key={opt.email}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: "6px",
                        background: "#e9ebf3",
                        border: "2px solid #fff",
                        fontSize: "12px",
                        color: "black",
                      }}
                    >
                      {typeof opt.avatar === "string" ? (
                        <img
                          src={opt.avatar}
                          alt={getDisplayName(opt)}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        opt?.avatar ??
                        getDisplayName(opt)?.[0]
                      )}
                    </Avatar>

                    <Typography variant="body2">
                      {getDisplayName(opt)}
                    </Typography>

                    <Typography variant="body2">
                      {opt.mail || opt.email}
                    </Typography>

                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(opt);
                      }}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <ClearIcon
                        className="clear-btn"
                        style={{ fontSize: 14 }}
                      />
                    </Box>
                  </Box>
                }
                sx={{
                  borderRadius: "6px",
                  backgroundColor: "#e9ebf3",
                  color: "black",
                  border: "1px solid transparent",
                  "&:hover": {
                    backgroundColor: "white",
                    border: "1px solid #e9ebf3",
                    ".clear-btn": { color: "red" },
                  },
                  "& .MuiChip-deleteIcon": {
                    display: "none",
                  },
                }}
              />
            ) : (
              <Box display={"flex"} alignItems={"center"} gap={0.5}>
                <Typography variant="body2">
                  {getDisplayName(opt)}
                </Typography>
                <Typography variant="body2">{opt.email}</Typography>
              </Box>
            )
          )}
        </Box>

        <Box display="flex" alignItems="center" gap={1} flex={1}>
          {cc && (
            <Button
              variant="text"
              size="small"
              sx={{
                minWidth: "auto",
                padding: "2px 6px",
                textTransform: "none",
              }}
              onClick={(e) => handleCc(e)}
            >
              Cc
            </Button>
          )}
          {bcc && (
            <Button
              variant="text"
              size="small"
              sx={{
                minWidth: "auto",
                padding: "2px 6px",
                textTransform: "none",
              }}
              onClick={(e) => handleBcc(e)}
            >
              Bcc
            </Button>
          )}
        </Box>
      </Box>

      <Popper
        open={open && !disabled}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper elevation={3}>
            <Box p={1} borderBottom="1px solid #eee">
              <TextField
                fullWidth
                size="small"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Box>

            <List dense sx={{ maxHeight: 240, overflowY: "auto" }}>
              {filteredOptions.map((opt) => {
                const selected = value.find(
                  (v) => v?.email === opt?.email
                );

                return (
                  <ListItemButton
                    key={opt.email}
                    selected={!!selected}
                    onClick={() => toggleOption(opt)}
                  >
                    <Avatar sx={{ width: 28, height: 28, mr: 1 }}>
                      {typeof opt.avatar === "string" ? (
                        <img
                          src={opt.avatar}
                          alt={getDisplayName(opt)}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        opt?.avatar ??
                        getDisplayName(opt)?.[0]
                      )}
                    </Avatar>

                    <Box>
                      <Typography fontWeight={500}>
                        {getDisplayName(opt)}
                      </Typography>

                      {opt.email && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {opt.email}
                        </Typography>
                      )}
                    </Box>
                  </ListItemButton>
                );
              })}
            </List>

            <Divider />

            {addNewLabel && (
              <Box
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onAddNew();
                  setOpen(false);
                }}
                sx={{
                  px: 1.5,
                  py: 1.2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  fontWeight: 500,
                  "&:hover": { backgroundColor: "#F4F7FE" },
                }}
              >
                <AddIcon fontSize="small" style={{ color: "#3A7BFF" }} />
                <Typography fontSize={14} color="#3A7BFF">
                  {addNewLabel}
                </Typography>
              </Box>
            )}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default CommonemailMultiSelect;