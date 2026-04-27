import React, { useState } from "react";
import {
    Box,
    Card,
    Typography,
    Stack,
    RadioGroup,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CommonButton from "../common/NDE-Button";
import CommonRadioButton from "../common/fields/NDE-Radio";
import CommonSearchBar from "../common/fields/NDE-SearchBar";
import CommonDrawer from "../common/NDE-Drawer";
import DomainSearch from "../common/fields/NDE-DomainSearch";

const initialDomains = [
    { name: "iaaxin.in", status: "available", selected: true },
    { name: "example.com", status: "available", selected: false },
    { name: "demo.net", status: "unavailable", selected: false },
    { name: "mydomain.org", status: "added", selected: true },
    { name: "testsite.io", status: "available", selected: false },
];

const Status = ({ type }) => {
    if (type === "available") {
        return (
            <Stack direction="row" spacing={0.5} alignItems="center" mt={0.5}>
                <CheckCircleIcon fontSize="small" sx={{ color: "#2ECC71" }} />
                <Typography fontSize={12} color="#2ECC71">
                    Available
                </Typography>
            </Stack>
        );
    }

    if (type === "unavailable") {
        return (
            <Stack direction="row" spacing={0.5} alignItems="center" mt={0.5}>
                <CancelIcon fontSize="small" sx={{ color: "#E74C3C" }} />
                <Typography fontSize={12} color="#E74C3C">
                    Unavailable
                </Typography>
            </Stack>
        );
    }

    return (
        <Typography fontSize={12} color="#F39C12" mt={0.5}>
            Added
        </Typography>
    );
};

const DomainList = () => {
    const [domains, setDomains] = useState(initialDomains);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [value, setValue] = useState("yes");

    const toggleSelect = (index) => {
        setDomains((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, selected: !item.selected } : item
            )
        );
    };

    return (
        <Box>
            <Box maxWidth={720} mx="auto" mt={1}>
                <Box>
                    {/* Title */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6">
                            Connect your Domain Name
                        </Typography>
                    </Box>

                    {/* Radio buttons - centered */}
                    <RadioGroup
                        row
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        sx={{
                            justifyContent: "center",
                            mb: 2,
                            gap: 6
                        }}
                    >
                        <CommonRadioButton
                            label="Register a Domain"
                            value="yes"
                            checked={value === "yes"}
                            name="confirmation"
                        />

                        <CommonRadioButton
                            label="Transfer a Domain"
                            value="no"
                            checked={value === "no"}
                            name="confirmation"
                        />
                    </RadioGroup>

                    {/* Search bar - full width & centered */}
                    <Box sx={{ maxWidth: 420, mx: "auto", mb: 2 }}>
                        <DomainSearch />
                    </Box>
                </Box>

                {domains.map((domain, index) => {
                    const isSelected = domain.selected;
                    const isHover = hoverIndex === index;

                    return (
                        <Card
                            key={index}
                            sx={{
                                p: 2,
                                mb: 1.5,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                            }}
                        >
                            {/* LEFT */}
                            <Box>
                                <Typography fontWeight={600} fontSize={14}>
                                    {domain.name}
                                </Typography>
                                <Status type={domain.status} />
                            </Box>

                            {/* CENTER */}
                            <Box textAlign="right">
                                <Typography fontWeight={700} fontSize={14}>
                                    ₹ 1,040.00
                                </Typography>
                                <Typography fontSize={12} color="text.secondary">
                                    then ₹ 1,210.00/year
                                </Typography>
                            </Box>

                            {/* RIGHT BUTTON */}
                            <CommonButton
                                onMouseEnter={() => setHoverIndex(index)}
                                onMouseLeave={() => setHoverIndex(null)}
                                onClick={() => toggleSelect(index)}
                                startIcon={
                                    isSelected ? (
                                        isHover ? (
                                            <CloseIcon sx={{ color: "#fff" }} />
                                        ) : (
                                            <CheckIcon sx={{ color: "#fff" }} />
                                        )
                                    ) : null
                                }
                                label={
                                    isSelected
                                        ? isHover
                                            ? "Remove"
                                            : "Selected"
                                        : "Select"
                                }
                                sx={{
                                    minWidth: 120,
                                    height: 34,
                                    bgcolor: isSelected ? "success.main" : "primary.main",
                                    "&:hover": {
                                        bgcolor: isSelected ? "error.main" : "primary.main",
                                    },
                                }}
                            />
                        </Card>
                    );
                })}
            </Box>
        </Box>
    );
};

export default DomainList;
