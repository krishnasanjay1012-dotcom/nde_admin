import { Box, Card, Typography, Grid } from "@mui/material";
import CommonButton from "../../common/NDE-Button";
import { useSubscriptionsByUser } from "../../../hooks/Customer/Customer-hooks";

const Subscription = ({ selectedWorkspaceId }) => {
  const workspace = selectedWorkspaceId;

  const { data } = useSubscriptionsByUser({
    workspaceId: workspace,
  });

  const tableData = data?.data?.docs || [];

  return (
    <Box>
      {tableData.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No subscription available
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {tableData.map((service, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={2.4}>
              <Card
                sx={{
                  minHeight: 150,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  p: 2,
                  border: "1px solid #E0E0E0",
                }}
              >
                {service.type === "new" ? (
                  <CommonButton label="New Services" />
                ) : (
                  <>
                    {service.productLogo && (
                      <Box sx={{ mb: 1 }}>
                        <img
                          src={service.productLogo}
                          alt={service.productName}
                          style={{ width: 30, height: 30 }}
                        />
                      </Box>
                    )}

                    <Typography variant="h6" mb={0.5}>{service.productName}</Typography>

                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      {service.planName}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      Renewal{" "}
                      {new Date(service.nextBillingDate).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </Typography>

                    <Box sx={{ mt: 1 }}>{service.status}</Box>
                  </>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Subscription;
