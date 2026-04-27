import { AddCircleRounded, RemoveCircleOutlined } from "@mui/icons-material";
import { Chip, Typography } from "@mui/material";

import { Box, Tooltip, useTheme } from "@mui/material";
import dayjs from "dayjs";
import {
  CommonDatePicker,
  CommonMultiSelect,
  CommonSelect,
  CommonTextField,
} from "../../../../../../components/common/fields";
import CommonMultiSelectWithPagination from "../../../../../../components/common/fields/NDE-MultiSelectWithPagination";
import { getRefList } from "../../../../../../services/global-dashboard/global-dashboard";
const formatOperatorLabel = (op) => {
  const map = {
    eq: "Equals",
    ne: "Not Equals",
    gt: "Greater Than",
    gte: "Greater Than or Equal",
    lt: "Less Than",
    lte: "Less Than or Equal",
    contains: "Contains",
    startsWith: "Starts With",
    endsWith: "Ends With",
    in: "In",
    nin: "Not In",
    isNull: "Is Empty",
    isNotNull: "Is Not Empty",
    between: "Between",
    not_between: "Not Between",
  };

  return map[op] || op;
};

export default function CriteriaInput({
  criteriaFiltersFields,
  item,
  index,
  count,
  remove,
  AddNew,
  handleChange,
}) {
  const theme = useTheme();
  const isArrayCondition = () =>
    ["in", "nin", "between", "notBetween"]?.includes(item?.condition);
  let selected = criteriaFiltersFields?.find((i) => i?.field === item?.field);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: theme.palette.primary.dark,
            border: `2px solid ${theme.palette.grey[300]}`,
          }}
        >
          {index + 1}
        </Box>

        <Box
          sx={{
            display: "flex",
            // border: `1px solid ${theme.palette.grey[400]}`,
            height: "40px",
            width: "calc(100% - 110px)",
            borderRadius: 2,
            bgcolor: "background.default",

            alignItems: "center",
          }}
        >
          <CommonSelect
            searchable={true}
            value={item?.field}
            options={criteriaFiltersFields}
            onChange={(e) =>
              handleChange(
                {
                  field: e.target.value,
                  condition: e.target.value ? selected?.operators?.[0] : "",
                  value: "",
                  type: criteriaFiltersFields?.find(
                    (i) => i?.field === e.target.value,
                  )?.type,
                  ref: criteriaFiltersFields?.find(
                    (i) => i?.field === e.target.value,
                  )?.ref,
                },
                index,
              )
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
                boxShadow: "none",

                "&.Mui-focused": {
                  boxShadow: "none",
                },

                "&:hover": {
                  boxShadow: "none",
                },

                "& fieldset": {
                  borderRadius: "8px 0 0 8px",
                },
              },
            }}
            mt={2}
            height={"40px"}
            width="200px"
          />
          <CommonSelect
            searchable={true}
            value={item?.condition ?? ""}
            options={selected?.operators?.map((i) => ({
              label: formatOperatorLabel(i),
              value: i,
            }))}
            onChange={(e) =>
              handleChange(
                {
                  field: item?.field,
                  ref: item?.ref,
                  condition: e.target.value,
                  type: item?.type,
                  value: item?.ref ? [] : "",
                },
                index,
              )
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "40px",
                boxShadow: "none",

                "&.Mui-focused": {
                  boxShadow: "none",
                },

                "&:hover": {
                  boxShadow: "none",
                },

                "& fieldset": {
                  borderRadius: "0",
                },
              },
            }}
            mt={2}
            height={"40px"}
            width="200px"
          />
          {!["isNotNull", "isNull"]?.includes(item?.condition) ? (
            <>
              {/* third */}
              {selected?.type === "number" && (
                <CommonTextField
                  value={isArrayCondition() ? item?.value?.[0] : item?.value}
                  onChange={(e) =>
                    handleChange(
                      {
                        field: item?.field,
                        condition: item?.condition,
                        type: item?.type,

                        value: isArrayCondition()
                          ? [e.target.value, item?.value?.[1]]
                          : e.target.value,
                      },
                      index,
                    )
                  }
                  width="199px"
                  type="number"
                  mt={2}
                  sx={{
                    border: "none",
                    "& .MuiOutlinedInput-root": {
                      height: "40px",
                      boxShadow: "none",

                      border: "none",
                      "&.Mui-focused": {
                        boxShadow: "none",
                      },

                      "&:hover": {
                        boxShadow: "none",
                      },

                      "& fieldset": {
                        borderRadius: "0 8px 8px 0",
                      },
                    },
                  }}
                  placeholder={"Enter value (number)"}
                  // helperText={"error"}
                  // error={true}
                  inputProps={{ min: 0 }}
                />
              )}
              {selected?.type === "string" && (
                <CommonTextField
                  value={isArrayCondition() ? item?.value?.[0] : item?.value}
                  onChange={(e) =>
                    handleChange(
                      {
                        field: item?.field,
                        condition: item?.condition,
                        type: item?.type,

                        value: isArrayCondition()
                          ? [e.target.value, null]
                          : e.target.value,
                      },
                      index,
                    )
                  }
                  width="199px"
                  type="text"
                  mt={2}
                  sx={{
                    border: "none",
                    "& .MuiOutlinedInput-root": {
                      height: "40px",
                      boxShadow: "none",

                      border: "none",
                      "&.Mui-focused": {
                        boxShadow: "none",
                      },

                      "&:hover": {
                        boxShadow: "none",
                      },

                      "& fieldset": {
                        borderRadius: "0 8px 8px 0",
                      },
                    },
                  }}
                  placeholder={"Enter value"}
                  // helperText={"error"}
                  // error={true}
                  inputProps={{ max: 500, min: 0 }}
                />
              )}
              {selected?.type === "select" &&
                !["in", "nin"]?.includes(item?.condition) && (
                  <CommonSelect
                    searchable={true}
                    value={item?.value}
                    options={selected?.options}
                    onChange={(e) =>
                      handleChange(
                        {
                          field: item?.field,
                          condition: item?.condition,
                          type: item?.type,

                          value: e.target.value,
                        },
                        index,
                      )
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: "40px",
                        boxShadow: "none",

                        "&.Mui-focused": {
                          boxShadow: "none",
                        },

                        "&:hover": {
                          boxShadow: "none",
                        },

                        "& fieldset": {
                          borderRadius: " 0 8px  8px 0 ",
                        },
                      },
                    }}
                    mt={2}
                    height={"40px"}
                    width="199px"
                  />
                )}
              {selected?.type === "boolean" && (
                <CommonSelect
                  searchable={true}
                  value={item?.value}
                  options={[
                    { label: "True", value: "true" },
                    { label: "False", value: "false" },
                  ]}
                  onChange={(e) =>
                    handleChange(
                      {
                        field: item?.field,
                        condition: item?.condition,
                        value: e.target.value,
                        type: item?.type,
                      },
                      index,
                    )
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "40px",
                      boxShadow: "none",

                      "&.Mui-focused": {
                        boxShadow: "none",
                      },

                      "&:hover": {
                        boxShadow: "none",
                      },

                      "& fieldset": {
                        borderRadius: " 0 8px  8px 0 ",
                      },
                    },
                  }}
                  mt={2}
                  height={"40px"}
                  width="199px"
                />
              )}
              {selected?.type === "select" &&
                ["in", "nin"]?.includes(item?.condition) && (
                  <CommonMultiSelect
                    value={item?.value}
                    options={selected?.options}
                    placeholder={"Select"}
                    onChange={(e) =>
                      handleChange(
                        {
                          field: item?.field,
                          condition: item?.condition,
                          type: item?.type,

                          value: e.target.value?.filter((i) => i),
                        },
                        index,
                      )
                    }
                    mt={2}
                    width="205px"
                    renderValue={(selected, getItemProps) => {
                      const visible = selected.slice(0, 1);
                      const hidden = selected.length - 1;
                      if (!selected?.length) {
                        return <Typography variant="body2">Select</Typography>;
                      }
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            gap: 0.5,
                          }}
                        >
                          {visible.map((opt, index) => (
                            <Chip
                              size="small"
                              {...getItemProps({ index })}
                              key={opt.value}
                              label={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      maxWidth: "50px",
                                    }}
                                  >
                                    {opt.label}
                                  </Typography>{" "}
                                </Box>
                              }
                            />
                          ))}

                          {hidden > 0 && (
                            <Chip
                              size="small"
                              label={`+${hidden}`}
                              sx={{
                                border: "1px dashed #aaa",
                                bgcolor: "transparent",
                              }}
                            />
                          )}
                        </Box>
                      );
                    }}
                    sx={{
                      "& .MuiAutocomplete-popupIndicator": {
                        p: 0,
                      },
                      "& .MuiAutocomplete-clearIndicator": {
                        p: 0,
                      },
                      "& .MuiAutocomplete-inputRoot": {
                        height: "40px",
                      },
                      "& .MuiInputBase-input": {
                        display: item?.value?.length ? "none" : "block",
                      },
                      "& .MuiOutlinedInput-root": {
                        py: item?.value?.length > 1 ? "5.5px" : 0,
                        boxShadow: "none",
                        "&.Mui-focused": {
                          boxShadow: "none",
                        },

                        "&:hover": {
                          boxShadow: "none",
                        },

                        "& fieldset": {
                          borderRadius: " 0 8px  8px 0 ",
                        },
                      },
                    }}
                  />
                )}

              {selected?.type === "date" &&
                [
                  "eq",
                  "ne",
                  "gt",
                  "gte",
                  "lt",
                  "lte",
                  "between",
                  "not_between",
                ]?.includes(item?.condition) && (
                  <CommonDatePicker
                    width="199px"
                    sx={{
                      "& .MuiPickersOutlinedInput-root": {
                        height: "40px",
                        borderRadius: "0 8px 8px 0",
                      },
                      "& fieldset": {
                        height: "45px",
                        padding: 0,
                        margin: 0,
                      },
                      "& .MuiSvgIcon-root": {
                        fontSize: "20px",
                        mt: "2px",
                      },
                    }}
                    value={
                      ["between", "not_between"]?.includes(item?.condition)
                        ? item?.value?.[0] || undefined
                        : item?.value || undefined
                    }
                    onChange={(e) =>
                      handleChange(
                        {
                          field: item?.field,
                          condition: item?.condition,
                          type: item?.type,

                          value: ["between", "not_between"]?.includes(
                            item?.condition,
                          )
                            ? [e.target.value, ""]
                            : e.target.value,
                        },
                        index,
                      )
                    }
                  />
                )}

              {selected?.type === "objectId" && item?.ref && (
                <CommonMultiSelectWithPagination
                  searchable={true}
                  value={item?.value?.length ? item?.value : []}
                  queryFn={({ pageParam, search }) => {
                    return getRefList({
                      module: item?.ref,
                      pageParam: pageParam,
                      search: search,
                    });
                  }}
                  querySuffix={item?.ref}
                  onChange={(e) =>
                    handleChange(
                      {
                        field: item?.field,
                        condition: item?.condition,
                        value: e.target.value,
                        type: item?.type,

                        ref: item?.ref,
                      },
                      index,
                    )
                  }
                  borderRadius={"0px 8px 8px 0"}
                  height={"40px"}
                  width="195px"
                />
              )}
            </>
          ) : (
            ""
          )}
        </Box>

        {count !== 1 && (
          <Tooltip title="Remove Criteria">
            <RemoveCircleOutlined
              onClick={() => remove(index)}
              sx={{ color: "error.main", cursor: "pointer" }}
            />
          </Tooltip>
        )}
        {count < 5 && (
          <Tooltip title="Add Criteria">
            <AddCircleRounded
              onClick={AddNew}
              sx={{ color: "success.main", cursor: "pointer" }}
            />
          </Tooltip>
        )}
      </Box>
      {selected?.type === "date" &&
        ["between", "not_between"]?.includes(item?.condition) && (
          <CommonDatePicker
            minDate={
              item?.value?.[0] ? dayjs(item?.value?.[0]).add(1, "day") : ""
            }
            width="205px"
            sx={{
              "& .MuiPickersOutlinedInput-root": {
                height: "40px",
                borderRadius: 2,
                ml: "431.5px",
                bgcolor: theme.palette.background.default,
              },
              "& fieldset": {
                height: "45px",
                padding: 0,
                margin: 0,
              },
              "& .MuiSvgIcon-root": {
                fontSize: "20px",
                mt: "2px",
              },
            }}
            value={
              ["between", "not_between"]?.includes(item?.condition)
                ? item?.value?.[1] || undefined
                : item?.value || undefined
            }
            onChange={(e) =>
              handleChange(
                {
                  field: item?.field,
                  type: item?.type,

                  condition: item?.condition,
                  value: ["between", "not_between"]?.includes(item?.condition)
                    ? [item?.value?.[0], e.target.value]
                    : e.target.value,
                },
                index,
              )
            }
          />
        )}
      {selected?.type === "number" &&
        ["between", "not_between"]?.includes(item?.condition) && (
          <CommonTextField
            value={
              ["between", "not_between"]?.includes(item?.condition)
                ? item?.value?.[1]
                : item?.value
            }
            onChange={(e) =>
              handleChange(
                {
                  field: item?.field,
                  condition: item?.condition,
                  type: item?.type,

                  value: ["between", "not_between"]?.includes(item?.condition)
                    ? [item?.value?.[0], e.target.value]
                    : e.target.value,
                },
                index,
              )
            }
            width="205px"
            type="number"
            mt={2}
            sx={{
              border: "none",
              "& .MuiOutlinedInput-root": {
                height: "40px",
                borderRadius: 2,
                ml: "431.5px",
                bgcolor: theme.palette.background.default,
                boxShadow: "none",

                border: "none",
                "&.Mui-focused": {
                  boxShadow: "none",
                },

                "&:hover": {
                  boxShadow: "none",
                },
              },
            }}
            placeholder={"Enter value (number)"}
            // helperText={"error"}
            // error={true}
            inputProps={{ min: item?.value?.[0] }}
          />
        )}
    </Box>
  );
}
