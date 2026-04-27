import { useState } from "react";
import { Box, Typography, TextField, Switch } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CommonButton from "../../../../../../components/common/NDE-Button";

export default function GeneralTab({ record }) {
  const [form, setForm] = useState({
    name: record?.name || "",
    number: record?.number || "",
    recordCalls: true,
  });

  return (
    <Box sx={{ maxWidth: 520, pt: 1 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Number
      </Typography>

      {/* number name */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 500 }}>
          Number name
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </Box>

      {/* virtual number*/}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 500 }}>
          Virtual number
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={form.number}
          InputProps={{ readOnly: true }}
          sx={{ "& .MuiInputBase-root": { bgcolor: "background.default" } }}
        />
      </Box>

      {/* record calls toggle */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
        <Switch
          checked={form.recordCalls}
          onChange={(e) =>
            setForm((f) => ({ ...f, recordCalls: e.target.checked }))
          }
          color="primary"
        />
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Record calls
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Automatically record all incoming and outgoing calls to this virtual
            number.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <CommonButton
          label="Save"
          startIcon={<SaveOutlinedIcon sx={{ color: "icon.light" }} />}
          onClick={() => {}}
        />
      </Box>
    </Box>
  );
}
