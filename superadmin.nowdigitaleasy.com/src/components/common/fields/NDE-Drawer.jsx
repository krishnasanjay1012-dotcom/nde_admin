import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Divider,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CommonDrawer = ({
    open,
    onClose,
    anchor = "right",
    title,
    children,
    onSubmit,
    submitLabel = "Save",
    issubmitlabel = false,
    cancelLabel = 'Cancel',
    sx = {},

    width = 350,
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
                {title && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #D1D1DB",

                            ...sx,
                        }}
                    >
                        <Typography variant="h6">{title}</Typography>
                        <IconButton onClick={onClose} color="error">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                )}

                <Divider />

                {/* Content */}
                <Box sx={{ mt: 2, flex: 1, overflowY: "auto" }}>{children}</Box>

                {!issubmitlabel &&
                    <Box sx={{ mt: 2, gap: '10px', display: 'flex', alignItems: 'flex-start' }}>

                        <Button
                            onClick={onSubmit}
                            variant="contained"
                            color="primary"
                            sx={{ height: 40, width: 90, borderRadius: 2 }}
                        >
                            {submitLabel}
                        </Button>

                        <Button
                            onClick={onClose}
                            variant="outlined"
                            color="primary.extraLight"
                            sx={{ height: 40, width: 90, borderRadius: 2 }}
                        >
                            {cancelLabel}
                        </Button>

                    </Box>
                }

            </Box>
        </Drawer>
    );
};

export default CommonDrawer;