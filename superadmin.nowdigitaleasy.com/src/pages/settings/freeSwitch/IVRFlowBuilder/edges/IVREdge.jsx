import { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { Box, IconButton, useTheme, alpha } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function IVREdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}) {
  const theme = useTheme();
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeColor = selected
    ? theme.palette.primary.main
    : style?.stroke || theme.palette.grey[4];

  const handleDelete = (e) => {
    e.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: edgeColor,
          strokeWidth: selected ? 2.5 : 1.8,
          transition: "stroke 0.2s, stroke-width 0.2s",
        }}
      />
      <EdgeLabelRenderer>
        {selected && (
          <Box
            sx={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{
                width: 20,
                height: 20,
                bgcolor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
                borderRadius: "50%",
                boxShadow: theme.shadows[2],
                transition: "all 0.15s",
                "&:hover": {
                  bgcolor: theme.palette.error.dark,
                  transform: "scale(1.15)",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: "0.7rem" }} />
            </IconButton>
          </Box>
        )}
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(IVREdge);
