import {
  CopyAllOutlined,
  DeleteOutlineRounded,
  EditOutlined,
  MoreHorizRounded,
  ViewAgenda,
} from "@mui/icons-material";
import {
  Box,
  ClickAwayListener,
  Fade,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  useTheme,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import { useGetComponent } from "../../../hooks/global-dashboard/global-dashboard";
import { deleteComponent } from "../../../services/global-dashboard/global-dashboard";
import SideBarDrawer from "../CreateComponent/ComponentsSideBar/SideBarDrawer";
import ChartPreview from "./Chart/ChartPreview";

const MENU_ITEMS = [
  {
    label: "Edit",
    icon: <EditOutlined fontSize="small" />,
    color: "inherit",
    action: "edit",
  },
  {
    label: "Delete",
    icon: <DeleteOutlineRounded fontSize="small" />,
    color: "error.main",
    bgHover: "error.light",
    action: "delete",
  },
  {
    label: "Clone",
    icon: <CopyAllOutlined fontSize="small" />,
    color: "inherit",
    action: "clone",
  },
  {
    label: "Full View",
    icon: <ViewAgenda fontSize="small" />,
    color: "inherit",
    action: "preview",
  },
];

export default function MoreOptions({ data, child }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const queryClient = useQueryClient();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [openChartPreview, setChartPreview] = useState(false);
  const [ComponentModalOpen, setComponentModalOpen] = useState(false);
  const [componentData, setComponentData] = useState(null);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const {
    data: componentDetails,
    isLoading: isComponentDetailsLoading,
    dataUpdatedAt,
  } = useGetComponent({
    module: data?.itemType === "targetMeter" ? "target" : data?.itemType,
    id: data?._id,
    enabled: !!ComponentModalOpen && !!data?._id && !!data?.itemType,
  });

  useEffect(() => {
    if (componentDetails && ComponentModalOpen) {
      let { category, type, chartType, filters, ...rest } = componentDetails;
      setComponentData({
        id: componentData?.id,
        key: category || type || chartType,
        criteriaFilter: filters?.map((i) => ({
          field: i?.field,
          condition: i?.operator,
          value: i?.value,
          ref: i?.ref,
          type: i?.type,
        })),
        ...rest,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdatedAt, ComponentModalOpen]);

  const handleAction = (action) => {
    setOpen(false);
    if (action === "delete") {
      setDeleteModalOpen(true);
    } else if (action === "edit") {
      setComponentModalOpen(true);
      setComponentData({ id: data?._id });
    } else if (action === "clone") {
      setComponentModalOpen(true);
      setComponentData({});
    } else if (action === "preview") {
      setChartPreview(true);
    }
  };

  const { mutate: deleteComponentMutate, isPending } = useMutation({
    mutationFn: deleteComponent,

    onMutate: () => {
      const toastId = toast.loading("Deleting component...");
      return { toastId }; // scoped per mutation call
    },

    onError: (_error, _variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
    },

    onSuccess: (_data, variables, context) => {
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }

      queryClient.setQueryData(["getDashboardContentList"], (prev = []) =>
        prev.filter((item) => item._id !== variables.id),
      );
    },
  });

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <IconButton
          disabled={isPending}
          ref={anchorRef}
          sx={{
            p: 0,
            m: 0,
            bgcolor: isDark ? "background.paper" : "background.default",
          }}
          onClick={() => setOpen((prev) => !prev)}
        >
          <MoreHorizRounded fontSize="small" />
        </IconButton>

        <Fade in={open} timeout={150}>
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              zIndex: 1300,
              minWidth: 140,
              borderRadius: "10px",
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              py: 0.5,
            }}
          >
            {MENU_ITEMS.map(({ label, icon, color, action }) => {
              if (data?.itemType !== "chart" && action === "preview") {
                return;
              }
              return (
                <MenuItem
                  key={action}
                  onClick={() => handleAction(action)}
                  sx={{
                    px: 2,
                    py: 0.9,
                    // gap: 1.5,
                    "&:hover": {
                      color,
                      backgroundColor:
                        action === "delete" ? "error.light" : "action.hover",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "unset", color: "inherit" }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    sx={{ fontSize: 14, fontWeight: 500 }}
                  />
                </MenuItem>
              );
            })}
          </Paper>
        </Fade>
        {/* delete modal */}
        <CommonDeleteModal
          deleting={isPending}
          onConfirmDelete={() =>
            deleteComponentMutate({
              id: data._id,
              module:
                data.itemType === "targetMeter" ? "target" : data.itemType,
            })
          }
          title={`Component`}
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        />

        {/* clone */}
        <SideBarDrawer
          isComponentDetailsLoading={isComponentDetailsLoading}
          componentType={
            data?.itemType === "targetMeter" ? "target" : data.itemType
          }
          open={ComponentModalOpen}
          setComponentCreateData={setComponentData}
          componentCreateData={componentData}
          setComponentType={null}
          handleDrawer={() => {
            setComponentModalOpen(false);
            setComponentData(null);
          }}
        />

        {/*chart preview */}
        <ChartPreview
          child={child}
          open={openChartPreview}
          setOpen={setChartPreview}
        />
      </Box>
    </ClickAwayListener>
  );
}
