import React, { useMemo, useState, useEffect } from "react";
import { QueryBuilder } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";

import { Box, IconButton } from "@mui/material";
import CommonSelect from "./fields/NDE-Select";
import CommonTextField from "./fields/NDE-TextField";
import CommonButton from "./NDE-Button";
import Delete from "../../assets/icons/delete.svg";
import AddIcon from "@mui/icons-material/Add";

const StableTextValueEditor = ({ value, handleOnChange }) => {
  const [localValue, setLocalValue] = useState(value || "");

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const handleBlur = () => {
    if (localValue !== value) {
      handleOnChange(localValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleOnChange(localValue);
    }
  };

  return (
    <CommonTextField
      size="small"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      width="200px"
      sx={{ mt: 0, mb: 0 }}
    />
  );
};

const CustomeViewFilter = ({
  mappedFilterFields = [],
  query,
  onQueryChange,
}) => {
  const fields = useMemo(() => {
    return mappedFilterFields.map((field) => ({
      name: field?.name,
      label: field?.label,
    }));
  }, [mappedFilterFields]);

  const mapOptions = (options = []) =>
    options.map((opt) => {
      if (typeof opt === "string") {
        return { value: opt, label: opt };
      }
      return {
        value: opt?.value ?? opt?.name ?? opt,
        label: opt?.label ?? opt?.name ?? opt,
      };
    });

  const getFieldConfig = (fieldName) =>
    mappedFilterFields.find((f) => f.name === fieldName);

  return (
    <Box
      sx={{
        background: "#f9fafb",
        p: 2,
        borderRadius: 2,
      }}
    >
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={onQueryChange}
        showCombinatorsBetweenRules
        enableMountQueryChange={false}
        controlElements={{
          combinatorSelector: (props) => (
            <CommonSelect
              size="small"
              value={props.value}
              options={[
                { value: "and", label: "AND" },
                { value: "or", label: "OR" },
              ]}
              onChange={(e) => props.handleOnChange(e.target.value)}
              height={32}
              sx={{ width: 90, mt: 0, mb: 1 }}
            />
          ),

          fieldSelector: (props) => (
            <CommonSelect
              size="small"
              value={props.value}
              options={mapOptions(props.options)}
              onChange={(e) => props.handleOnChange(e.target.value)}
              width="250px"
              sx={{ mt: 0, mb: 0 }}
            />
          ),

          operatorSelector: (props) => {
            const fieldConfig = getFieldConfig(props.field);
            const operators = fieldConfig?.operators || [];

            return (
              <CommonSelect
                size="small"
                value={props.value}
                options={mapOptions(operators)}
                onChange={(e) => props.handleOnChange(e.target.value)}
                width="200px"
                sx={{ mt: 0, mb: 0 }}
              />
            );
          },

          valueEditor: (props) => {
            const fieldConfig = getFieldConfig(props.field);

            if (["is_empty", "is_not_empty"].includes(props.operator)) {
              return null;
            }

            const hasPlans =
              fieldConfig?.plans && fieldConfig.plans.length > 0;

            if (fieldConfig?.type === "select" || hasPlans) {
              const isMulti =
                props.operator === "is_in" ||
                props.operator === "is_not_in";

              const mainValue =
                props.value?.mainValue || props.value || "";
              const planValue = props.value?.plan || "";

              return (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <CommonSelect
                    size="small"
                    multiple={isMulti}
                    value={isMulti ? mainValue || [] : mainValue}
                    options={mapOptions(fieldConfig.options || [])}
                    onChange={(e) => {
                      const newMainValue = e.target.value;
                      if (hasPlans) {
                        props.handleOnChange({
                          mainValue: newMainValue,
                          ...(planValue ? { plan: planValue } : {}),
                        });
                      } else {
                        props.handleOnChange(newMainValue);
                      }
                    }}
                    width="200px"
                    sx={{ mt: 0, mb: 0 }}
                  />

                  {hasPlans && (
                    <CommonSelect
                      size="small"
                      value={planValue}
                      options={mapOptions(fieldConfig.plans)}
                      onChange={(e) =>
                        props.handleOnChange({
                          mainValue,
                          plan: e.target.value,
                        })
                      }
                      width="200px"
                      placeholder="Select plan"
                      sx={{ mt: 0, mb: 0 }}
                    />
                  )}
                </Box>
              );
            }

            // ✅ Use StableTextValueEditor instead of inline CommonTextField
            return (
              <StableTextValueEditor
                value={props.value}
                handleOnChange={props.handleOnChange}
              />
            );
          },

          addRuleAction: (props) => (
            <CommonButton
              variant="text"
              label="Add Criterion"
              size="small"
              onClick={props.handleOnClick}
              startIcon={<AddIcon sx={{ color: "primary.main" }} />}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                color: "primary.main",
                "&:hover": {
                  background: "transparent",
                  textDecoration: "underline",
                },
              }}
            />
          ),
          addGroupAction: (props) => (
            <CommonButton
              variant="text"
              label="Add Group"
              size="small"
              onClick={props.handleOnClick}
              startIcon={<AddIcon sx={{ color: "primary.main" }} />}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                color: "primary.main",
                ml: 1,
                "&:hover": {
                  background: "transparent",
                  textDecoration: "underline",
                },
              }}
            />
          ),
          removeGroupAction: (props) => (
            <IconButton size="small" onClick={props.handleOnClick}>
              <img
                src={Delete}
                alt="delete-group"
                style={{ height: 18 }}
              />
            </IconButton>
          ),

          removeRuleAction: (props) => (
            <IconButton size="small" onClick={props.handleOnClick}>
              <img
                src={Delete}
                alt="delete"
                style={{ height: 18 }}
              />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
};

export default CustomeViewFilter;