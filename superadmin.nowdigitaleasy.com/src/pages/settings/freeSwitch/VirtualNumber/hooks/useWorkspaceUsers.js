import { useMemo } from "react";
import { MOCK_WORKSPACES, MOCK_USERS_BY_WORKSPACE } from "../Detail/constants";

export function useWorkspaceUsers(workspaceId = null) {
  const workspaces = MOCK_WORKSPACES;

  const users = useMemo(() => {
    if (!workspaceId) return [];
    return MOCK_USERS_BY_WORKSPACE[workspaceId] || [];
  }, [workspaceId]);

  return {
    workspaces,
    users,
    isLoading: false,
  };
}
