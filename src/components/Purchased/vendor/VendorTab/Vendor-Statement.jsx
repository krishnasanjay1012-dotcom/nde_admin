import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import CommonFilter from "../../../common/NDE-CommonFilter";
import { CommonSelect } from "../../../common/fields";
import CommonDateRange from "../../../common/NDE-DateRange";
import { IconButton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import GridOnIcon from "@mui/icons-material/GridOn";
import EmailIcon from "@mui/icons-material/Email";
import CommonButton from "../../../common/NDE-Button";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { useStatementDetails } from "../../../../hooks/Customer/Customer-hooks";
import StatementOfAccounts from "./VendorStateTemplate";

const VendorStatement = ({ selectedVendor }) => {
    const userId = selectedVendor?._id;

    const statusOptions = [
        { label: "All", value: "all" },
        { label: "Outstanding", value: "outstanding" },
    ];

    const dateFilterOptions = [
        { label: "Today", value: "today" },
        { label: "Yesterday", value: "yesterday" },
        { label: "This Week", value: "this_week" },
        { label: "Previous Week", value: "previous_week" },
        { label: "This Month", value: "this_month" },
        { label: "Previous Month", value: "previous_month" },
        { label: "This Quarter", value: "this_quarter" },
        { label: "Previous Quarter", value: "previous_quarter" },
        { label: "This Year", value: "this_year" },
        { label: "Previous Year", value: "previous_year" },
        { label: "Custom", value: "custom" }
    ];


    const [status, setStatus] = useState("all");
    const [selectedDateFilter, setSelectedDateFilter] = useState("this_month");
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

    const [tempRange, setTempRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });

    const { data, isLoading } = useStatementDetails({
        userId: userId,
        filter: selectedDateFilter,
    });

    const statementData = data?.data;

    console.log(statementData, "data");

    const [selectedRange, setSelectedRange] = useState({
        startDate: null,
        endDate: null,
    });

    const handleStatusChange = (value) => {
        setStatus(value);
    };

    const handleDateFilterChange = (value) => {
        setSelectedDateFilter(value);

        if (value === "custom") {
            setOpenModal(true);
        } else {
            setSelectedRange({ startDate: null, endDate: null });
        }
    };

    const handleApplyCustomRange = () => {
        setSelectedRange({
            startDate: tempRange.startDate,
            endDate: tempRange.endDate,
        });
        setOpenModal(false);
    };

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };
    const handleSendMail = () => {
        navigate(`/purchased/vendors/${userId}/statements/email`)
    }

    return (
        <Box
            sx={{
                p: 1,
                overflow: "auto",
                maxHeight: "calc(100vh - 180px)",
            }}
        >
            {/* Filters Row */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <CommonSelect
                    options={dateFilterOptions}
                    value={selectedDateFilter}
                    onChange={(e) => handleDateFilterChange(e.target.value)}
                    width="150px"
                    mt={0}
                    mb={0}
                />

                <CommonFilter
                    menuOptions={statusOptions}
                    value={status}
                    onChange={handleStatusChange}
                />

                {/* Top Action Bar */}
                <Box
                    sx={{
                        gap: 2,
                        display: "flex",
                        ml: "auto",
                    }}
                >
                    {/* Print */}
                    <Tooltip title="Print" arrow>
                        <IconButton
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                backgroundColor: "#f5f5f5",
                                "&:hover": { backgroundColor: "#eaeaea" },
                            }}
                        >
                            <PrintIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* Download PDF */}
                    <Tooltip title="Download PDF" arrow>
                        <IconButton
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                backgroundColor: "#f5f5f5",
                                "&:hover": { backgroundColor: "#eaeaea" },
                            }}
                        >
                            <PictureAsPdfIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* Download Excel */}
                    <Tooltip title="Download Excel" arrow>
                        <IconButton
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                backgroundColor: "#f5f5f5",
                                "&:hover": { backgroundColor: "#eaeaea" },
                            }}
                        >
                            <GridOnIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <CommonButton
                        variant="contained"
                        onClick={handleSendMail}
                        startIcon={<EmailIcon sx={{ color: "icon.light" }} />}
                        label="Send Email"
                    />
                </Box>
            </Box>

            <Typography
                variant="h5"
                fontWeight={400}
                sx={{ mt: 1, textAlign: "center" }}
            >
                Vendor Statement for {`${selectedVendor?.first_name || ''} ${selectedVendor?.last_name || ''}`.trim()}
            </Typography>
            <Typography
                variant="h6"
                fontWeight={400}
                sx={{ mt: 1, textAlign: "center", fontSize: 12 }}
            >
                From {formatDate(statementData?.startDate)} To{" "}
                {formatDate(statementData?.endDate)}
            </Typography>

            <StatementOfAccounts statementData={statementData} />

            <CommonDateRange
                open={openModal}
                onClose={() => setOpenModal(false)}
                tempRange={tempRange}
                onChange={(ranges) => setTempRange(ranges.selection)}
                onApply={handleApplyCustomRange}
                title="Select Date Range"
            />
        </Box>
    );
};

export default VendorStatement;
