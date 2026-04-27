import { Typography } from "@mui/material";

const MandatoryFormLabel = ({ label, mandatory }) => {
    return (
        <Typography sx={{ marginBottom: '10px', textTransform: 'capitalize', fontWeight: 400 }}>
            {label}<span style={{ color: 'red' }}>{mandatory && '*'}</span>
        </Typography>
    );
};

export default MandatoryFormLabel;
