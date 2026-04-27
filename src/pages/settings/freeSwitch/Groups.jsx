import { useState, useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import ReusableTable from "../../../components/common/Table/ReusableTable";
import CommonButton from "../../../components/common/NDE-Button";
import GroupsCreateEdit from "../../../components/settings/freeSwitch/Groups-Create-Edit";
import CommonSelect from "../../../components/common/fields/NDE-Select";
import CommonDeleteModal from "../../../components/common/NDE-DeleteModal";
import Edit from "../../../assets/icons/edit.svg";
import Delete from "../../../assets/icons/delete.svg";
import {
  useGetFreeSwitchGroup,
  useDeleteFreeSwitchGroup,
  useGetCallGroup,
  useDeleteCallGroup,
} from "../../../hooks/freeSwitch/groups-hooks";


const resolveTeamHead = (team_head) => {
  if (!team_head) return "N/A";
  const user = team_head.user_id;
  if (user) {
    return `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || user._id;
  }

  return (
    `${team_head.first_name || ""} ${team_head.last_name || ""}`.trim() ||
    team_head.username ||
    team_head.email ||
    team_head._id ||
    "N/A"
  );
};

const Groups = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState("group");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: groupsData, isLoading: isGroupsLoading } = useGetFreeSwitchGroup();
  const { data: callGroupsData, isLoading: isCallGroupsLoading } = useGetCallGroup();
  const deleteGroupMutation = useDeleteFreeSwitchGroup();
  const deleteCallGroupMutation = useDeleteCallGroup();

  const isLoading = isGroupsLoading || isCallGroupsLoading;

  //API arrays ────────────────────────────────────────────────
  const tableData = useMemo(() => {
    if (filter === "Call Group") {
      const list = Array.isArray(callGroupsData?.data)
        ? callGroupsData.data
        : callGroupsData?.data?.data || [];
      return list.map((item) => ({ ...item, type: "Call Group" }));
    }

    const list = Array.isArray(groupsData?.data)
      ? groupsData.data
      : groupsData?.data?.data || [];
    return list.map((item) => ({ ...item, type: "group" }));
  }, [groupsData, callGroupsData, filter]);

  // ── Handlers ───
  const handleEdit = (row) => {
    setSelectedGroup({ ...row, groupType: row.type, workspace: row.workspace });
    setOpenDialog(true);
  };

  const handleDelete = (row) => {
    setSelectedGroup(row);
    setDeleteModalOpen(true);
  };

  const onConfirmDelete = () => {
    if (!selectedGroup) return;
    const mutation =
      selectedGroup.type === "Call Group"
        ? deleteCallGroupMutation
        : deleteGroupMutation;
    mutation.mutate(selectedGroup._id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedGroup(null);
      },
    });
  };

  const handleAdd = () => {
    setSelectedGroup(null);
    setOpenDialog(true);
  };

  // ── Columns ───────
  const columns = useMemo(() => {
    const base = [
      {
        accessorKey: "workspace_name",
        header: "Workspace",
        cell: ({ row }) => row.original.workspace?.workspace_name || "N/A",
      },
      {
        accessorKey: "group_name",
        header: "Group Name",
        cell: ({ row }) => {
          const o = row.original;
          if (o.type === "Call Group") {
            return typeof o.group_id === "object"
              ? o.group_id?.group_name || "N/A"
              : o.group_id || "N/A";
          }
          return o.group_name || "N/A";
        },
      },
    ];

    const callGroupExtra =
      filter === "Call Group"
        ? [
          {
            accessorKey: "group_extension",
            header: "Group Extension",
            cell: ({ row }) => row.original.group_extension || "N/A",
          },
          {
            accessorKey: "domain",
            header: "Domain",
            cell: ({ row }) => {
              const dom = row.original.domain_id;
              if (!dom) return "N/A";
              return typeof dom === "object"
                ? dom.domain || dom.name || dom.domain_name || dom._id || "N/A"
                : dom;
            },
          },
          {
            accessorKey: "team_head",
            header: "Team Head",
            cell: ({ row }) => resolveTeamHead(row.original.team_head),
          },
          {
            accessorKey: "members",
            header: "Members",
            cell: ({ row }) =>
              Array.isArray(row.original.members)
                ? row.original.members.length
                : 0,
          },
        ]
        : [];

    const actionCol = {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => handleEdit(row.original)} size="small">
            <img src={Edit} style={{ height: 16 }} alt="Edit" />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original)} size="small">
            <img src={Delete} style={{ height: 18 }} alt="Delete" />
          </IconButton>
        </Box>
      ),
    };

    return [...base, ...callGroupExtra, actionCol];
  }, [filter]);

  // ── Filter options ────────────────────────────────────────────────────────
  const filterOptions = [
    { label: "Group", value: "group" },
    { label: "Call Group", value: "Call Group" },
  ];

  return (
    <Box>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={{ xs: 2, sm: 0 }}
        p={1}
      >
        <CommonSelect
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={filterOptions}
          mt={0}
          width="120px"
          mb={0}
        />

        <CommonButton
          label={`Create ${filter === "group" ? "Group" : "Call Group"}`}
          onClick={handleAdd}
        />
      </Box>

      <ReusableTable
        columns={columns}
        data={tableData}
        isLoading={isLoading}
        maxHeight="calc(94vh - 200px)"
      />

      <GroupsCreateEdit
        open={openDialog}
        setOpen={setOpenDialog}
        initialData={selectedGroup}
        groupType={selectedGroup ? selectedGroup.groupType : filter}
      />

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={onConfirmDelete}
        deleting={
          deleteGroupMutation.isPending || deleteCallGroupMutation.isPending
        }
        title={filter === "group" ? "Group" : "Call Group"}
        itemType={
          selectedGroup?.type === "Call Group"
            ? selectedGroup?.group_id?.group_name || ""
            : selectedGroup?.group_name || ""
        }
      />
    </Box>
  );
};

export default Groups;