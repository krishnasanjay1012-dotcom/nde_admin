import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  Paper,
  Box,
  Typography,
  Button,
  Checkbox,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import { toast } from "react-toastify";
import { CommonNumberField } from "../../common/fields";

const api_url1 = "https://api.nowdigitaleasy.com/ndeadmin/v2";

const PERIODS = [
  { key: "oneTimeMonthly", label: "One Time/Monthly" },
  { key: "quarterly", label: "Quarterly" },
  { key: "semiAnnually", label: "Semi-Annually" },
  { key: "annually", label: "Annually" },
  { key: "biennially", label: "Biennially" },
  { key: "triennially", label: "Triennially" },
];

function HostingPayment({ currencies, setCurrencies, recurring, productId, axiosConfig, onClose }) {

  const [loading, setLoading] = useState(false);
  const [initialCurrencies, setInitialCurrencies] = useState([]);
  const inputRefs = useRef([]);
  const lastFocusedIndex = useRef(null);

  useEffect(() => {
    if (currencies.length && initialCurrencies.length === 0) {
      setInitialCurrencies(JSON.parse(JSON.stringify(currencies)));
    }
  }, [currencies, initialCurrencies.length]);

  useEffect(() => {
    if (lastFocusedIndex.current !== null) {
      inputRefs.current[lastFocusedIndex.current]?.focus();
    }
  }, [currencies]);

  const handleCheckboxChange = (currencyId, period) => {
    setCurrencies(
      currencies.map((curr) =>
        curr._id === currencyId
          ? { ...curr, [period]: { ...curr[period], enable: !curr[period].enable } }
          : curr
      )
    );
  };

  const handleInputChange = (index, currencyId, period, field, value) => {
    lastFocusedIndex.current = `${index}-${currencyId}-${period}-${field}`;
    setCurrencies(
      currencies.map((curr) =>
        curr._id === currencyId
          ? {
            ...curr,
            [period]: {
              ...curr[period],
              [field]: /^(\d*\.?\d*)?$/.test(value) ? value : curr[period][field],
            },
          }
          : curr
      )
    );
  };

  const CreateRecurring = async () => {
    const updatedData = currencies.map(({ _id, ...rest }) => ({ id: _id, ...rest }));
    setLoading(true);
    const payload = {
      productId,
      freeStatus: false,
      oneTimeStatus: false,
      recurringStatus: true,
      recurring: {
        ...recurring,
        currency: updatedData,
      },
    };
    try {
      const response = await axios.patch(`${api_url1}/product/updateProduct`, payload, axiosConfig);
      const successMsg = response?.data?.message || "Payment settings updated successfully";
      toast.success(successMsg);
      setInitialCurrencies(JSON.parse(JSON.stringify(currencies)));
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Error updating hosting payment");
    } finally {
      setLoading(false);
    }
  };

  const ResetChanges = () => {
    setCurrencies(JSON.parse(JSON.stringify(initialCurrencies)));
  };

  return (
    <>
      <TableContainer
        sx={{
          width: "100%",
          borderRadius: 1,
          overflowX: "auto",
          maxHeight: "calc(100vh - 170px)",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "background.default" }}>
              <TableCell sx={{ fontWeight: "bold", fontSize: 14 }}>Currency</TableCell>
              {PERIODS.map((period) => (
                <TableCell
                  key={period.key}
                  sx={{ fontWeight: "bold", textAlign: "center", fontSize: 14 }}
                >
                  {period.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {currencies.map((curr, index) => (
              <TableRow
                key={curr._id}
                sx={{
                  "&:hover": { backgroundColor: "#F8FAFC" },
                  transition: "background-color 0.2s ease",
                }}
              >
                {/* Currency Name */}
                <TableCell
                  sx={{
                    fontWeight: 600,
                    borderBottom: "1px solid #F1F5F9",
                    backgroundColor: "background.default",
                  }}
                >
                  <Typography variant="subtitle2">{curr.name}</Typography>
                </TableCell>

                {/* Period Columns */}
                {PERIODS.map((period) => (
                  <TableCell
                    key={period.key}
                    sx={{ textAlign: "center", borderBottom: "1px solid #F1F5F9" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        py: 1,
                      }}
                    >
                      {/* Setup Fee */}
                      <Box
                        sx={{
                          display: curr[period.key].enable ? "flex" : "none",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="caption" sx={{ minWidth: 50 }}>
                          Setup Fee
                        </Typography>
                        <CommonNumberField
                          value={curr[period.key].setUpFee}
                          onChange={(e) =>
                            handleInputChange(index, curr._id, period.key, "setUpFee", e.target.value)
                          }
                          width="70px"
                          inputRef={(el) => inputRefs.current.push(el)}
                          height={38}
                        />
                      </Box>

                      {/* Price */}
                      <Box
                        sx={{
                          display: curr[period.key].enable ? "flex" : "none",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="caption" sx={{ minWidth: 50 }}>
                          Price
                        </Typography>
                        <CommonNumberField
                          value={curr[period.key].price}
                          onChange={(e) =>
                            handleInputChange(index, curr._id, period.key, "price", e.target.value)
                          }
                          width="70px"
                          inputRef={(el) => inputRefs.current.push(el)}
                          height={38}
                        />
                      </Box>

                      {/* Enable Checkbox */}
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <Typography variant="caption" sx={{ minWidth: 50 }}>
                          Enable
                        </Typography>
                        <Checkbox
                          checked={curr[period.key].enable}
                          size="small"
                          onChange={() => handleCheckboxChange(curr._id, period.key)}
                          sx={{ p: 0.5 }}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Buttons */}
      <Box sx={{  display: "flex", justifyContent: "center", gap: 2 , mt:2 }}>
        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={CreateRecurring}
          sx={{ px: 4, py: 1, borderRadius: 1 }}
        >
          Save Changes
        </LoadingButton>
        <Button
          onClick={() => {
            ResetChanges();
            onClose();
          }}
          variant="outlined"
          sx={{
            px: 4,
            py: 1,
            borderRadius: 1,
            borderColor: "#E5E7EB",
            color: "text.primary",
            "&:hover": {
              borderColor: "#D1D5DB",
              backgroundColor: "rgba(0,0,0,0.02)",
            },
          }}
        >
          Cancel
        </Button>
      </Box>
    </>
  );
}

export default HostingPayment;
