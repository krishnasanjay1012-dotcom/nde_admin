import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Stack,
  IconButton,
  Skeleton,
  MenuItem,
  Select,
} from "@mui/material";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CommonButton from "./NDE-Button";
import { toast } from "react-toastify";

const ContactInlineFilter = ({
  onClose,
  onApply,
  initialRules = [],
  p = 1,
  fields = [],
}) => {
  const [property, setProperty] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);

  const inputRef = useRef(null);


  useEffect(() => {
    inputRef.current?.focus();
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!fields?.length) return;

    if (!initialRules?.length) {
      setRules([]);
      return;
    }

    const formattedRules = initialRules
      .map((rule) => {
        const fullField = fields.find((f) => f.name === rule.field);
        if (!fullField) return null;

        const validOperator =
          rule.operator ||
          fullField.operators?.[0]?.value ||
          "";

        let finalValue = rule.value ?? "";

        if (Array.isArray(fullField.value) && rule.value !== undefined) {
          const matchedOption = fullField.value.find(
            (v) => v.value === rule.value
          );
          finalValue = matchedOption?.value ?? "";
        }

        return {
          field: fullField,
          operator: validOperator,
          value: finalValue,
        };
      })
      .filter(Boolean);

    setRules(formattedRules);
  }, [initialRules, fields]);


  const handleSelect = (_, val) => {
    if (!val) return;

    if (rules?.length >= 5) {
      toast.error("Only 5 filters can be applied at a time");
      setProperty(null);
      return;
    }

    const fullField = fields.find((f) => f.name === val.value);
    if (!fullField) return;

    setRules((prev) => [
      ...prev,
      {
        field: fullField,
        operator: fullField.operators?.[0]?.value || "",
        value: "",
      },
    ]);

    setProperty(null);
  };

  const handleOperatorChange = (index, operator) => {
    setRules((prev) =>
      prev.map((rule, i) =>
        i === index ? { ...rule, operator, value: "" } : rule
      )
    );
  };

  const handleValueChange = (index, value) => {
    setRules((prev) =>
      prev.map((rule, i) =>
        i === index ? { ...rule, value } : rule
      )
    );
  };

  const handleRemove = (index) => {
    setRules((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      if (isApplied) onApply(updated);
      if (!updated.length) setIsApplied(false);

      return updated;
    });
  };


  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, p }}>
        <IconButton onClick={onClose} size="small">
          <KeyboardArrowLeftRoundedIcon sx={{ color: "primary.main" }} />
        </IconButton>
        <Typography fontWeight={500} variant="h6">
          Filter Contacts
        </Typography>
      </Box>

      {/* Property Select */}
      <Box mx={1}>
        <Autocomplete
          options={fields
            .filter(
              (f) => !rules?.some((rule) => rule.field.name === f.name)
            )
            .map((f) => ({ label: f.label, value: f.name }))}
          value={property}
          onChange={handleSelect}
          getOptionLabel={(option) => option?.label || ""}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={inputRef}
              size="small"
              placeholder="Choose property"
            />
          )}
        />
      </Box>

      {/* Rules */}
      <Box mt={1}>
        {loading ? (
          <Box p={1}>
            <Skeleton width={120} height={20} />
            <Stack spacing={1} mt={1}>
              <Skeleton height={30} />
              <Skeleton height={30} />
            </Stack>
          </Box>
        ) : (
          <Box
            sx={{
              borderTop: "2px solid #E9EDF5",
              maxHeight: "calc(90vh - 148px)",
              overflow: "auto",
            }}
          >
            {rules.map((rule, index) => {
              const isEmptyOperator =
                rule.operator === "is_empty" ||
                rule.operator === "is_not_empty";

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    alignItems: "center",
                    p: 1,
                    borderBottom: "1px solid #E9EDF5",
                    "&:hover": {
                      backgroundColor: "background.default",
                    },
                  }}
                >
                  {/* Label */}
                  <Typography fontWeight={500} sx={{ minWidth: 200 }}>
                    {rule.field?.label}
                  </Typography>

                  {/* Remove */}
                  <Box sx={{ml:4}}>
                  <IconButton
                    size="small"
                    onClick={() => handleRemove(index)}
                    color="error"
                  >
                    <CloseRoundedIcon fontSize="small" sx={{color:'error.main'}} />
                  </IconButton>
                  </Box>

                  {/* Operator */}
                  <Select
                    size="small"
                    value={rule.operator}
                    onChange={(e) =>
                      handleOperatorChange(index, e.target.value)
                    }
                    sx={{
                      minWidth: 90,
                      height: 30,
                      bgcolor: '#FAFDFF',
                      "& .MuiSelect-select": {
                        py: 0.5,
                        display: "flex",
                        alignItems: "center",
                      },
                    }}
                  >
                    {rule.field.operators.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.name}
                      </MenuItem>
                    ))}
                  </Select>

                  {/* Value Section */}
                  {!isEmptyOperator && (
                    <>
                      {/* Select / Boolean (Array Values) */}
                      {Array.isArray(rule.field.value) && (
                        <Select
                          size="small"
                          value={rule.value ?? ""}
                          onChange={(e) =>
                            handleValueChange(index, e.target.value)
                          }
                          sx={{
                            minWidth: 180,
                            height: 30,
                            bgcolor: '#FAFDFF',
                            "& .MuiSelect-select": {
                              py: 0.5,
                              display: "flex",
                              alignItems: "center",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: 100,
                            },
                          }}
                        >
                          {rule.field.value.map((v) => (
                            <MenuItem
                              key={String(v.value)}
                              value={v.value}
                            >
                              {v.label}
                            </MenuItem>
                          ))}
                        </Select>
                      )}

                      {/* Number */}
                      {rule.field.valueEditorType === "number" && (
                        <TextField
                          size="small"
                          type="number"
                          value={rule.value}
                          onChange={(e) =>
                            handleValueChange(index, e.target.value)
                          }
                          sx={{ "& .MuiInputBase-root": { height: 30 } }}
                        />
                      )}

                      {/* Date */}
                      {rule.field.valueEditorType === "date" && (
                        <TextField
                          size="small"
                          type="date"
                          value={rule.value || ""}
                          onChange={(e) =>
                            handleValueChange(index, e.target.value)
                          }
                          InputLabelProps={{ shrink: true }}
                          sx={{ "& .MuiInputBase-root": { height: 30 } }}
                        />
                      )}

                      {/* Text */}
                      {rule.field.valueEditorType === "text" && (
                        <TextField
                          size="small"
                          value={rule.value}
                          onChange={(e) =>
                            handleValueChange(index, e.target.value)
                          }
                          sx={{ "& .MuiInputBase-root": { height: 30 } }}
                        />
                      )}
                    </>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box mt="auto" pt={1} sx={{ borderTop: "1px solid #ebeaf2", mx: 1 }}>
        <Stack direction="row" spacing={2}>
          <CommonButton
            variant="contained"
            disabled={!rules?.length}
            fullWidth
            label="Apply Filter"
            startIcon
            onClick={() => {
              onApply(rules);
              setIsApplied(true);
            }}
            sx={{ borderRadius: 10, height: 34, width: 100 }} />
          <CommonButton
            variant="outlined"
            fullWidth
            startIcon
            label={rules?.length ? "Clear" : "Close"}
            onClick={() => {
              if (rules?.length) {
                setRules([]);
                onApply([]);
              } else {
                onClose();
              }
            }}
            sx={{ borderRadius: 10, height: 34, width: 100 }} />
        </Stack>
      </Box>
    </Box>
  );
};

export default ContactInlineFilter;