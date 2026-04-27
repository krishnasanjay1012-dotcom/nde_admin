import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";
import EngineeringIcon from "@mui/icons-material/Engineering";
import MaintenanceImage from "../assets/image/403-Forbidden.svg";

export default function MaintenancePage() {
  return (
    <Box>
      <Box
        sx={{
          padding: { xs: 3, sm: 5 },
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Left Side: Avatar + Text + Progress */}
          <Grid item xs={12} md={6} textAlign="center">
            <Avatar
              sx={{
                margin: "auto",
                width: 110,
                height: 110,
                background: "linear-gradient(135deg, #2330E7, #4752EB)",
                mb: 3,
              }}
            >
              <EngineeringIcon sx={{ fontSize: 90, color: "#fff" }} />
            </Avatar>

            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              color="primary"
              fontWeight={700}
            >
              Under Maintenance 🛠️
            </Typography>

            <Typography variant="body1" color="textSecondary" paragraph>
              We're currently performing scheduled maintenance to improve your
              experience. We'll be back online shortly.
            </Typography>

            <Box sx={{ width: "80%", margin: "20px auto" }}>
              <LinearProgress
                variant="indeterminate"
                sx={{
                  height: 10,
                  borderRadius: 5,
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(90deg, #2330E7, #4752EB)",
                  },
                }}
              />
            </Box>

            <Typography variant="caption" color="textSecondary" display="block" mb={2}>
              Thank you for your patience!
            </Typography>

            {/* Extra Content */}
            <Typography variant="body2" color="textSecondary" mb={1}>
              Estimated downtime: <strong>2–3 hours</strong>
            </Typography>
          </Grid>

          {/* Right Side: Image */}
          <Grid item xs={12} md={6} textAlign="center">
            <img
              src={MaintenanceImage}
              alt="Maintenance Illustration"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
