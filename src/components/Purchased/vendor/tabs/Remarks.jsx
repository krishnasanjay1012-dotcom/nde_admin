import { Box } from "@mui/material";
import { Controller } from "react-hook-form";
import { CommonDescriptionField } from "../../../common/fields";

const Remarks = ({ control }) => {
    return (
        <Box
            sx={{
                flex: 1,
                minWidth: { md: "180px", sm: "100px" },
            }}
        >
            <Controller
                name="planName"
                control={control}
                render={({ field: controllerField }) => (
                    <CommonDescriptionField
                        {...controllerField}
                        label="Remarks (For Internal Use)"
                        width="100%"
                    />
                )}
            />
        </Box>
    )
}

export default Remarks;