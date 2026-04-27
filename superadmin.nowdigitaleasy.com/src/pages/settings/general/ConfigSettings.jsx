import { Box, Typography } from "@mui/material";
import CompanyDetails from "./CompanyDetails";


const ConfigSettings = () => {

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between",mt:1}}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* <CommonBackButton to="/settings" /> */}
        <Typography variant="h4" gutterBottom ml={2}>
         Config Settings
        </Typography>
        </Box>
        </Box>
      {/* <ReusableTable columns={columns} data={tableData} /> */}
      <CompanyDetails/>
    </Box>
  )
}

export default ConfigSettings