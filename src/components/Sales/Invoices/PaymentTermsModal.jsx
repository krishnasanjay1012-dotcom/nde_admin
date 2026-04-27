// import {
//   Box,
//   Typography,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Stack,
//   Chip,
//   Button,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import EditIcon from "@mui/icons-material/Edit";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { CommonTextField } from "../../common/fields";
// import {
//   useAddPaymentTerm,
//   useDeletePaymentTerm,
//   usePaymentTerms,
//   useUpdatePaymentTerm,
// } from "../../../hooks/payment-terms/payment-terms-hooks";
// import { useEffect, useState } from "react";
// import CommonDeleteModal from "../../common/NDE-DeleteModal";
// import CheckIcon from "@mui/icons-material/Check";
// import CommonDialog from "../../common/NDE-Dialog";

// const schema = yup.object().shape({
//   terms: yup
//     .array()
//     .of(
//       yup.object().shape({
//         name: yup.string().required("Term name is required"),
//         days: yup.string().required("Days required"),
//         isDefault: yup.boolean(),
//       }),
//     )
//     .min(1, "At least one term required")
//     .test("one-default", "One term must be marked as default", (terms) =>
//       terms?.some((t) => t.isDefault),
//     ),
// });

// export default function PaymentTermsModal({ open, onClose }) {
//   const {
//     control,
//     handleSubmit,
//     watch,
//     setValue,
//     reset,
//     formState: { errors, isDirty },
//   } = useForm({
//     defaultValues: { terms: [] },
//     resolver: yupResolver(schema),
//   });

//   const { fields, append } = useFieldArray({ control, name: "terms" });

//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editingData, setEditingData] = useState(null);
//   const watchedTerms = watch("terms");

//   const { data } = usePaymentTerms();
//   const paymentTermsData = data?.data || [];
//   const deleteMutation = useDeletePaymentTerm();

//   useEffect(() => {
//     if (paymentTermsData.length) {
//       const mapped = paymentTermsData.map((t) => ({
//         name: t.termName,
//         days: t.numberOfDays || 0,
//         isDefault: t.isDefault || false,
//         termId: t._id || null,
//       }));
//       reset({ terms: mapped });
//     }
//   }, [paymentTermsData, reset]);

//   const { mutate: AddPaymentTerm } = useAddPaymentTerm();
//   const { mutate: updateMutation } = useUpdatePaymentTerm();

//   const handleDeletePaymentTerm = (row) => {
//     setDeleteTarget(row);
//     setDeleteModalOpen(true);
//   };

//   const handleEditPaymentTerm = (index) => {
//     setEditingIndex(index);
//     setEditingData(watchedTerms[index]);
//   };

//   const handleCloseEditIcon = () => setEditingIndex(null);

//   const confirmEdit = () => {
//     if (editingData) {
//       updateMutation(
//         {
//           data: {
//             termName: editingData?.name,
//             numberOfDays: editingData?.days,
//           },
//           id: editingData?.termId,
//         },
//         {
//           onSuccess: () => {
//             setEditingIndex(null);
//             setEditingData(null);
//           },
//           onError: (err) => console.error("Update Failed:", err),
//         },
//       );
//     }
//   };

//   const confirmDelete = () => {
//     if (deleteTarget) {
//       deleteMutation.mutate(deleteTarget?.termId, {
//         onSuccess: () => {
//           setDeleteModalOpen(false);
//           setDeleteTarget(null);
//         },
//       });
//     }
//   };

//   const onSubmit = (data) => {
//     const lastIndex = data.terms.length - 1;
//     const newTerm = data.terms[lastIndex];
//     AddPaymentTerm({ termName: newTerm.name, numberOfDays: newTerm.days });
//     onClose();
//   };

//   const handleSetDefault = (index) => {
//     watchedTerms.forEach((_, i) => {
//       setValue(`terms.${i}.isDefault`, i === index);
//     });
//   };

