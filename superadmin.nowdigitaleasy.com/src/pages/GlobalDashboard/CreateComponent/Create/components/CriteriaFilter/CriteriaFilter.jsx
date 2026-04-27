import { Add, Delete } from "@mui/icons-material";
import { Box, Button, Typography, useTheme } from "@mui/material";
import React from "react";
import CriteriaInput from "./CriteriaInput";

export default function CriteriaFilter({
  criteriaFiltersFields,
  data,
  setData,
}) {
  const theme = useTheme();

  return (
    <>
      {!data?.length && (
        <Button
          onClick={() =>
            setData([
              {
                field: "",
                condition: "",
                value: "",
              },
            ])
          }
          sx={{
            marginLeft: "190px",
            width: "130px",
            mt: -2,
            borderRadius: "30px",
            bgcolor: "transparent",
            ":hover": {
              borderRadius: "30px",
              bgcolor: "transparent",
              textDecoration: "underline",
            },
          }}
          variant="text"
          startIcon={<Add />}
        >
          Criteria filter
        </Button>
      )}

      {data?.length ? (
        <Box
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            p: 2,
            borderRadius: theme.shape.borderRadius,
            display: "flex",
            gap: 2,
            mt: -1,
            mb: 1,
            // height: "100%",
            transition: "all 0.3s",
            flexDirection: "column",
            boxShadow: 0.5,
          }}
        >
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            <Typography variant="h6">Criteria</Typography>
            <Typography
              variant="h6"
              sx={{ fontSize: "0.6rem", color: theme.palette.primary.main }}
            >
              ●
            </Typography>
            <Button
              onClick={() => {
                setData([]);
              }}
              sx={{
                width: "fit-content",
                borderRadius: "30px",
                height: "15px",
                p: 0,
                m: 0,
                color: "error.main",
                minWidth: "30px",
                bgcolor: "transparent",
                ":hover": {
                  color: "error.main",
                  borderRadius: "30px",
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
              }}
              variant="text"
            >
              Remove
            </Button>
          </Box>
          {data?.map((i, idx) => (
            <CriteriaInput
              criteriaFiltersFields={criteriaFiltersFields}
              count={data?.length}
              item={i}
              key={idx}
              handleChange={(item, index) => {
                let listOfData = data ?? [];
                listOfData[index] = item;
                setData(listOfData);
              }}
              remove={(remove_idx) => {
                setData(data?.filter((_, index) => index !== remove_idx));
              }}
              AddNew={() =>
                setData([
                  ...data,
                  {
                    field: "",
                    condition: "",
                    value: "",
                    ref: "",
                    type: "",
                  },
                ])
              }
              index={idx}
            />
          ))}
        </Box>
      ) : (
        ""
      )}
    </>
  );
}
