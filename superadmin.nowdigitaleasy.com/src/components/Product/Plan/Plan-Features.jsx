import { useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Collapse,
  Chip,
} from "@mui/material";
import { Controller } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CommonCheckbox, CommonTextField } from "../../common/fields";
import CommonButton from "../../common/NDE-Button";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

export default function PlanFeaturesForm({
  control,
  move,
  append,
  fields,
  remove,
  watch,
  setValue,
}) {
  useEffect(() => {
    if (fields.length === 0) {
      append({
        heading: "",
        isExpanded: true,
        features: [
          {
            name: "",
            tool_tip_name: "",
            description: "",
            add_new_tag: false,
          },
        ],
      });
    }
  }, [fields, append]);

  const onDragEnd = (result) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === "HEADING") {
      move(source.index, destination.index);
      return;
    }

    const sourceHeadingIndex = parseInt(source.droppableId.split("-")[1]);
    const destHeadingIndex = parseInt(destination.droppableId.split("-")[1]);

    const sourceFeatures =
      watch(`plan_feature.${sourceHeadingIndex}.features`) || [];
    const destFeatures =
      watch(`plan_feature.${destHeadingIndex}.features`) || [];

    const movedItem = sourceFeatures[source.index];

    const updatedSource = Array.from(sourceFeatures);
    updatedSource.splice(source.index, 1);

    const updatedDest = Array.from(destFeatures);
    updatedDest.splice(destination.index, 0, movedItem);

    setValue(
      `plan_feature.${sourceHeadingIndex}.features`,
      updatedSource
    );
    setValue(
      `plan_feature.${destHeadingIndex}.features`,
      updatedDest
    );
  };

  const addNewHeading = () => {
    append({
      heading: "",
      isExpanded: true,
      features: [
        {
          name: "",
          tool_tip_name: "",
          description: "",
          add_new_tag: false,
        },
      ],
    });
  };

  const addFeatureToHeading = (headingIndex) => {
    const current =
      watch(`plan_feature.${headingIndex}.features`) || [];
    setValue(`plan_feature.${headingIndex}.features`, [
      ...current,
      {
        name: "",
        tool_tip_name: "",
        description: "",
        add_new_tag: false,
      },
    ]);
  };

  const removeFeatureFromHeading = (headingIndex, featureIndex) => {
    const current =
      watch(`plan_feature.${headingIndex}.features`) || [];
    if (current.length > 1) {
      setValue(
        `plan_feature.${headingIndex}.features`,
        current.filter((_, i) => i !== featureIndex)
      );
    }
  };

  const removeHeading = (headingIndex) => {
    if (fields.length > 1) remove(headingIndex);
  };

  const toggleHeadingExpanded = (headingIndex) => {
    const expanded =
      watch(`plan_feature.${headingIndex}.isExpanded`) ?? true;
    setValue(
      `plan_feature.${headingIndex}.isExpanded`,
      !expanded
    );
  };

  return (
    <Box mt={1}>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Plan Features
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="headings" type="HEADING">
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {fields.map((headingItem, headingIndex) => {
                const features =
                  watch(`plan_feature.${headingIndex}.features`) || [];
                const isExpanded =
                  watch(`plan_feature.${headingIndex}.isExpanded`) ?? true;

                return (
                  <Draggable
                    key={headingItem.id}
                    draggableId={headingItem.id}
                    index={headingIndex}
                  >
                    {(provided) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        elevation={0}
                        sx={{
                          mb: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: "6px",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            // bgcolor: "#f9f9fb",
                          }}
                        >
                          <Box
                            {...provided.dragHandleProps}
                            sx={{ mr: 1, cursor: "grab", ml: 2 }}
                          >
                            <Box
                            // sx={{
                            //   width: 20,
                            //   height: 20,
                            //   border: "1px dashed",
                            //   borderColor: "text.secondary",
                            //   borderRadius: "4px",
                            //   display: "flex",
                            //   alignItems: "center",
                            //   justifyContent: "center",
                            // }}
                            >
                              <DragIndicatorIcon />
                            </Box>
                          </Box>

                          <IconButton
                            size="small"
                            onClick={() =>
                              toggleHeadingExpanded(headingIndex)
                            }
                          >
                            {isExpanded ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>

                          <Controller
                            control={control}
                            name={`plan_feature.${headingIndex}.heading`}
                            render={({ field }) => (
                              <CommonTextField
                                {...field}
                                placeholder="Section Heading"
                                sx={{ flex: 1 }}
                                mt={1} mb={1}
                              />
                            )}
                          />

                          <Chip
                            label={`${features.length} feature${features.length !== 1 ? "s" : ""
                              }`}
                            size="small"
                            sx={{ mx: 2 }}
                          />

                          <IconButton
                            size="small"
                            onClick={() => removeHeading(headingIndex)}
                            disabled={fields.length === 1}
                            color="error"
                          >
                            <CloseIcon fontSize="small" sx={{ mr: 1 }} />
                          </IconButton>
                        </Box>

                        <Collapse in={isExpanded}>
                          <TableContainer>
                            <Table size="small">
                              <TableHead sx={{ bgcolor: "background.default" }}>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 500, width: "30%" }}>Feature</TableCell>
                                  <TableCell sx={{ fontWeight: 500, width: "35%" }}>Description</TableCell>
                                  <TableCell sx={{ fontWeight: 500, width: "25%" }}>Tooltip</TableCell>
                                  <TableCell sx={{ fontWeight: 500, width: "5%" }}>Tag</TableCell>
                                  <TableCell sx={{ width: "1%" }} />
                                </TableRow>
                              </TableHead>

                              <Droppable
                                droppableId={`features-${headingIndex}`}
                                type="FEATURE"
                              >
                                {(provided) => (
                                  <TableBody
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                  >
                                    {features.map(
                                      (feature, featureIndex) => (
                                        <Draggable
                                          key={`feature-${headingIndex}-${featureIndex}`}
                                          draggableId={`feature-${headingIndex}-${featureIndex}`}
                                          index={featureIndex}
                                        >
                                          {(provided) => (
                                            <TableRow
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                            >
                                              <TableCell>
                                                <Controller
                                                  control={control}
                                                  name={`plan_feature.${headingIndex}.features.${featureIndex}.name`}
                                                  render={({ field }) => (
                                                    <CommonTextField
                                                      {...field}
                                                      placeholder="Feature name"
                                                      sx={{ mb: 0, mt: 0, width: "100%" }}
                                                    />
                                                  )}
                                                />
                                              </TableCell>

                                              <TableCell>
                                                <Controller
                                                  control={control}
                                                  name={`plan_feature.${headingIndex}.features.${featureIndex}.description`}
                                                  render={({ field }) => (
                                                    <CommonTextField
                                                      {...field}
                                                      placeholder="Description"
                                                      sx={{ mb: 0, mt: 0, width: "100%" }}
                                                    />
                                                  )}
                                                />
                                              </TableCell>

                                              <TableCell>
                                                <Controller
                                                  control={control}
                                                  name={`plan_feature.${headingIndex}.features.${featureIndex}.tool_tip_name`}
                                                  render={({ field }) => (
                                                    <CommonTextField
                                                      {...field}
                                                      placeholder="Tooltip"
                                                      sx={{ mb: 0, mt: 0, width: "100%" }}
                                                    />
                                                  )}
                                                />
                                              </TableCell>

                                              <TableCell>
                                                <Controller
                                                  control={control}
                                                  name={`plan_feature.${headingIndex}.features.${featureIndex}.add_new_tag`}
                                                  render={({ field }) => (
                                                    <CommonCheckbox
                                                      checked={
                                                        field.value || false
                                                      }
                                                      onChange={(e) =>
                                                        field.onChange(
                                                          e.target.checked
                                                        )
                                                      }
                                                    />
                                                  )}
                                                />
                                              </TableCell>

                                              <TableCell>
                                                <IconButton
                                                  size="small"
                                                  onClick={() =>
                                                    removeFeatureFromHeading(
                                                      headingIndex,
                                                      featureIndex
                                                    )
                                                  }
                                                  disabled={
                                                    features.length === 1
                                                  }
                                                  color="error"
                                                >
                                                  <CloseIcon fontSize="small"
                                                    sx={{
                                                      color:
                                                        features.length === 1
                                                          ? "grey.400"
                                                          : "error.main",
                                                    }} />
                                                </IconButton>
                                              </TableCell>
                                            </TableRow>
                                          )}
                                        </Draggable>
                                      )
                                    )}
                                    {provided.placeholder}
                                  </TableBody>
                                )}
                              </Droppable>
                            </Table>
                          </TableContainer>

                          <Box
                            sx={{
                              p: 1,
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <CommonButton
                              type="button"
                              label="Add Feature"
                              variant="text"
                              size="small"
                              startIcon={<AddIcon sx={{ color: "primary.main" }} />}
                              sx={{
                                textTransform: "none",
                                "&:hover": {
                                  bgcolor: "transparent",
                                  textDecoration: "underline",
                                },
                              }}
                              onClick={() => addFeatureToHeading(headingIndex)}
                            />
                          </Box>
                        </Collapse>
                      </Paper>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <Box mt={2}>
        <CommonButton
          type="button"
          label="Add New Section"
          variant="outlined"
          startIcon={<AddIcon sx={{ color: "primary.main" }} />}
          onClick={addNewHeading}
          sx={{
            textTransform: "none",
            borderStyle: "dashed",
            "&:hover": {
              borderStyle: "dashed",
              bgcolor: "action.hover",
            },
          }}
        />
      </Box>
    </Box>
  );
}
