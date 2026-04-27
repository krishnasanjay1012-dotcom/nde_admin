import { Box, TextField, styled } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { useUpdateAllCounters } from "../../../hooks/settings/transaction-series-hooks";
import CommonButton from "../../../components/common/NDE-Button";
import ReusableTable from "../../../components/common/Table/ReusableTable";

const schema = yup.object().shape({
  series: yup.array().of(
    yup.object().shape({
      nextNumber: yup
        .string()
        .required("Starting number is required")
        .matches(/^\d+$/, "Only numbers are allowed"),
    }),
  ),
});

const EditableTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    transition: "all 0.2s ease",

    "& fieldset": {
      borderColor: "transparent",
    },

    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },

    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },

    "&.Mui-error fieldset": {
      borderColor: theme.palette.error.main,
    },
  },
}));

export default function SeriesSettings({
  editMode,
  onClose,
  counterList,
  isLoading,
}) {
  const formattedSeries = useMemo(
    () =>
      counterList.map((item) => ({
        module: item?.entityLabel,
        prefixString: item?.prefixString || "",
        nextNumber: item?.nextNumber || "",
        _id: item?._id,
      })),
    [counterList],
  );

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { dirtyFields, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { series: [] },
  });

  const watchedSeries = watch("series");

  /* 🔥 FIX: update form when API refetches */
  useEffect(() => {
    if (formattedSeries?.length) {
      reset({ series: formattedSeries });
    }
  }, [formattedSeries, reset]);

  const onError = (errors) => {
    const firstErrorIndex = errors?.series?.findIndex(Boolean);

    if (firstErrorIndex !== -1) {
      const moduleName = watchedSeries[firstErrorIndex]?.module;
      toast.error(`${moduleName} has invalid starting number`);
    }
  };

  const { mutateAsync, isPending } = useUpdateAllCounters();

  const onSubmit = async (data) => {
    const changedRows = data?.series
      ?.map((row, index) => {
        if (dirtyFields?.series?.[index]) {
          const modified = { ...row };
          delete modified.module;
          return modified;
        }
        return null;
      })
      .filter(Boolean);

    try {
      await mutateAsync({
        counters: changedRows,
      });

      onClose();
    } catch (err) {
      console.warn(err);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "MODULE",
        accessorKey: "module",
      },
      {
        header: "PREFIX",
        accessorKey: "prefixString",
        cell: ({ row }) => {
          const index = row.index;

          return editMode ? (
            <Controller
              name={`series.${index}.prefixString`}
              control={control}
              render={({ field }) => (
                <EditableTextField {...field} size="small" fullWidth />
              )}
            />
          ) : (
            row.original.prefixString
          );
        },
      },
      {
        header: "STARTING NUMBER *",
        accessorKey: "nextNumber",
        cell: ({ row }) => {
          const index = row.index;

          return editMode ? (
            <Controller
              name={`series.${index}.nextNumber`}
              control={control}
              render={({ field }) => (
                <EditableTextField {...field} size="small" fullWidth />
              )}
            />
          ) : (
            row.original.nextNumber
          );
        },
      },
      {
        header: "PREVIEW",
        cell: ({ row }) => {
          const index = row.index;

          return (
            <>
              {watchedSeries[index]?.prefixString}
              {watchedSeries[index]?.nextNumber}
            </>
          );
        },
      },
    ],
    [editMode, control, watchedSeries],
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit, onError)}
     
    >
      <ReusableTable
        columns={columns}
        data={watchedSeries || []}
        isLoading={isLoading}
        maxHeight="calc(100vh - 230px)"
      />

      {editMode && (
        <Box mt={3} display="flex" gap={2} mx={2}>
          <CommonButton
            label={"Submit"}
            variant="contained"
            disabled={isPending || !isDirty}
            onClick={handleSubmit(onSubmit)}
            startIcon={false}
            
          />

          <CommonButton
            label={"Cancel"}
            variant="outlined"
            onClick={() => {
              reset({ series: formattedSeries });
              onClose();
            }}
            startIcon={false}
          
          />
        </Box>
      )}
    </Box>
  );
}