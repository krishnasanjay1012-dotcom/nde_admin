import React, { useMemo } from "react";
import { Box } from "@mui/material";


import CommonComments from "../../../common/NDE-Comments";
import { useAddNote, useDeleteNote, useVendorNotes } from "../../../../hooks/Vendor/Vendor-hooks";

const VendorComments = ({ selectedVendor }) => {
  
  const { data, isLoading, refetch } = useVendorNotes({
    vendorId: selectedVendor?._id,
  });

  const comments = useMemo(() => {
    return (data?.data || []).map((item) => ({
      id: item._id,
      customer: item.selectedVendor?._id
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
      vendor_id:  selectedVendor?._id,
      note: text,
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

export default VendorComments;