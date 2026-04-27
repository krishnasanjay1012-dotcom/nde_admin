import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});



const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "#fff",
  borderRadius: 2,
  boxShadow: 24,
};

export default function ConfigureEmailModal({ open, onClose }) {
  const [senders, setSenders] = useState([initialSender]);
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSetPrimary = (id) => {
    setSenders((prev) =>
      prev.map((s) => ({
        ...s,
        primary: s.id === id,
      })),
    );
  };

  /* ---------------- Submit ---------------- */

  const onSubmit = (data) => {
    if (editingId) {
      setSenders((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...data } : s)),
      );
      setEditingId(null);
    } else {
      setSenders((prev) => [
        ...prev,
        { id: Date.now(), ...data, primary: false },
      ]);
      setAdding(false);
    }
    reset();
  };

  /* ---------------- Delete ---------------- */

  const handleDelete = (id) => {
    setSenders((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (!filtered.some((s) => s.primary) && filtered.length) {
        filtered[0].primary = true;
      }
      return [...filtered];
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <Typography fontSize={18} fontWeight={600}>
            Organization Senders
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Box display="flex" px={2} py={1} color="text.secondary">
          <Box width="30%">Name</Box>
          <Box width="50%">Email Address</Box>
          <Box width="20%" />
        </Box>

        <Divider />

        {senders.map((sender) =>
          editingId === sender.id ? (
            <Box
              key={sender.id}
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              display="flex"
              gap={1.5}
              py={1}
              px={2}
              alignItems="center"
            >
              <TextField
                size="small"
                fullWidth
                {...register("name")}
                defaultValue={sender.name}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <TextField
                size="small"
                fullWidth
                {...register("email")}
                defaultValue={sender.email}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <Button type="submit" size="small" variant="contained">
                Save
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setEditingId(null);
                  reset();
                }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Box
              key={sender.id}
              display="flex"
              alignItems="center"
              py={1}
              px={2}
              sx={{
                "&:hover .row-actions": { visibility: "visible" },
              }}
            >
              <Box width="30%">
                <Typography fontSize={14}>{sender.name}</Typography>
              </Box>

              <Box width="30%" display="flex" gap={1} alignItems="center">
                <Typography fontSize={14}>{sender.email}</Typography>
              </Box>
              <Box>
                {sender.primary && (
                  <Typography
                    fontSize={12}
                    sx={{
                      bgcolor: "green",
                      color: "#fff",
                      px: 1,
                      borderRadius: 0.5,
                    }}
                  >
                    Primary
                  </Typography>
                )}

                {!sender.primary && (
                  <Typography
                    fontSize={12}
                    className="row-actions"
                    sx={{
                      color: "#1976d2",
                      cursor: "pointer",
                      visibility: "hidden",
                    }}
                    onClick={() => handleSetPrimary(sender.id)}
                  >
                    Mark as Primary
                  </Typography>
                )}
              </Box>

              <Box
                width="20%"
                textAlign="right"
                className="row-actions"
                sx={{ visibility: "hidden" }}
              >
                <IconButton
                  size="small"
                  onClick={() => {
                    setEditingId(sender.id);
                    reset(sender);
                  }}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => handleDelete(sender.id)}
                >
                  <DeleteOutlineOutlinedIcon
                    fontSize="small"
                    sx={{ color: "red" }}
                  />
                </IconButton>
              </Box>
            </Box>
          ),
        )}

        {adding ? (
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            gap={1.5}
            py={2}
            px={2}
          >
            <TextField
              size="small"
              placeholder="Name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              size="small"
              placeholder="Email address"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <Button type="submit" size="small" variant="contained">
              Save
            </Button>
            <Button
              size="small"
              onClick={() => {
                setAdding(false);
                reset();
              }}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <Button sx={{ mt: 2 }} onClick={() => setAdding(true)} p={2}>
            + Add Additional Contact
          </Button>
        )}
      </Box>
    </Modal>
  );
}
