import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  Stack,
  Box,
  FormLabel,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import CustomToastContainer from "../../../components/common/NDE-Snackbar";
import { toast } from "react-toastify";
import CommonSearchBar from "../../common/fields/NDE-SearchBar";
import CommonSelect from "../../common/fields/NDE-Select";
import { updateDomainPrice } from "../../../services/domain/domain-service";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} timeout={{ enter: 300, exit: 300 }} />;
});

const DominPricing = ({ open, onClose, selectedDomain, disableAnimation = false, getDomains }) => {
  const [domainPricing, setDomainPricing] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updateForType, setUpdateForType] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {
    if (selectedDomain) {
      setDomainPricing(selectedDomain.pricing || []);
      setProductId(selectedDomain._id);
    }
  }, [selectedDomain]);

  const toggleCheckbox = (yearId, currencyId) => {
    const updated = [...domainPricing];
    const yearIndex = updated.findIndex((y) => y._id === yearId);
    const currencyIndex = updated[yearIndex].currency.findIndex((c) => c._id === currencyId);
    updated[yearIndex].currency[currencyIndex].enable = !updated[yearIndex].currency[currencyIndex].enable;
    setDomainPricing(updated);

    setModifiedData((prev) => {
      const prevCopy = [...prev];
      const yearInModified = prevCopy.find((y) => y._id === yearId);
      if (!yearInModified) {
        prevCopy.push({ _id: yearId, currency: [updated[yearIndex].currency[currencyIndex]] });
      } else {
        const currencyInModified = yearInModified.currency.find((c) => c._id === currencyId);
        if (!currencyInModified) {
          yearInModified.currency.push(updated[yearIndex].currency[currencyIndex]);
        } else {
          currencyInModified.enable = updated[yearIndex].currency[currencyIndex].enable;
        }
      }
      return prevCopy;
    });
  };

  const handleTextChange = (yearId, currencyId, property, event) => {
    const updated = [...domainPricing];
    const yearIndex = updated.findIndex((y) => y._id === yearId);
    const currencyIndex = updated[yearIndex].currency.findIndex((c) => c._id === currencyId);
    const numericValue = event.target.value === "" ? "" : parseFloat(event.target.value);
    updated[yearIndex].currency[currencyIndex][property] = numericValue;
    setDomainPricing(updated);

    setModifiedData((prev) => {
      const prevCopy = [...prev];
      const yearIndexInModified = prevCopy.findIndex((y) => y._id === yearId);
      if (yearIndexInModified === -1) {
        prevCopy.push({ _id: yearId, currency: [updated[yearIndex].currency[currencyIndex]] });
      } else {
        const currencyIndexInModified = prevCopy[yearIndexInModified].currency.findIndex((c) => c._id === currencyId);
        if (currencyIndexInModified === -1) {
          prevCopy[yearIndexInModified].currency.push(updated[yearIndex].currency[currencyIndex]);
        } else {
          prevCopy[yearIndexInModified].currency[currencyIndexInModified][property] = numericValue;
        }
      }
      return prevCopy;
    });
  };

  const updateDomainPricing = async () => {
    setLoading(true);
    try {
      const payload = modifiedData.map((yearItem) => {
        const yearObj = domainPricing.find((y) => y._id === yearItem._id);
        return {
          _id: yearItem._id,
          years: yearObj?.years,
          currency: yearItem.currency,
        };
      });
      await updateDomainPrice({
        updateFor: updateForType,
        data: {
          productId,
          price: payload,
        },
      });
      setModifiedData([]);
      getDomains();
      onClose();
    } catch (error) {
      const msg = error?.response?.data?.message || "Error updating domain pricing";
      toast.error(msg);
    }
    setLoading(false);
  };

  const columns = useMemo(
    () => [
      { header: "Years", accessorKey: "years" },
      { header: "Currency", accessorKey: "currencyName" },
      { header: "Enable", accessorKey: "enable" },
      { header: "Register", accessorKey: "register" },
      { header: "Transfer", accessorKey: "transfer" },
      { header: "Renewal", accessorKey: "renewal" },
      { header: "Redemption Fee", accessorKey: "redemptionPeriodfee" },
    ],
    []
  );

  const rows = useMemo(() => {
    const result = [];
    domainPricing.forEach((year) => {
      if (yearFilter !== "all" && year._id !== yearFilter) return;
      year.currency.forEach((cur) => {
        if (cur.currencyName.toLowerCase().includes(searchTerm.toLowerCase())) {
          result.push({ ...cur, years: year.years, yearId: year._id });
        }
      });
    });
    return result;
  }, [domainPricing, searchTerm, yearFilter]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearchChange = (value) => setSearchTerm(value);

  const yearOptions = useMemo(() => {
    const uniqueYears = domainPricing.map((d) => ({ label: `${d.years} ${d.years === 1 ? "Year" : "Years"}`, value: d._id }));
    return [{ label: "All Years", value: "all" }, ...uniqueYears];
  }, [domainPricing]);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xl"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        PaperProps={{
          sx: {
            borderRadius: 2,
            animation: disableAnimation ? "none" : open ? "bounceIn 0.7s ease-out" : "none",
            "@keyframes bounceIn": {
              "0%": { transform: "translateY(100%)" },
              "60%": { transform: "translateY(-15px)" },
              "80%": { transform: "translateY(10px)" },
              "100%": { transform: "translateY(0)" },
            },
          },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: 1,
            }}
          >
            {/* Left Section */}
            <Box sx={{ flexGrow: 1 }}>
              Domain Pricing for {selectedDomain?.tld} <br />
              <small style={{ fontWeight: 400, color: "#555" }}>
                Check to enable pricing for that currency and term. Set Transfer/Renew pricing to -1 to disable transfers/renewals.
              </small>
            </Box>

            <CommonSelect
              value={updateForType}
              onChange={(e) => setUpdateForType(e.target.value)}
              options={[
                { label: "Individual", value: "individual" },
                { label: "All", value: "all" },
              ]}
              width={120}
              height={40}
              mb={0}
            />

            {/* Years filter */}
            <CommonSelect
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              options={yearOptions}
              width={140}
              height={40}
              mb={0}
            />

            {/* Search bar */}
            <CommonSearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              onClear={() => handleSearchChange("")}
              placeholder="Search Currency"
              sx={{ width: 160 }}
              mb={0}
              height={40}
            />

            {/* Close Icon */}
            <IconButton onClick={onClose} color="error">
              <CloseIcon sx={{ color: "error.main" }} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <TableContainer
            sx={{ maxHeight: 400, borderRadius: 1, border: "1px solid #F3F4F6" }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow sx={{ height: 50 }}>
                  {table.getHeaderGroups()[0].headers.map((header) => (
                    <TableCell
                      key={header.id}
                      align="center"
                      sx={{
                        fontWeight: 600,
                        py: 0.5,
                        px: 1,
                        fontSize: { xs: "12px", sm: "14px" },
                        color: "text.primary",
                        whiteSpace: "nowrap",
                        backgroundColor: "blue.100",
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {domainPricing
                  .filter(
                    (year) =>
                      (yearFilter === "all" || year._id === yearFilter) &&
                      year.currency.some((cur) =>
                        cur.currencyName.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                  )
                  .map((year) => (
                    <React.Fragment key={year._id}>
                      <TableRow sx={{ backgroundColor: "blue.100", height: 40 }}>
                        <TableCell
                          colSpan={8}
                          sx={{ fontWeight: 600, textAlign: "left", pl: 2 }}
                        >
                          {year.years} {year.years === 1 ? "Year" : "Years"}
                        </TableCell>
                      </TableRow>

                      {year.currency
                        .filter((cur) =>
                          cur.currencyName.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((cur) => (
                          <TableRow
                            key={cur._id}
                            sx={{ height: 36, "&:hover": { backgroundColor: "blue.default" } }}
                          >
                            <TableCell></TableCell>
                            <TableCell align="center">{cur.currencyName}</TableCell>
                            <TableCell align="center">
                              <Checkbox
                                checked={cur.enable}
                                onChange={() => toggleCheckbox(year._id, cur._id)}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                size="small"
                                type="number"
                                value={cur.register}
                                onChange={(e) =>
                                  handleTextChange(year._id, cur._id, "register", e)
                                }
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                size="small"
                                type="number"
                                value={cur.transfer}
                                onChange={(e) =>
                                  handleTextChange(year._id, cur._id, "transfer", e)
                                }
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                size="small"
                                type="number"
                                value={cur.renewal}
                                onChange={(e) =>
                                  handleTextChange(year._id, cur._id, "renewal", e)
                                }
                              />
                            </TableCell>
                            <TableCell align="center">
                              <TextField
                                size="small"
                                type="number"
                                value={cur.redemptionPeriodfee}
                                onChange={(e) =>
                                  handleTextChange(
                                    year._id,
                                    cur._id,
                                    "redemptionPeriodfee",
                                    e
                                  )
                                }
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack mt={2}>
            <FormLabel>Description</FormLabel>
            <TextField
              multiline
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": { border: "1px solid #D1D1D1" },
                  height: 50,
                },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={updateDomainPricing}
            variant="contained"
            color="primary"
            disabled={loading || modifiedData.length === 0}
          >
            {loading ? "Saving..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DominPricing;
