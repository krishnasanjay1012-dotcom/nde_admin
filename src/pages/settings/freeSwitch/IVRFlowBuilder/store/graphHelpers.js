import { IVR_NODE_TYPES, makeNodeId, getDefaultNodeData } from "../catalog";
import { childPosition } from "./helpers";

export function removeNodeTree(nodes, edges, rootId) {
  const toRemove = new Set();
  const queue = [rootId];
  while (queue.length) {
    const id = queue.shift();
    toRemove.add(id);
    edges.filter((e) => e.source === id).forEach((e) => queue.push(e.target));
  }
  return {
    nodes: nodes.filter((n) => !toRemove.has(n.id)),
    edges: edges.filter(
      (e) => !toRemove.has(e.source) && !toRemove.has(e.target),
    ),
  };
}

// check if nodeId is a descendant of ancestorId via edges
export function isDescendant(nodeId, ancestorId, edges) {
  if (!ancestorId) return false;
  const visited = new Set();
  const queue = [ancestorId];
  while (queue.length) {
    const cur = queue.shift();
    if (cur === nodeId) return true;
    if (visited.has(cur)) continue;
    visited.add(cur);
    edges.filter((e) => e.source === cur).forEach((e) => queue.push(e.target));
  }
  return false;
}

export function cleanupKeypresses(keypresses, remainingIds) {
  const result = {};
  remainingIds.forEach((id) => {
    if (keypresses[id]) result[id] = keypresses[id];
  });
  return result;
}

// remove orphan audio file refs for nodes no longer in the graph
export function cleanupAudioFiles(audioFiles, remainingIds) {
  const result = {};
  remainingIds.forEach((id) => {
    if (audioFiles[id] !== undefined) result[id] = audioFiles[id];
  });
  return result;
}

// spawn a child node for the given action type
export function spawnChildNode(
  actionType,
  parentNode,
  siblingIndex,
  existingNodes,
) {
  const id = makeNodeId(actionType);
  const pos = childPosition(parentNode, siblingIndex);

  const occupied = new Set(
    existingNodes.map(
      (n) =>
        `${Math.round(n.position.x / 50)}_${Math.round(n.position.y / 50)}`,
    ),
  );
  let { x, y } = pos;
  while (occupied.has(`${Math.round(x / 50)}_${Math.round(y / 50)}`)) {
    x += 30;
    y += 10;
  }

  const data = getDefaultNodeData(actionType);
  const childNode = {
    id,
    type: actionType,
    position: { x, y },
    data,
    draggable: true,
  };

  const childKeypresses =
    actionType === IVR_NODE_TYPES.IVR_MENU
      ? [
          { key: 1, action: "", targetId: "", targetName: "" },
          { key: 2, action: "", targetId: "", targetName: "" },
        ]
      : null;

  if (childKeypresses) {
    childNode.data = { ...childNode.data, keypresses: childKeypresses };
  }

  return { childNode, childKeypresses };
}
