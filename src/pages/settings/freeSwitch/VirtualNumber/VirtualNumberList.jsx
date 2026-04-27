import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  useTheme,
} from "@mui/material";
import ReusableTable from "../../../../components/common/Table/ReusableTable";
import CommonButton from "../../../../components/common/NDE-Button";
import AddIcon from "@mui/icons-material/Add";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { useWorkspaceUsers } from "./hooks/useWorkspaceUsers";
import CommonSelect from "../../../../components/common/fields/NDE-Select";

const ALL_WORKSPACES = "all";

const DEMO_DATA = [
  {
    id: "1",
    name: "Maha-14812",
    number: "—",
    location: "Portugal",
    status: "In Progress",
    users: 5,
    workspaceId: "ws_1",
    workspace: "Alpha Corp",
  },
  {
    id: "2",
    name: "Rishi-41772",
    number: "—",
    location: "Brazil",
    status: "In Progress",
    users: 3,
    workspaceId: "ws_2",
    workspace: "Beta Solutions",
  },
];

export default function VirtualNumberList() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [selectedWorkspace, setSelectedWorkspace] = useState(ALL_WORKSPACES);

  const { workspaces } = useWorkspaceUsers(null);

  const filteredData = useMemo(
    () =>
      selectedWorkspace === ALL_WORKSPACES
        ? DEMO_DATA
        : DEMO_DATA.filter((r) => r.workspaceId === selectedWorkspace),
    [selectedWorkspace],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "number",
        header: "Number",
      },
      {
        accessorKey: "location",
        header: "Location",
      },
      {
        accessorKey: "workspace",
        header: "Workspace",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "users",
        header: "Users",
        cell: ({ row }) => (
          <span
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                `/settings/freeSwitch/virtual-number/${row.original.id}/general`,
              );
            }}
            style={{
              cursor: "pointer",
            }}
          >
            {row.original.users}
          </span>
        ),
      },
    ],
    [navigate],
  );

  return (
    <Box>
      {/* virtuals toolbar */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          p: theme.spacing(1),
          gap: theme.spacing(2),
        }}
      >
        {/* filter options*/}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(2),
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h4" gutterBottom noWrap sx={{ mb: 0 }}>
            Virtual Numbers
          </Typography>

          <FormControl size="small" sx={{ minWidth: theme.spacing(22) }}>
            <Select
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
              displayEmpty
            >
              <MenuItem value={ALL_WORKSPACES}>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  All Workspaces
                </Typography>
              </MenuItem>
              {workspaces.map((ws) => (
                <MenuItem key={ws.id} value={ws.id}>
                  <Typography variant="body1">{ws.name}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* actions */}
        <Box
          sx={{ display: "flex", gap: theme.spacing(1.5), flexWrap: "wrap" }}
        >
          <CommonButton
            label="Bulk Assign"
            variant="outlined"
            startIcon={<PeopleAltOutlinedIcon sx={{ color: "primary.main" }} />}
            sx={{
              color: "primary.main",
              borderColor: "primary.border",
              bgcolor: "primary.extraLight",
              "&:hover": { bgcolor: "background.hover" },
            }}
            onClick={() =>
              navigate(
                `/settings/freeSwitch/virtual-number/${filteredData[0]?.id || "1"}/bulk-assign`,
              )
            }
          />
          <CommonButton
            label="Add Virtual Number"
            startIcon={<AddIcon sx={{ color: "icon.light" }} />}
            onClick={() => {}}
          />
        </Box>
      </Box>

      {/* table */}
      <ReusableTable
        columns={columns}
        data={filteredData}
        isLoading={false}
        maxHeight="calc(100vh - 180px)"
        onRowClick={(row) =>
          navigate(`/settings/freeSwitch/virtual-number/${row.id}`)
        }
      />
    </Box>
  );
}
