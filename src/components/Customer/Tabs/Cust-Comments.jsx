import React, { useMemo } from "react";
import { Box } from "@mui/material";
import CommonComments from "../../common/NDE-Comments";

import {
  useClientNotes,
  useAddNote,
  useDeleteNote,
} from "../../../hooks/comments/comments-hooks";

const CustComments = ({ userId, selectedWorkspaceId }) => {
  const { data, isLoading, refetch } = useClientNotes({
    userId: userId,
  });

  const comments = useMemo(() => {
    return (data?.data || []).map((item) => ({
      id: item._id,

      customer: item.customerId
        ? `${item.customerId.first_name} ${item.customerId.last_name || ""}`
        : "Unknown Customer",
      text: item.note,
      user: item.createdBy?.name || item.createdBy?.username || "User",
      timestamp: item.createdAt ? new Date(item.createdAt) : null,
    }));
  }, [data]);

  const { mutate: addNote } = useAddNote({
    onSuccess: () => {
      refetch();
    },
  });

  const { mutate: deleteNote } = useDeleteNote({
    onSuccess: () => {
      refetch();
    },
  });

  const handleAdd = (text) => {
    addNote({
      customerId: userId,
      workspaceId: selectedWorkspaceId,
      note: text,
      noteType: "GENERAL",
    });
  };

  const handleDelete = (id) => {
    deleteNote({ id });
  };

  return (
    <Box>
      <CommonComments
        comments={comments}
        isLoading={isLoading}
        onAdd={handleAdd}
        onDelete={handleDelete}
        maxHeight="calc(100vh - 180px)"
      />
    </Box>
  );
};

export default CustComments;