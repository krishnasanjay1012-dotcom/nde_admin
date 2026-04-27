import React, { useRef } from "react";
import { Box } from "@mui/material";

const CommonFileBoxUpload = ({
    width = "100%",
    height = "100px",
    border = "1px dashed #ccc",
    borderRadius = "8px",
    multiple = false,
    accept = "*",
    onChange,
    children,
    sx = {},
}) => {
    const inputRef = useRef(null);

    const handleClick = () => {
        inputRef.current.click();
    };

    const handleFileChange = (event) => {
        if (onChange) {
            onChange(multiple ? event.target.files : event.target.files[0]);
        }
    };

    return (
        <>
            <Box
                onClick={handleClick}
                sx={{
                    width,
                    height,
                    border,
                    borderRadius,
                    bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                            ? "background.muted"
                            : "#f9f9fb"
                    , display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": {
                        bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                                ? "background.muted"
                                : "#f9f9fb"
                        ,
                    },
                    ...sx,
                }}
            >
                {children}
            </Box>

            {/* Hidden input */}
            <input
                type="file"
                ref={inputRef}
                style={{ display: "none" }}
                multiple={multiple}
                accept={accept}
                onChange={handleFileChange}
            />
        </>
    );
};

export default CommonFileBoxUpload;
