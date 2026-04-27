import React, { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Box,
  Button,
  Skeleton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  useGSuiteById,
  useUpdateGSuitePrice,
} from "../../../hooks/GSuitePrice/GSuitePrice-hooks";
import CommonNumberField from "../../common/fields/NDE-NumberField";
import CommonBackButton from "../../common/NDE-BackButton";
import CommonButton from "../../common/NDE-Button";
import GSuitePriceDetailsDialog from "./G-Suite-Update";
import WaveLoader from "../../common/NDE-WaveLoader";

export default function GsuitePriceDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGSuiteById(id);
  const mutation = useUpdateGSuitePrice();

  const [tableData, setTableData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);


  useEffect(() => {
    if (!isLoading && data) {
      setInitialLoading(false);
    }
  }, [isLoading, data]);

  const columns = [
    "Annual-Monthly",
    "Flexible-Quaterly",
    "Flexible-Monthly",
    "Flexible-HalfYearly",
    "Annually",
    "Biannually",
    "Triannually",
  ];

  const extraFields = ["type", "maxUsers", "offerForUsers", "noOfYears"];

  useEffect(() => {
    if (data) {
      const transformed = [];
      data.pricing.forEach((priceType) => {
        priceType.currency.forEach((curr) => {
          let existingRow = transformed.find(
            (row) => row.currency === curr.name
          );
          if (!existingRow) {
            existingRow = { currency: curr.name, prices: {} };
            transformed.push(existingRow);
          }
          existingRow.prices[priceType.type] = {
            defaultPrice: curr.defaultPrice ?? 0,
            offerPrice: curr.offerPrice ?? 0,
            type: curr.type ?? 0,
            maxUsers: curr.maxUsers ?? 0,
            offerForUsers: curr.offerForUsers ?? 0,
            noOfYears: curr.noOfYears ?? 0,
          };
        });
      });
      setTableData(transformed);
      setInitialData(JSON.parse(JSON.stringify(transformed)));
    }
  }, [data]);

  const handleChange = (currency, type, field, value) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.currency === currency
          ? {
            ...row,
            prices: {
              ...row.prices,
              [type]: {
                ...row.prices[type],
                [field]: value === "" ? 0 : value,
              },
            },
          }
          : row
      )
    );
  };

  const handleCancel = () => {
    setTableData(initialData);
  };

  const handleUpdate = () => {
    if (!id) return;

    const payload = {
      productId: id,
      detailsStatus: false,
      pricingStatus: true,
    };

    columns.forEach((col) => {
      payload[col] = tableData.map((row) => ({
        currency: row.currency,
        defaultPrice: Number(row.prices[col]?.defaultPrice || 0),
        offerPrice: Number(row.prices[col]?.offerPrice || 0),
        type: Number(row.prices[col]?.type || 0),
        maxUsers: Number(row.prices[col]?.maxUsers || 0),
        offerForUsers: Number(row.prices[col]?.offerForUsers || 0),
        noOfYears: Number(row.prices[col]?.noOfYears || 0),
      }));
    });

    mutation.mutate({ id, data: payload });
  };

  if (initialLoading) {
    return (
      <Box
        sx={{
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <WaveLoader size={60} barCount={6} />
        <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
          Loading G-Suite Plan...
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <CommonBackButton to="/pricing/g-suite" />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            G-Suite Plan
          </Typography>
        </Box>

        <CommonButton label="Update Plan" onClick={() => setOpenDialog(true)} />
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          border: "1px solid #F3F4F6",
          maxHeight: "calc(100vh - 220px)", 
          overflowY: "auto",
        }}
      >
        <Table
          stickyHeader
          sx={{
            minWidth: 650,
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "background.default" }}>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "10px", sm: "14px" },
                  color: "text.primary",
                }}
              >
                Plan Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "10px", sm: "13px" },
                  color: "text.primary",
                }}
              >
                Currency
              </TableCell>
              {columns.map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "10px", sm: "13px" },
                    color: "text.primary",
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {(isLoading ? Array.from({ length: 4 }) : tableData).map((row, idx) => (
              <React.Fragment key={idx}>
                {/* Default Price Row */}
                <TableRow>
                  <TableCell rowSpan={3} sx={{ fontWeight: 600 }}>
                    {isLoading ? <Skeleton width={100} height={40} /> : data.productName}
                  </TableCell>
                  <TableCell rowSpan={3} sx={{ fontWeight: 600 }}>
                    {isLoading ? <Skeleton width={80} height={40} /> : row.currency}
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={col}>
                      {isLoading ? (
                        <Skeleton width="100%" height={40} />
                      ) : (
                        <CommonNumberField
                          value={row.prices[col]?.defaultPrice || 0}
                          onChange={(e) =>
                            handleChange(row.currency, col, "defaultPrice", e.target.value)
                          }
                          label="Default"
                          name={`${col}_default`}
                          fullWidth
                          height={40}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Offer Price Row */}
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col}>
                      {isLoading ? (
                        <Skeleton width="100%" height={40} />
                      ) : (
                        <CommonNumberField
                          value={row.prices[col]?.offerPrice || 0}
                          onChange={(e) =>
                            handleChange(row.currency, col, "offerPrice", e.target.value)
                          }
                          label="Offer"
                          name={`${col}_offer`}
                          fullWidth
                          height={40}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Extra Fields Row */}
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col}>
                      {isLoading ? (
                        <Skeleton width="100%" height={80} />
                      ) : (
                        <Box display="flex" flexDirection="column" gap={1}>
                          {extraFields.map((field) => (
                            <CommonNumberField
                              key={field}
                              value={row.prices[col]?.[field] || 0}
                              onChange={(e) =>
                                handleChange(row.currency, col, field, e.target.value)
                              }
                              label={field}
                              name={`${col}_${field}`}
                              fullWidth
                              height={40}
                            />
                          ))}
                        </Box>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Buttons */}
      <Box
        mt={2}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="center"
        gap={2}
        flexWrap="wrap"
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={mutation.isLoading || isLoading}
        >
          {mutation.isLoading ? "Updating..." : "Update"}
        </Button>
      </Box>

      <GSuitePriceDetailsDialog
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={data}
      />
    </Box>
  );
}
