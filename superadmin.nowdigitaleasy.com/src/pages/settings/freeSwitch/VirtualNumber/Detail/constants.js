export const DEMO_DATA = {
  1: {
    name: "Maha-14812",
    number: "+351 21 123 4567",
    location: "Portugal",
    workspaceId: "ws_1",
  },
  2: {
    name: "Rishi-41772",
    number: "+55 11 2345 6789",
    location: "Brazil",
    workspaceId: "ws_2",
  },
};

export const IVR_FLOWS = [
  { id: "flow_1", name: "IVR Flow - 1" },
  { id: "flow_2", name: "IVR Flow - 2" },
  { id: "flow_maha", name: "maha" },
];

export const CONNECT_TO_OPTIONS = ["User", "Team", "IVR Flow", "No One"];

// ─── Mock Workspaces ────────────────────────────────────────────────────────
export const MOCK_WORKSPACES = [
  { id: "ws_1", name: "Alpha Corp" },
  { id: "ws_2", name: "Beta Solutions" },
  { id: "ws_3", name: "Gamma Enterprises" },
];

// ─── Mock Users by Workspace ────────────────────────────────────────────────
export const MOCK_USERS_BY_WORKSPACE = {
  ws_1: [
    { id: "u1", name: "Aarav Shah", email: "aarav@alpha.com", role: "Agent" },
    { id: "u2", name: "Priya Nair", email: "priya@alpha.com", role: "Supervisor" },
    { id: "u3", name: "Rohan Mehta", email: "rohan@alpha.com", role: "Agent" },
    { id: "u4", name: "Sneha Joshi", email: "sneha@alpha.com", role: "Agent" },
    { id: "u5", name: "Vikram Rao", email: "vikram@alpha.com", role: "Manager" },
  ],
  ws_2: [
    { id: "u6", name: "Carlos Mendes", email: "carlos@beta.com", role: "Agent" },
    { id: "u7", name: "Lucia Ferreira", email: "lucia@beta.com", role: "Agent" },
    { id: "u8", name: "Miguel Santos", email: "miguel@beta.com", role: "Supervisor" },
  ],
  ws_3: [
    { id: "u9", name: "Emma Wilson", email: "emma@gamma.com", role: "Agent" },
    { id: "u10", name: "James Brown", email: "james@gamma.com", role: "Manager" },
    { id: "u11", name: "Olivia Davis", email: "olivia@gamma.com", role: "Agent" },
    { id: "u12", name: "Noah Martinez", email: "noah@gamma.com", role: "Agent" },
  ],
};

