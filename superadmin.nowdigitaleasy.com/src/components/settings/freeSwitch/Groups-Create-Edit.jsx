import React, { useEffect, useMemo, useRef } from "react";
import { Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CommonDrawer from "../../common/NDE-Drawer";
import CommonTextField from "../../common/fields/NDE-TextField";
import CommonMultiSelect from "../../common/fields/NDE-MultiSelect";
import WorkSpaceDropdownList from "../../common/NDE-WorkspaceList";
import {
  useAddFreeSwitchGroup,
  useUpdateFreeSwitchGroup,
  useGetWorkspaceUsersDomain,
  useGetDomainUsers,
  useAddCallGroup,
  useUpdateCallGroup,
} from "../../../hooks/freeSwitch/groups-hooks";
import CommonSelect from "../../common/fields/NDE-Select";



const toId = (val) => {
  if (!val) return "";
  return typeof val === "object" ? val._id || "" : val;
};

const schema = yup.object().shape({
  groupType: yup.string().required("Group Type is required"),
  workspace_id: yup.string().required("Workspace is required"),
  group_name: yup.string().required("Group Name is required"),
  domain_id: yup.string().when("groupType", {
    is: "Call Group",
    then: (s) => s.required("Domain is required"),
    otherwise: (s) => s.nullable(),
  }),
  team_head: yup.string().when("groupType", {
    is: "Call Group",
    then: (s) => s.required("Team Head is required"),
    otherwise: (s) => s.nullable(),
  }),
  members: yup.array().when("groupType", {
    is: "Call Group",
    then: (s) => s.min(1, "At least one member is required").required(),
    otherwise: (s) => s.nullable(),
  }),
  group_extension: yup.string().nullable(),
  call_type: yup.string().when("groupType", {
    is: "Call Group",
    then: (s) => s.required("Call Type is required"),
    otherwise: (s) => s.nullable(),
  }),
  strategy: yup.string().when("groupType", {
    is: "Call Group",
    then: (s) => s.required("Strategy is required"),
    otherwise: (s) => s.nullable(),
  }),
  agent_ring_timeout: yup.number().when("groupType", {
    is: "Call Group",
    then: (s) => s.required("Agent Ring Timeout is required"),
    otherwise: (s) => s.nullable(),
  }),
  max_wait_time: yup.number().when("groupType", {
    is: "Call Group",
    then: (s) => s.required("Max Wait Time is required"),
    otherwise: (s) => s.nullable(),
  }),
  // moh_sound: yup.string().when("groupType", {
  //   is: "Call Group",
  //   then: (s) => s.required("MOH Sound is required"),
  //   otherwise: (s) => s.nullable(),
  // }),
  call_queue_name: yup.string().nullable(),
});

const GroupsCreateEdit = ({ open, setOpen, initialData = null, groupType: propGroupType }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      groupType: propGroupType,
      workspace_id: "",
      group_name: "",
      team_head: "",
      members: [],
      domain_id: "",
      group_extension: "",
      call_type: "",
      strategy: "",
      agent_ring_timeout: 20,
      max_wait_time: 300,
      // moh_sound: "local stream",
      call_queue_name: null,
    },
  });

  const addFreeSwitchGroup = useAddFreeSwitchGroup();
  const updateFreeSwitchGroup = useUpdateFreeSwitchGroup();
  const addCallGroup = useAddCallGroup();
  const updateCallGroup = useUpdateCallGroup();

  const selectedWorkspace = watch("workspace_id");
  const selectedDomain = watch("domain_id");


  const workspaceId = toId(selectedWorkspace);
  const domainId = toId(selectedDomain);

  //For Call Group forms ────────────────────────
  const isCallGroup = propGroupType === "Call Group";

  const { data: workspaceData, isLoading: isWorkspaceLoading } =
    useGetWorkspaceUsersDomain(workspaceId, { enabled: isCallGroup && !!workspaceId });

  const { data: domainData, isLoading: isDomainLoading } =
    useGetDomainUsers(workspaceId, domainId, { enabled: isCallGroup && !!workspaceId && !!domainId });

  // ── Dropdown options ──────────────────────────────────────────────────────
  const userOptions = useMemo(() => {
    return (
      domainData?.data?.users?.map((user) => ({
        label:
          `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
          user.username ||
          user.email ||
          user._id,
        value: user._id,
        heading:
          `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
          user.username ||
          user.email ||
          user._id,
      })) || []
    );
  }, [domainData]);

  const groupOptions = useMemo(() => {
    return (
      workspaceData?.data?.groups?.map((group) => ({
        label: group.group_name,
        value: group._id,
      })) || []
    );
  }, [workspaceData]);

  const domainOptions = useMemo(() => {
    return (
      workspaceData?.data?.domains?.map((domain) => ({
        label: domain.domain || domain.name || domain._id,
        value: domain._id,
      })) || []
    );
  }, [workspaceData]);

  const callTypeOptions = [
    { label: "Simultaneous", value: "simultaneous" },
    { label: "Queue", value: "queue" },
  ];

  const strategyOptions = [
    { label: "Longest Idle Agent", value: "longest-idle-agent" },
    { label: "Round Robin", value: "round-robin" },
    { label: "Top Down", value: "top-down" },
  ];

  // ── Auto-fill cc_queue_name ───────────────────────
  const selectedCallType = watch("call_type");
  const selectedGroupName = watch("group_name");

  useEffect(() => {
    if (selectedCallType === "queue" && selectedGroupName) {
      const selectedGroup = groupOptions.find((g) => g.value === selectedGroupName);
      if (selectedGroup) {
        setValue("call_queue_name", selectedGroup.label);
      }
    } else if (selectedCallType !== "queue") {
      setValue("call_queue_name", null);
    }
  }, [selectedCallType, selectedGroupName, groupOptions, setValue]);


  // ── Auto-populate domain ─────────────────────────────
  useEffect(() => {
    if (workspaceData?.data?.domains?.length === 1 && !watch("domain_id")) {
      setValue("domain_id", workspaceData.data.domains[0]._id);
    }
  }, [workspaceData, setValue, watch]);

  //workspace change ──────────────────────────────────
  const prevWorkspaceRef = useRef(selectedWorkspace);
  useEffect(() => {
    if (prevWorkspaceRef.current && prevWorkspaceRef.current !== selectedWorkspace) {
      setValue("members", []);
      setValue("domain_id", "");
    }
    prevWorkspaceRef.current = selectedWorkspace;
  }, [selectedWorkspace, setValue]);

  // ── Reset members on domain change ────────────────────────────────────────
  const prevDomainRef = useRef(selectedDomain);
  useEffect(() => {
    if (prevDomainRef.current && prevDomainRef.current !== selectedDomain) {
      setValue("members", []);
    }
    prevDomainRef.current = selectedDomain;
  }, [selectedDomain, setValue]);

  // ── Pre-fill form on edit─────────
  useEffect(() => {
    if (!open) return;

    if (initialData) {
      const workspace_id = toId(initialData.workspace_id);

      const group_name =
        propGroupType === "Call Group"
          ? toId(initialData.group_id) || toId(initialData._id)
          : initialData.group_name || "";

      const domain_id = toId(initialData.domain_id);
      const team_head = toId(initialData.team_head);
      const members = (initialData.members || []).map((m) => toId(m));

      reset({
        groupType: propGroupType,
        workspace_id,
        group_name,
        domain_id,
        team_head,
        members,
        group_extension: initialData.group_extension || "",
        call_type: initialData.call_type || "",
        strategy: initialData.strategy || "",
        agent_ring_timeout: initialData.agent_ring_timeout || 20,
        max_wait_time: initialData.max_wait_time || 300,
        // moh_sound: initialData.moh_sound || "local stream",
        call_queue_name: initialData.call_queue_name || null,
      });

      setValue("workspace_id", workspace_id);
    } else {
      reset({
        groupType: propGroupType,
        workspace_id: "",
        group_name: "",
        team_head: "",
        members: [],
        domain_id: "",
        group_extension: "",
        call_type: "",
        strategy: "",
        agent_ring_timeout: 20,
        max_wait_time: 300,
        // moh_sound: "local stream",
        call_queue_name: null,
      });
    }
  }, [initialData, reset, open, propGroupType]);

  // ── Handlers ──────────────────
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    const payload =
      data.groupType === "Call Group"
        ? {
          workspace_id: data.workspace_id,
          group_id: data.group_name,
          team_head: data.team_head,
          domain_id: data.domain_id,
          members: data.members,
          group_extension: data.group_extension,
          call_type: data.call_type,
          strategy: data.strategy,
          agent_ring_timeout: data.agent_ring_timeout,
          max_wait_time: data.max_wait_time,
          // moh_sound: data.moh_sound,
          call_queue_name: data.call_queue_name,
        }
        : {
          workspace_id: data.workspace_id,
          group_name: data.group_name,
        };

    if (initialData) {
      const mutation =
        data.groupType === "Call Group" ? updateCallGroup : updateFreeSwitchGroup;
      mutation.mutate(
        { id: initialData._id, data: payload },
        { onSuccess: handleClose }
      );
    } else {
      if (data.groupType === "Call Group") {
        addCallGroup.mutate(payload, { onSuccess: handleClose });
      } else {
        addFreeSwitchGroup.mutate(payload, { onSuccess: handleClose });
      }
    }
  };

  const actions = [
    {
      label: "Cancel",
      onClick: handleClose,
      variant: "outlined",
    },
    {
      label: initialData ? "Update" : "Create",
      onClick: handleSubmit(onSubmit),
    },
  ];


  return (
    <CommonDrawer
      open={open}
      onClose={handleClose}
      title={`${initialData ? "Edit" : "Create"} ${propGroupType === "group" ? "Group" : "Call Group"}`}
      actions={actions}
      width={450}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <WorkSpaceDropdownList
          control={control}
          errors={errors}
          name="workspace_id"
          setValue={setValue}
          workspace_id={watch("workspace_id")}
          initialWorkspace={initialData?.workspace_id}
        />

        <Controller
          name="group_name"
          control={control}
          render={({ field }) =>
            propGroupType === "Call Group" ? (
              <CommonSelect
                {...field}
                label="Group Name"
                options={groupOptions}
                error={!!errors.group_name}
                helperText={errors.group_name?.message}
                mandatory
              />
            ) : (
              <CommonTextField
                {...field}
                label="Group Name"
                error={!!errors.group_name}
                helperText={errors.group_name?.message}
                mandatory
              />
            )
          }
        />

        {propGroupType === "Call Group" && (
          <>
            <Controller
              name="domain_id"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  label="Domain"
                  options={domainOptions}
                  error={!!errors.domain_id}
                  helperText={errors.domain_id?.message}
                  mandatory
                  loading={isWorkspaceLoading}
                />
              )}
            />

            <Controller
              name="team_head"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  label="Team Head"
                  options={userOptions}
                  error={!!errors.team_head}
                  helperText={errors.team_head?.message}
                  mandatory
                  loading={isDomainLoading}
                />
              )}
            />

            <Controller
              name="members"
              control={control}
              render={({ field }) => (
                <CommonMultiSelect
                  {...field}
                  label="Users"
                  options={userOptions}
                  error={!!errors.members}
                  helperText={errors.members?.message}
                  onChange={(e) => field.onChange(e.target.value)}
                  mandatory
                  loading={isDomainLoading}
                />
              )}
            />

            <Controller
              name="call_type"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  label="Call Type"
                  options={callTypeOptions}
                  error={!!errors.call_type}
                  helperText={errors.call_type?.message}
                  mandatory
                />
              )}
            />

            <Controller
              name="strategy"
              control={control}
              render={({ field }) => (
                <CommonSelect
                  {...field}
                  label="Strategy"
                  options={strategyOptions}
                  error={!!errors.strategy}
                  helperText={errors.strategy?.message}
                  mandatory
                />
              )}
            />

            <Controller
              name="agent_ring_timeout"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  label="Agent Ring Timeout"
                  type="number"
                  error={!!errors.agent_ring_timeout}
                  helperText={errors.agent_ring_timeout?.message}
                  mandatory
                />
              )}
            />

            <Controller
              name="max_wait_time"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  label="Max Wait Time"
                  type="number"
                  error={!!errors.max_wait_time}
                  helperText={errors.max_wait_time?.message}
                  mandatory
                />
              )}
            />

            {/* <Controller
              name="moh_sound"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  label="MOH Sound"
                  error={!!errors.moh_sound}
                  helperText={errors.moh_sound?.message}
                  mandatory
                />
              )}
            /> */}

            <Controller
              name="call_queue_name"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  label="Call Queue Name"
                  error={!!errors.call_queue_name}
                  helperText={errors.call_queue_name?.message}
                />
              )}
            />

            {initialData && (
              <Controller
                name="group_extension"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    label="Group Extension"
                    error={!!errors.group_extension}
                    helperText={errors.group_extension?.message}
                    InputProps={{ readOnly: true }}
                  />
                )}
              />
            )}
          </>
        )}
      </Box>
    </CommonDrawer>
  );
};

export default GroupsCreateEdit;