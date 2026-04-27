export const IVR_NODE_TYPES = {
  TRIGGER: "ivrTrigger",
  IVR_MENU: "ivrMenu",
  CONNECT_USER: "ivrConnectUser",
  CONNECT_TEAM: "ivrConnectTeam",
  PLAY_AUDIO: "ivrPlayAudio",
  HANGUP: "ivrHangup",
};

export const KEYPRESS_ACTIONS = [
  {
    value: IVR_NODE_TYPES.CONNECT_USER,
    label: "Connect to User",
    icon: "person",
  },
  {
    value: IVR_NODE_TYPES.CONNECT_TEAM,
    label: "Connect to Team",
    icon: "group",
  },
  { value: IVR_NODE_TYPES.PLAY_AUDIO, label: "Play Audio", icon: "volume" },
  { value: IVR_NODE_TYPES.HANGUP, label: "Hangup", icon: "hangup" },
  { value: IVR_NODE_TYPES.IVR_MENU, label: "IVR Menu", icon: "grid" },
];

export const DEMO_USERS = [
  { id: "u1", name: "Maha" },
  { id: "u2", name: "Rishi" },
  { id: "u3", name: "Test" },
  { id: "u4", name: "Ramu" },
];

export const DEMO_TEAMS = [
  { id: "t1", name: "Support Team" },
  { id: "t2", name: "Sales Team" },
  { id: "t3", name: "Billing Team" },
];

export function getDefaultNodeData(type, extra = {}) {
  const base = { type, name: "", ...extra };
  switch (type) {
    case IVR_NODE_TYPES.TRIGGER:
      return { ...base, name: "Trigger", phoneNumber: extra.phoneNumber || "" };
    case IVR_NODE_TYPES.IVR_MENU:
      return { ...base, name: "Ivr Node Component" };
    case IVR_NODE_TYPES.CONNECT_USER:
      return { ...base, name: "Connect to User", targetId: "", targetName: "" };
    case IVR_NODE_TYPES.CONNECT_TEAM:
      return { ...base, name: "Connect to Team", targetId: "", targetName: "" };
    case IVR_NODE_TYPES.PLAY_AUDIO:
      return { ...base, name: "Play Audio", audioFile: null };
    case IVR_NODE_TYPES.HANGUP:
      return { ...base, name: "Hangup" };
    default:
      return base;
  }
}

let _nodeCounter = 1;
export function makeNodeId(type) {
  return `${type}_${Date.now()}_${_nodeCounter++}`;
}

export function getActionLabel(actionType) {
  return KEYPRESS_ACTIONS.find((a) => a.value === actionType)?.label || "";
}