//   return (
//     <>
//       <CommonDialog
//         open={open}
//         onClose={onClose}
//         title="Configure Payment Terms"
//         onSubmit={handleSubmit(onSubmit)}
//         submitLabel="Save"
//         cancelLabel="Cancel"
//         width={600}
//         maxWidth={false}
//         submitDisabled={!isDirty}
//       >
//         <Table size="small">
//           <TableHead>
//             <TableRow sx={{ background: "#fafafa" }}>
//               <TableCell sx={{ fontWeight: 600 }}>TERM NAME</TableCell>
//               <TableCell sx={{ fontWeight: 600 }}>NUMBER OF DAYS</TableCell>
//               <TableCell />
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {fields.map((field, index) => (
//               <TableRow
//                 key={field.id}
//                 sx={{
//                   "&:hover": { backgroundColor: "#f5f7ff" },
//                   "&:hover .row-actions": { opacity: 1 },
//                 }}
//               >
//                 <TableCell width="35%">
//                   <Controller
//                     name={`terms.${index}.name`}
//                     control={control}
//                     render={({ field }) => (
//                       <CommonTextField
//                         {...field}
//                         size="small"
//                         fullWidth
//                         error={!!errors?.terms?.[index]?.name}
//                         helperText={errors?.terms?.[index]?.name?.message}
//                       />
//                     )}
//                   />
//                 </TableCell>

//                 <TableCell width="30%">
//                   <Controller
//                     name={`terms.${index}.days`}
//                     control={control}
//                     render={({ field }) => (
//                       <CommonTextField
//                         size="small"
//                         fullWidth
//                         value={field.value ?? ""}
//                         onChange={(e) => {
//                           const val = e.target.value;
//                           field.onChange(val === "" ? "" : +val);
//                         }}
//                         error={!!errors?.terms?.[index]?.days}
//                         helperText={errors?.terms?.[index]?.days?.message}
//                       />
//                     )}
//                   />
//                 </TableCell>

//                 <TableCell align="right">
//                   <Stack
//                     direction="row"
//                     spacing={2}
//                     alignItems="center"
//                     justifyContent="flex-end"
//                     className="row-actions"
//                     sx={{
//                       opacity: watchedTerms[index]?.isDefault ? 1 : 0,
//                       transition: "opacity 0.2s ease",
//                     }}
//                   >
//                     {watchedTerms[index]?.isDefault ? (
//                       <Chip
//                         label="Default"
//                         size="small"
//                         sx={{ background: "#389e0d", color: "#fff" }}
//                       />
//                     ) : editingIndex === index ? (
//                       <>
//                         <IconButton
//                           size="small"
//                           onClick={() => confirmEdit(field)}
//                         >
//                           <CheckIcon fontSize="small" />
//                         </IconButton>
//                         <IconButton size="small" onClick={handleCloseEditIcon}>
//                           <CloseIcon fontSize="small" />
//                         </IconButton>
//                       </>
//                     ) : (
//                       <>
//                         <Typography
//                           sx={{
//                             color: "#1677ff",
//                             cursor: "pointer",
//                             fontWeight: 500,
//                             fontSize: 12,
//                           }}
//                           onClick={() => handleSetDefault(index)}
//                         >
//                           Mark as Default
//                         </Typography>
//                         <IconButton
//                           size="small"
//                           onClick={() => handleEditPaymentTerm(index)}
//                         >
//                           <EditIcon fontSize="small" />
//                         </IconButton>
//                         <IconButton
//                           size="small"
//                           onClick={() => handleDeletePaymentTerm(field)}
//                         >
//                           <DeleteOutlineIcon fontSize="small" />
//                         </IconButton>
//                       </>
//                     )}
//                   </Stack>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//         {typeof errors?.terms?.message === "string" && (
//           <Typography color="error" mt={1}>
//             {errors.terms.message}
//           </Typography>
//         )}
//         <Box mt={2}>
//           <Stack
//             direction="row"
//             spacing={1}
//             alignItems="center"
//             sx={{ color: "#1677ff", cursor: "pointer" }}
//             onClick={() => append({ name: "", days: "", isDefault: false })}
//           >
//             <AddCircleIcon fontSize="small" />
//             <Typography fontWeight={500}>Add New</Typography>
//           </Stack>
//         </Box>
//       </CommonDialog>

//       <CommonDeleteModal
//         open={deleteModalOpen}
//         onClose={() => setDeleteModalOpen(false)}
//         onConfirmDelete={confirmDelete}
//         deleting={deleteMutation.isLoading}
//         itemType={deleteTarget ? `${deleteTarget?.name}`.trim() : "PaymentTerm"}
//         title="PaymentTerm"
//       />
//     </>
//   );
// }

import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CommonTextField } from "../../common/fields";
import {
  useAddPaymentTerm,
  useDeletePaymentTerm,
  usePaymentTerms,
  useUpdatePaymentTerm,
} from "../../../hooks/payment-terms/payment-terms-hooks";
import { useEffect, useState } from "react";
import CommonDeleteModal from "../../common/NDE-DeleteModal";
import CommonDialog from "../../common/NDE-Dialog";

const schema = yup.object().shape({
  terms: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Term name is required"),
      days: yup
        .number()
        .typeError("Enter a valid number")
        .required("Days required")
        .max(366, "Days should not be greater than 366"),
      isDefault: yup.boolean(),
      rowStatus: yup.string(),
    }),
  ),
});

