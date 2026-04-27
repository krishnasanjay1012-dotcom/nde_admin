import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import { toast } from "react-hot-toast";
import { IVR_NODE_TYPES, makeNodeId, getDefaultNodeData } from "../catalog";
import { buildEdge, buildTriggerEdge } from "./helpers";
import {
  removeNodeTree,
  spawnChildNode,
  cleanupKeypresses,
  cleanupAudioFiles,
} from "./graphHelpers";

// ─── store ─────────────

export const useIVRFlowStore = create((set, get) => ({
  nodes: [],
  edges: [],

  selectedNodeId: null,

  keypresses: {},

  audioFiles: {},

  isLoading: false,
  setLoading: (v) => set({ isLoading: v }),

  past: [],
  future: [],

  _takeSnapshot: () => {
    const { nodes, edges, keypresses, audioFiles } = get();
    set((s) => ({
      past: [
        ...s.past.slice(-29),
        {
          nodes: JSON.parse(JSON.stringify(nodes)),
          edges: JSON.parse(JSON.stringify(edges)),
          keypresses: JSON.parse(JSON.stringify(keypresses)),
          audioFiles: { ...audioFiles },
        },
      ],
      future: [],
    }));
  },

  undo: () => {
    const { past, nodes, edges, keypresses, audioFiles } = get();
    if (!past.length) return;
    const prev = past[past.length - 1];
    set({
      nodes: prev.nodes,
      edges: prev.edges,
      keypresses: prev.keypresses,
      audioFiles: prev.audioFiles,
      past: past.slice(0, -1),
      future: [{ nodes, edges, keypresses, audioFiles }, ...get().future].slice(
        0,
        30,
      ),
      selectedNodeId: null,
    });
  },

  redo: () => {
    const { future, nodes, edges, keypresses, audioFiles } = get();
    if (!future.length) return;
    const next = future[0];
    set({
      nodes: next.nodes,
      edges: next.edges,
      keypresses: next.keypresses,
      audioFiles: next.audioFiles,
      future: future.slice(1),
      past: [...get().past, { nodes, edges, keypresses, audioFiles }].slice(
        -30,
      ),
      selectedNodeId: null,
    });
  },

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  layoutFlow: (direction = "TB") => {
    get()._takeSnapshot();

    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 100 });

    const { nodes, edges } = get();

    nodes.forEach((n) => {
      dagreGraph.setNode(n.id, {
        width: n.measured?.width || 250,
        height: n.measured?.height || 100,
      });
    });

    edges.forEach((e) => {
      dagreGraph.setEdge(e.source, e.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((n) => {
      const nodeWithPosition = dagreGraph.node(n.id);
      return {
        ...n,
        position: {
          x: nodeWithPosition.x - (n.measured?.width || 250) / 2,
          y: nodeWithPosition.y - (n.measured?.height || 100) / 2,
        },
      };
    });

    set({ nodes: layoutedNodes });
  },

  // init ─

  initFlow: (phoneNumber = "") => {
    const triggerId = makeNodeId(IVR_NODE_TYPES.TRIGGER);
    const triggerNode = {
      id: triggerId,
      type: IVR_NODE_TYPES.TRIGGER,
      position: { x: 280, y: 120 },
      data: getDefaultNodeData(IVR_NODE_TYPES.TRIGGER, { phoneNumber }),
      draggable: true,
    };
    set({
      nodes: [triggerNode],
      edges: [],
      selectedNodeId: triggerId,
      keypresses: {},
      audioFiles: {},
      past: [],
      future: [],
    });
  },

  //selection

  selectNode: (id) => set({ selectedNodeId: id }),

  setComponentName: (nodeId, name) => {
    get()._takeSnapshot();
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, name } } : n,
      ),
    });
  },

  //trigger "then" action

  setTriggerAction: (triggerId, actionType) => {
    get()._takeSnapshot();
    const { nodes, edges } = get();
    const triggerNode = nodes.find((n) => n.id === triggerId);

    const prevEdge = edges.find(
      (e) => e.source === triggerId && e.sourceHandle === "out",
    );
    const prevChildId = prevEdge?.target;
    let filteredNodes = [...nodes];
    let filteredEdges = [...edges];
    if (prevChildId) {
      const removed = removeNodeTree(filteredNodes, filteredEdges, prevChildId);
      filteredNodes = removed.nodes;
      filteredEdges = removed.edges;
    }

    if (!actionType) {
      set({
        nodes: filteredNodes,
        edges: filteredEdges.filter((e) => e.source !== triggerId),
        keypresses: cleanupKeypresses(
          get().keypresses,
          filteredNodes.map((n) => n.id),
        ),
        audioFiles: cleanupAudioFiles(
          get().audioFiles,
          filteredNodes.map((n) => n.id),
        ),
      });
      return;
    }

    const { childNode, childKeypresses } = spawnChildNode(
      actionType,
      triggerNode,
      0,
      filteredNodes,
    );
    const edge = buildTriggerEdge(triggerId, childNode.id);

    set({
      nodes: [...filteredNodes, childNode],
      edges: [...filteredEdges.filter((e) => e.source !== triggerId), edge],
      keypresses: {
        ...get().keypresses,
        ...(childKeypresses ? { [childNode.id]: childKeypresses } : {}),
      },
      audioFiles: cleanupAudioFiles(
        get().audioFiles,
        [...filteredNodes, childNode].map((n) => n.id),
      ),
    });
  },

  addKeypress: (nodeId) => {
    get()._takeSnapshot();
    const current = get().keypresses[nodeId] || [];
    const nextKey =
      current.length > 0 ? Math.max(...current.map((k) => k.key)) + 1 : 1;
    const updated = [
      ...current,
      { key: nextKey, action: "", targetId: "", targetName: "" },
    ];
    set({ keypresses: { ...get().keypresses, [nodeId]: updated } });
    get()._syncMenuNodeData(nodeId);
  },

  removeKeypress: (nodeId, key) => {
    get()._takeSnapshot();
    const { nodes, edges, keypresses, audioFiles } = get();
    const current = keypresses[nodeId] || [];
    const row = current.find((k) => k.key === key);

    let newNodes = [...nodes];
    let newEdges = [...edges];
    if (row?.action) {
      const edge = edges.find(
        (e) => e.source === nodeId && e.sourceHandle === `key-${key}`,
      );
      if (edge?.target) {
        const removed = removeNodeTree(newNodes, newEdges, edge.target);
        newNodes = removed.nodes;
        newEdges = removed.edges;
      }
    }

    const updated = current.filter((k) => k.key !== key);
    set({
      nodes: newNodes,
      edges: newEdges,
      keypresses: { ...keypresses, [nodeId]: updated },
      audioFiles: cleanupAudioFiles(
        audioFiles,
        newNodes.map((n) => n.id),
      ),
    });
    get()._syncMenuNodeData(nodeId);
  },

  // when user picks action for a keypress row:

  setKeypressAction: (nodeId, key, actionType) => {
    get()._takeSnapshot();
    const { nodes, edges, keypresses } = get();
    const parentNode = nodes.find((n) => n.id === nodeId);

    const prevEdge = edges.find(
      (e) => e.source === nodeId && e.sourceHandle === `key-${key}`,
    );
    const prevChildId = prevEdge?.target;
    let workingNodes = [...nodes];
    let workingEdges = [...edges];
    if (prevChildId) {
      const removed = removeNodeTree(workingNodes, workingEdges, prevChildId);
      workingNodes = removed.nodes;
      workingEdges = removed.edges;
    }

    const currentRows = keypresses[nodeId] || [];
    const updatedRows = currentRows.map((k) =>
      k.key === key
        ? { ...k, action: actionType, targetId: "", targetName: "" }
        : k,
    );

    if (!actionType) {
      set({
        nodes: workingNodes,
        edges: workingEdges,
        keypresses: { ...keypresses, [nodeId]: updatedRows },
      });
      get()._syncMenuNodeData(nodeId);
      return;
    }

    const siblingIndex = updatedRows.findIndex((k) => k.key === key);
    const { childNode, childKeypresses } = spawnChildNode(
      actionType,
      parentNode,
      siblingIndex,
      workingNodes,
    );
    const edge = buildEdge(nodeId, key, childNode.id);

    set({
      nodes: [...workingNodes, childNode],
      edges: [...workingEdges, edge],
      keypresses: {
        ...get().keypresses,
        [nodeId]: updatedRows,
        ...(childKeypresses ? { [childNode.id]: childKeypresses } : {}),
      },
    });
    get()._syncMenuNodeData(nodeId);
  },

  // set selected user/team for keypress row and update the child node label
  setKeypressTarget: (nodeId, key, targetId, targetName) => {
    const { keypresses } = get();
    const rows = keypresses[nodeId] || [];
    const updated = rows.map((k) =>
      k.key === key ? { ...k, targetId, targetName } : k,
    );

    const { nodes, edges } = get();
    const edge = edges.find(
      (e) => e.source === nodeId && e.sourceHandle === `key-${key}`,
    );
    const childId = edge?.target;
    let newNodes = nodes;
    if (childId) {
      newNodes = nodes.map((n) =>
        n.id === childId
          ? { ...n, data: { ...n.data, targetId, targetName } }
          : n,
      );
    }

    set({ keypresses: { ...keypresses, [nodeId]: updated }, nodes: newNodes });
    get()._syncMenuNodeData(nodeId);
  },

  //audio upload

  setAudioFile: (nodeId, file) => {
    set({ audioFiles: { ...get().audioFiles, [nodeId]: file } });
  },

  //delete node

  deleteNode: (nodeId) => {
    get()._takeSnapshot();
    const { nodes, edges } = get();
    const removed = removeNodeTree(nodes, edges, nodeId);
    const remainingIds = removed.nodes.map((n) => n.id);
    set({
      nodes: removed.nodes,
      edges: removed.edges,
      keypresses: cleanupKeypresses(get().keypresses, remainingIds),
      audioFiles: cleanupAudioFiles(get().audioFiles, remainingIds),
      selectedNodeId:
        get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });

    // clean up parent keypress row reference
    const parentEdge = edges.find((e) => e.target === nodeId);
    if (parentEdge) {
      const parentId = parentEdge.source;
      const key = parseInt(parentEdge.sourceHandle?.replace("key-", "") || "0");
      const rows = (get().keypresses[parentId] || []).map((k) =>
        k.key === key ? { ...k, action: "", targetId: "", targetName: "" } : k,
      );
      set({ keypresses: { ...get().keypresses, [parentId]: rows } });
      get()._syncMenuNodeData(parentId);
    }
  },

  //internal: sync ivr menu node's data.keypresses

  _syncMenuNodeData: (nodeId) => {
    const rows = get().keypresses[nodeId] || [];
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, keypresses: rows } } : n,
      ),
    });
  },

  //messaging

  openMessage: (msg, severity = "info") => {
    if (severity === "error") toast.error(msg);
    else if (severity === "warning") toast(msg, { icon: "⚠️" });
    else toast.success(msg);
  },
}));
