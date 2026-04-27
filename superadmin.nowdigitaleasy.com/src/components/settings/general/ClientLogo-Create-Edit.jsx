// import { useEffect } from "react";
// import { Box } from "@mui/material";
// import CommonTextField from "../../../components/common/fields/NDE-TextField";
// import CommonFileUpload from "../../../components/common/fields/NDE-FileUpload";
// import CommonDialog from "../../../components/common/NDE-Dialog";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";

// const schema = yup.object().shape({
//   name: yup.string().required("Name is required"),
//   link: yup.string().url("Enter a valid URL").required("Link is required"),
//   text: yup.string().required("Text is required"),
//   file: yup
//     .mixed()
//     .required("File is required")
//     // .test("fileSize", "File size must be less than 10 MB", (value) => {
//     //   if (!value) return false;
//     //   return value.size <= 10 * 1024 * 1024;
//     // }),
//   });

// const ClientLogDetails = ({ open, setOpen, initialData = null, onSubmitAction }) => {
//   const {
//     handleSubmit,
//     control,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: yupResolver(schema),
//     defaultValues: initialData
//       ? {
//           name: initialData.name || "",
//           link: initialData.link || "",
//           text: initialData.text || "",
//           file: initialData.image || null,
//         }
//       : {
//           name: "",
//           link: "",
//           text: "",
//           file: null,
//         },
//   });

//   useEffect(() => {
//     if (initialData) {
//       reset({
//         name: initialData.name || "",
//         link: initialData.link || "",
//         text: initialData.text || "",
//         file: initialData.image || null,
//       });
//     } else {
//       reset({ name: "", link: "", text: "", file: null });
//     }
//   }, [initialData, open, reset]);

//   const handleClose = () => {
//     setOpen(false);
//     reset();
//   };

//   const onSubmit = (data) => {
//     onSubmitAction(data);
//     handleClose();
//   };

//   return (
//     <Box>
//       <CommonDialog
//         open={open}
//         onClose={handleClose}
//         title={initialData ? "Edit Client Logo" : "Create Client Logo"}
//         onSubmit={handleSubmit(onSubmit)}
//         submitLabel={initialData ? "Update" : "Submit"}
//         cancelLabel="Cancel"
//       >
//         <Box>
//           {/* Text fields */}
//           {["name", "link", "text"].map((fieldName) => (
//             <Controller
//               key={fieldName}
//               name={fieldName}
//               control={control}
//               render={({ field }) => (
//                 <CommonTextField
//                   label={fieldName
//                     .replace(/([A-Z])/g, " $1")
//                     .replace(/^./, (str) => str.toUpperCase())}
//                   {...field}
//                   error={!!errors[fieldName]}
//                   helperText={errors[fieldName]?.message}
//                   mandatory
//                   sx={{ mb: 2 }}
//                 />
//               )}
//             />
//           ))}

//           {/* File upload */}
//           <Controller
//             name="file"
//             control={control}
//             render={({ field }) => (
//               <CommonFileUpload
//                 label="Upload File"
//                 {...field}
//                 value={field.value}
//                 onChange={(file) => field.onChange(file)}
//                 existingFile={initialData?.image}
//                 error={!!errors.file}
//                 helperText={errors.file?.message}
//                 mandatory
//                 sx={{ mb: 2 }}
//               />
//             )}
//           />
//         </Box>
//       </CommonDialog>
//     </Box>
//   );
// };


// export default ClientLogDetails;



import { useEffect } from "react";
import { Box } from "@mui/material";
import CommonTextField from "../../../components/common/fields/NDE-TextField";
import CommonDialog from "../../../components/common/NDE-Dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),

  link: yup.string().url("Enter a valid URL").required("Link is required"),
  text: yup.string().max(500, "Name must be at most 500 characters").required("Text is required"),
});

const ClientLogDetails = ({ open, setOpen, initialData = null, onSubmitAction }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData
      ? {
        name: initialData.name || "",
        link: initialData.link || "",
        text: initialData.text || "",
      }
      : {
        name: "",
        link: "",
        text: "",
      },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        link: initialData.link || "",
        text: initialData.text || "",
      });
    } else {
      reset({ name: "", link: "", text: "" });
    }
  }, [initialData, open, reset]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    onSubmitAction(data);
  };

  return (
    <Box>
      <CommonDialog
        open={open}
        onClose={handleClose}
        title={initialData ? "Edit Client Logo" : "Create Client Logo"}
        onSubmit={handleSubmit(onSubmit)}
        submitLabel={initialData ? "Update" : "Submit"}
        cancelLabel="Cancel"
        submitDisabled={!isDirty}
      >
        <Box>
          {/* Text fields */}
          {["name", "link", "text"].map((fieldName) => (
            <Controller
              key={fieldName}
              name={fieldName}
              control={control}
              render={({ field }) => (
                <CommonTextField
                  label={fieldName
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  {...field}
                  error={!!errors[fieldName]}
                  helperText={errors[fieldName]?.message}
                  mandatory
                  sx={{ mb: 2 }}
                />
              )}
            />
          ))}
        </Box>
      </CommonDialog>
    </Box>
  );
};

export default ClientLogDetails;
