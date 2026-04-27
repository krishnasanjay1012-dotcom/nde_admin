import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import CommonDialog from "../../../common/NDE-Dialog";
import CommonTextField from "../../../common/fields/NDE-TextField";
import CommonButton from "../../../common/NDE-Button";
import SettingsIcon from "@mui/icons-material/Settings";

export default function InvoiceNumberSettingsModal({
  open,
  onClose,
  onSave,
  initialSettings = {},
}) {
  const [mode, setMode] = useState("auto"); // "auto" | "manual"
  const [prefix, setPrefix] = useState("INV-");
  const [nextNumber, setNextNumber] = useState("000001");
  const [restartYearly, setRestartYearly] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(initialSettings.mode || "auto");
      setPrefix(initialSettings.prefix || "INV-");
      setNextNumber(initialSettings.nextNumber || "000001");
      setRestartYearly(initialSettings.restartYearly || false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSave = () => {
    onSave({
      mode,
      prefix,
      nextNumber,
      restartYearly,
    });
    onClose();
  };

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title="Configure Invoice Number Preferences"
      onSubmit={handleSave}
      submitLabel="Save"
      cancelLabel="Cancel"
      width={650}
    >
      <Box sx={{ px: 3, py: 2 }}>
        {/* Dynamic Alert Banner */}
        {mode === "auto" ? (
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box
              sx={{
                minWidth: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SettingsIcon sx={{ color: "#757575" }} />
            </Box>
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.5 }}
              >
                Configure multiple transaction number series to auto-generate
                transaction numbers with unique prefixes according to your
                business needs.
                <Typography
                  component="span"
                  variant="body2"
                  color="primary"
                  sx={{ cursor: "pointer", ml: 0.5, fontWeight: 500 }}
                >
                  Configure →
                </Typography>
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography
            variant="body1"
            sx={{ mb: 2, color: "text.primary", fontSize: "15px" }}
          >
            You have selected manual invoice numbering. Do you want us to
            auto-generate it for you?
          </Typography>
        )}

        {/* Main Heading Text (Only for Auto) */}
        {mode === "auto" && (
          <Typography
            variant="body1"
            sx={{ mb: 1.5, color: "text.primary", fontSize: "15px" }}
          >
            Your invoice numbers are set on auto-generate mode to save your
            time. Are you sure about changing this setting?
          </Typography>
        )}

        <RadioGroup value={mode} onChange={(e) => setMode(e.target.value)}>
          {/* Auto Option */}
          <Box sx={{ mb: mode === "auto" ? 0 : 0.5 }}>
            <FormControlLabel
              value="auto"
              control={<Radio sx={{ "&.Mui-checked": { color: "#2196f3" } }} />}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    fontSize="16px"
                    fontWeight={500}
                    color="text.primary"
                  >
                    Continue auto-generating invoice numbers
                  </Typography>
                  <SettingsIcon
                    sx={{
                      fontSize: 16,
                      color: "text.secondary",
                      ml: 1,
                      cursor: "help",
                    }}
                  />
                </Box>
              }
              sx={{ alignItems: "center", mb: 0 }}
            />

            {/* Auto Options Content (Indented) */}
            {mode === "auto" && (
              <Box
                sx={{ ml: 4, mt: 0.5, mb: 1 }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <Box sx={{ display: "flex", gap: 2, mb: 1.5 }}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontSize: "13px",
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      Prefix
                    </Typography>
                    <CommonTextField
                      value={prefix}
                      onChange={(e) => setPrefix(e.target.value)}
                      width="180px"
                      mt={0}
                      mb={0}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: "15px",
                          height: "36px",
                        },
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontSize: "13px",
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      Next Number
                    </Typography>
                    <CommonTextField
                      value={nextNumber}
                      onChange={(e) => setNextNumber(e.target.value)}
                      width="220px"
                      mt={0}
                      mb={0}
                      sx={{
                        "& .MuiInputBase-root": {
                          fontSize: "15px",
                          height: "36px",
                        },
                      }}
                    />
                  </Box>
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={restartYearly}
                      onChange={(e) => setRestartYearly(e.target.checked)}
                      sx={{
                        "&.Mui-checked": { color: "#2196f3" },
                        p: 0.5,
                        mr: 0.5,
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      fontSize="14px"
                      color="text.secondary"
                    >
                      Restart numbering for invoices at the start of each fiscal
                      year.
                    </Typography>
                  }
                  sx={{ ml: 0, alignItems: "center" }}
                />
              </Box>
            )}
          </Box>

          {/* Manual Option */}
          <Box>
            <FormControlLabel
              value="manual"
              control={<Radio sx={{ "&.Mui-checked": { color: "#2196f3" } }} />}
              label={
                <Typography
                  fontSize="16px"
                  color={mode === "manual" ? "text.primary" : "text.secondary"}
                >
                  Enter invoice numbers manually
                </Typography>
              }
              sx={{ alignItems: "center" }}
            />
          </Box>
        </RadioGroup>
      </Box>
    </CommonDialog>
  );
}
