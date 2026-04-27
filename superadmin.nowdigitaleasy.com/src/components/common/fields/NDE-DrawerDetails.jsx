import { Drawer, Box, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CommonDrawerDetails = ({
    open,
    onClose,
    anchor = "right",
    header,
    children,
    footer,
    width = 350,
    sx = {},
}) => {
    return (
        <Drawer anchor={anchor} open={open} onClose={onClose}>
            <Box
                sx={{
                    width: anchor === "left" || anchor === "right" ? width : "auto",
                    p: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header */}
                {header && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #D1D1DB",
                            paddingBottom: '10px',
                            ...sx,
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {header}
                        </Box>
                        <IconButton onClick={onClose} color="error">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                )}

                <Divider />

                {/* Content */}
                <Box sx={{ mt: 2, flex: 1, overflowY: "auto" }}>{children}</Box>

                {/* Footer */}
                {footer && <Box sx={{ mt: 2 }}>{footer}</Box>}
            </Box>
        </Drawer>
    );
};

export default CommonDrawerDetails;
