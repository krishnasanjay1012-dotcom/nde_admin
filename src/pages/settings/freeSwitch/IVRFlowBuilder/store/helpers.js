import { MarkerType } from "@xyflow/react";

export function childPosition(parentNode, siblingIndex = 0) {
  const x = (parentNode?.position?.x ?? 300) + siblingIndex * 300;
  const y = (parentNode?.position?.y ?? 200) + 260;
  return { x, y };
}

export function defaultKeypresses() {
  return [
    { key: 1, action: "", targetId: "", targetName: "" },
    { key: 2, action: "", targetId: "", targetName: "" },
  ];
}

export function buildEdge(parentId, key, childId) {
  return {
    id: `e_${parentId}_key${key}_${childId}`,
    source: parentId,
    sourceHandle: `key-${key}`,
    target: childId,
    targetHandle: "in",
    type: "ivrEdge",
    style: { stroke: "#aaa", strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#aaa" },
  };
}

// build a trigger-out edge to a direct child
export function buildTriggerEdge(triggerId, childId) {
  return {
    id: `e_${triggerId}_out_${childId}`,
    source: triggerId,
    sourceHandle: "out",
    target: childId,
    targetHandle: "in",
    type: "ivrEdge",
    style: { stroke: "#aaa", strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#aaa" },
  };
}
