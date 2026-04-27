import { useMemo, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CommonTabs from "../../../../../components/common/NDE-Tabs";

import { DEMO_DATA } from "./constants";
import GeneralTab from "./tabs/GeneralTab";
import IncomingCallsTab from "./tabs/IncomingCallsTab";
import OutgoingCallsTab from "./tabs/OutgoingCallsTab";

export default function VirtualNumberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const record = DEMO_DATA[id] || { name: `Number ${id}`, number: "—" };
  const basePath = `/settings/freeSwitch/virtual-number/${id}`;

  const tabs = useMemo(
    () => [
      {
        route: `${basePath}/general`,
        label: "General",
        component: <GeneralTab record={record} />,
      },
      {
        route: `${basePath}/incoming-calls`,
        label: "Incoming calls",
        component: (
          <IncomingCallsTab
            numberId={id}
            navigate={navigate}
            phoneNumber={record.number}
          />
        ),
      },
      {
        route: `${basePath}/outgoing-calls`,
        label: "Outgoing calls",
        component: <OutgoingCallsTab />,
      },
    ],
    [basePath, id, record, navigate],
  );

  const currentTab = Math.max(
    0,
    tabs.findIndex((t) => location.pathname.startsWith(t.route)),
  );

  useEffect(() => {
    if (
      location.pathname === basePath ||
      location.pathname === `${basePath}/`
    ) {
      navigate(`${basePath}/general`, { replace: true });
    }
  }, [location.pathname, basePath, navigate]);

  return (
    <Box sx={{ p: 1 }}>
      {/* Back link */}
      <Box
        onClick={() => navigate("/settings/freeSwitch/virtual-number")}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          cursor: "pointer",
          color: "primary.main",
          mb: 1.5,
          "&:hover": { textDecoration: "underline" },
        }}
      >
        <ChevronLeftIcon sx={{ fontSize: "1rem" }} />
        <Typography
          variant="body1"
          sx={{ fontWeight: 500, color: "primary.main" }}
        >
          Back to virtual numbers
        </Typography>
      </Box>

      {/* Title */}
      <Typography variant="h4" sx={{ mb: 2 }}>
        {record.name}
      </Typography>

      <CommonTabs tabs={tabs} currentTab={currentTab} mt={2} />
    </Box>
  );
}