export default function PaymentTermsModal({ open, onClose }) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { terms: [] },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({ control, name: "terms" });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const watchedTerms = watch("terms");

  const { data } = usePaymentTerms();
  const paymentTermsData = data?.data || [];

  const deleteMutation = useDeletePaymentTerm();
  const { mutate: AddPaymentTerm, isLoading: isAdding } = useAddPaymentTerm();
  const { mutate: updateMutation } = useUpdatePaymentTerm();

  const hasNewRow = watchedTerms.some((t) => t.rowStatus === "new");
  const isSaveDisabled = !hasNewRow;

  useEffect(() => {
    if (!open) return;
    if (paymentTermsData.length) {
      reset({
        terms: paymentTermsData.map((t) => ({
          name: t.termName,
          days: t.numberOfDays || 0,
          isDefault: t.isDefault || false,
          termId: t._id || null,
          rowStatus: "saved",
        })),
        paymentTerm: paymentTermsData.find((t) => t.isDefault)?._id || null,
      });
    } else {
      reset({ terms: [], paymentTerm: null });
    }
  }, [paymentTermsData, open, reset]);

  const handleClosePaymentModal = () => {
    if (paymentTermsData.length) {
      reset({
        terms: paymentTermsData.map((t) => ({
          name: t.termName,
          days: t.numberOfDays || 0,
          isDefault: t.isDefault || false,
          termId: t._id || null,
          rowStatus: "saved",
        })),
        paymentTerm: paymentTermsData.find((t) => t.isDefault)?._id || null,
      });
    } else {
      reset({ terms: [], paymentTerm: null });
    }
    onClose();
    setEditingIndex(null);
  };

  const handleAddNew = () => {
    if (hasNewRow) return;
    append({ name: "", days: "", isDefault: false, rowStatus: "new" });
  };

  const handleCancelNewRow = (index) => remove(index);

  const handleEditPaymentTerm = (index) => {
    setEditingIndex(index);
    setEditingData(watchedTerms[index]);
  };

  const handleCloseEditIcon = () => {
    setEditingIndex(null);
    setEditingData(null);
  };

  // const confirmEdit = () => {
  //   if (!editingData) return;
  //   updateMutation(
  //     {
  //       data: { termName: editingData.name, numberOfDays: editingData.days },
  //       id: editingData.termId,
  //     },
  //     {
  //       onSuccess: () => {
  //         setEditingIndex(null);
  //         setEditingData(null);
  //       },
  //       onError: (err) => console.error("Update Failed:", err),
  //     },
  //   );
  // };

  const handleEditSubmit = (index) =>
    handleSubmit((formData) => {
      const term = formData.terms[index];
      if (!term) return;

      updateMutation(
        {
          id: term.termId,
          data: {
            termName: term.name,
            numberOfDays: term.days,
          },
        },
        {
          onSuccess: () => {
            setEditingIndex(null);
            setEditingData(null);
          },
          onError: (err) => console.error("Update Failed:", err),
        },
      );
    })();

  const handleDeletePaymentTerm = (row) => {
    setDeleteTarget(row);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.termId, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setDeleteTarget(null);
      },
    });
  };

  const onSubmit = (data) => {
    const newTerm = data.terms.find((t) => t.rowStatus === "new");
    if (!newTerm) return;

    AddPaymentTerm(
      { termName: newTerm.name, numberOfDays: newTerm.days },
      {
        onSuccess: () => onClose(),
        onError: (err) => console.error("Add Failed:", err),
      },
    );
  };

  const handleSetDefault = (index) => {
    watchedTerms.forEach((_, i) =>
      setValue(`terms.${i}.isDefault`, i === index),
    );
  };

  const renderRowActions = (field, index) => {
    const term = watchedTerms[index];
    if (!term) return null;

    if (term.rowStatus === "new") {
      return (
        <IconButton
          size="small"
          onClick={() => handleCancelNewRow(index)}
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      );
    }

    if (editingIndex === index) {
      return (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <IconButton
            size="small"
            // onClick={confirmEdit}
            onClick={() => handleEditSubmit(index)}
            sx={{ color: "success.main" }}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleCloseEditIcon}
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      );
    }

    if (term.isDefault) {
      return <Chip label="Default" size="small" />;
    }

    return (
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="flex-end"
      >
        <Typography
          sx={{
            color: "#1677ff",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: 12,
          }}
          onClick={() => handleSetDefault(index)}
        >
          Mark as Default
        </Typography>
        <IconButton size="small" onClick={() => handleEditPaymentTerm(index)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          sx={{ color: "error.main" }}
          onClick={() => handleDeletePaymentTerm(field)}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Stack>
    );
  };

  return (
    <>
      <CommonDialog
        open={open}
        onClose={handleClosePaymentModal}
        title="Configure Payment Terms"
        onSubmit={handleSubmit(onSubmit)}
        submitLabel="Save"
        cancelLabel="Cancel"
        submitDisabled={isSaveDisabled}
        loading={isAdding}
        width={600}
        maxWidth={false}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: "#fafafa" }}>
              <TableCell sx={{ fontWeight: 600 }}>TERM NAME</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>NUMBER OF DAYS</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>

          <TableBody>
            {fields.map((field, index) => (
              <TableRow
                key={field.id}
                sx={{ "&:hover": { backgroundColor: "#f5f7ff" } }}
              >
                {/* Term Name */}
                <TableCell width="35%">
                  <Controller
                    name={`terms.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <CommonTextField
                        {...field}
                        size="small"
                        fullWidth
                        disabled={
                          watchedTerms[index]?.rowStatus === "saved" &&
                          editingIndex !== index
                        }
                        error={!!errors?.terms?.[index]?.name}
                        helperText={errors?.terms?.[index]?.name?.message}
                        maxLength={100}
                      />
                    )}
                  />
                </TableCell>

                <TableCell width="30%">
                  <Controller
                    name={`terms.${index}.days`}
                    control={control}
                    render={({ field }) => (
                      <CommonTextField
                        size="small"
                        fullWidth
                        value={field.value ?? ""}
                        disabled={
                          watchedTerms[index]?.rowStatus === "saved" &&
                          editingIndex !== index
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? "" : +val);
                          if (editingIndex === index) {
                            setEditingData((prev) => ({ ...prev, days: val }));
                          }
                        }}
                        error={!!errors?.terms?.[index]?.days}
                        helperText={errors?.terms?.[index]?.days?.message}
                      />
                    )}
                  />
                </TableCell>

                <TableCell align="right">
                  {renderRowActions(field, index)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {typeof errors?.terms?.message === "string" && (
          <Typography color="error" mt={1}>
            {errors.terms.message}
          </Typography>
        )}

        <Box mt={2}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            onClick={handleAddNew}
            sx={{
              color: hasNewRow ? "text.disabled" : "#1677ff",
              cursor: hasNewRow ? "not-allowed" : "pointer",
              width: "fit-content",
            }}
          >
            <AddCircleIcon fontSize="small" />
            <Typography fontWeight={500}>Add New</Typography>
          </Stack>
        </Box>
      </CommonDialog>

      <CommonDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={confirmDelete}
        deleting={deleteMutation.isLoading}
        itemType={deleteTarget ? `${deleteTarget?.name}`.trim() : "PaymentTerm"}
        title="PaymentTerm"
      />
    </>
  );
}
