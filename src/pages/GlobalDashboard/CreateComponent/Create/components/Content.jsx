import { Box, Button, Slider, Typography, useTheme } from "@mui/material";
import { useCallback } from "react";
import CommonTextField from "../../../../../components/common/fields/NDE-TextField";
import ChartsInputs from "./ChartsInputs";
import { CHARTS, KPI, TARGET_METERS } from "./data/configureData";
import KpiInputs from "./KpiInputs";
import TargetInputs from "./TargetInputs";

function valuetext(value) {
  return `${value}%`;
}
const FieldRow = ({
  children,
  label,
  required,
  maxWidth = 300,
  labelWidth = "180px",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "flex-start",
        justifyContent: "center",
        minWidth: 0,
        mb: 1,
      }}
    >
      <Box
        sx={{
          width: labelWidth,
          flexShrink: 1,
          pt: 2.4,
          display: "flex",
          gap: 0.5,
          justifyContent: "flex-end",
        }}
      >
        <Typography
          sx={(theme) => ({
            fontSize: "0.8rem",
            fontWeight: 450,
            color: theme.palette.text.primary,
            textAlign: "right",
          })}
        >
          {label}
        </Typography>
        {required && (
          <Typography
            sx={(theme) => ({
              fontSize: "0.9rem",
              fontWeight: 600,
              color: theme.palette.error.main,
              textAlign: "right",
            })}
          >
            *
          </Typography>
        )}
      </Box>
      {/* Input Column */}
      <Box sx={{ flex: 1, minWidth: 0, maxWidth }}>{children}</Box>{" "}
    </Box>
  );
};

export default function Content({
  componentCreateData,
  setComponentCreateData,
  componentType,
}) {
  const theme = useTheme();

  const selectedKpi = KPI?.find((i) => i?.key === componentCreateData?.key);
  const selectedTargetMeter = TARGET_METERS?.find(
    (i) => i?.key === componentCreateData?.key,
  );
  const selectedChart = CHARTS?.find(
    (i) => i?.key === componentCreateData?.key,
  );

  // slider
  const handleChange = useCallback(
    (event, newValue, activeThumb) => {
      if (!Array.isArray(newValue)) return;

      const minDistance = 1;

      setComponentCreateData((prev) => {
        const first = prev?.thresholds?.firstPercent ?? 33;
        const second = prev?.thresholds?.secondPercent ?? 66;

        return {
          ...prev,
          thresholds:
            activeThumb === 0
              ? {
                  firstPercent: Math.min(newValue[0], second - minDistance),
                  secondPercent: second,
                }
              : {
                  firstPercent: first,
                  secondPercent: Math.max(newValue[1], first + minDistance),
                },
        };
      });
    },
    [setComponentCreateData], // stable reference only
  );
  const first = componentCreateData?.thresholds?.firstPercent ?? 33;
  const second = componentCreateData?.thresholds?.secondPercent ?? 66;

  const railGradient = `linear-gradient(
  to right,
  ${theme.palette.error.main}   0%,
  ${theme.palette.error.main}   ${first}%,
  ${theme.palette.warning.main} ${first}%,
  ${theme.palette.warning.main} ${second}%,
  ${theme.palette.success.main} ${second}%,
  ${theme.palette.success.main} 100%
)`;

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        height: "100%",
        width: "100%",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "100%",
          width: "100%",

          // flex: 1,
          // height: "100%",
          flexDirection: {
            md: "row",
            sm: "column",
          },
          overflowY: "auto",
        }}
      >
        {/* left */}
        <Box
          sx={{
            width: { md: "38%", sm: "100%", lg: "35%" },
            height: "100%",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: "center",
            borderRight: {
              sm: "none",
              md: `1px solid ${theme.palette.divider}`,
            },
            borderBottom: {
              sm: `1px solid ${theme.palette.divider}`,
              md: "none",
            },
          }}
        >
          {componentType === "kpi" &&
            selectedKpi?.component &&
            (() => {
              const Component = selectedKpi.component;

              return <Component {...selectedKpi.props} width={"100%"} />;
            })()}

          {componentType === "target" &&
            selectedTargetMeter?.component &&
            (() => {
              const Component = selectedTargetMeter.component;

              return <Component {...selectedTargetMeter?.props} />;
            })()}

          {componentType === "chart" &&
            selectedChart?.component &&
            (() => {
              const Component = selectedChart.component;

              return <Component {...selectedChart?.props} />;
            })()}

          {componentCreateData?.key === "traffic_lights" && (
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <Slider
                value={[
                  componentCreateData?.thresholds?.firstPercent,
                  componentCreateData?.thresholds?.secondPercent,
                ]}
                onChange={handleChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v}`}
                disableSwap
                min={0}
                max={100}
                getAriaValueText={valuetext}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  padding: "20px 0",
                  transition: "all 0.2s ease",

                  // Rail (full background track)
                  "& .MuiSlider-rail": {
                    background: railGradient,
                    opacity: 1,
                    height: 10,
                    borderRadius: 6,
                  },

                  // Active track between thumbs (we hide it and let the rail show through)
                  "& .MuiSlider-track": {
                    display: "none",
                  },

                  // Thumb styles
                  "& .MuiSlider-thumb": {
                    width: 20,
                    height: 20,
                    bgcolor: "#fff",
                    border: `1px solid ${theme.palette.divider} `,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                    "&:hover, &.Mui-active": {
                      boxShadow: "0 0 0 4px rgba(100,116,139,0.16)",
                    },
                  },

                  // Value label (tooltip above thumb)
                  "& .MuiSlider-valueLabel": {
                    bgcolor: "#1e293b",
                    color: "#fff",
                    borderRadius: "8px",
                    transition: "all 0.2s ease",

                    fontSize: "0.85rem",
                    fontWeight: 700,
                    px: 1.5,
                    py: 0.5,
                    "&::before": {
                      // Arrow pointer
                      borderTopColor: "#1e293b",
                    },
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontSize: "13px", color: "text.primary" }}>
                  0%
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "text.primary" }}>
                  100%
                </Typography>
              </Box>
            </Box>
          )}
          {!componentCreateData?.id ? (
            <Button
              variant="text"
              onClick={() =>
                setComponentCreateData({ key: "", name: "", module: "" })
              }
            >
              Change Styles
            </Button>
          ) : (
            <Typography variant="body1">Demo Card</Typography>
          )}
        </Box>
        {/* right */}
        <Box
          sx={{
            width: { md: "60%", sm: "100%", lg: "75%" },
            p: 2,
            // overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",

              flexDirection: "column",
              overflowY: "auto",
              height: "100%",
            }}
          >
            <Typography
              sx={{ fontSize: "18px", fontWeight: "450" }}
              color="text.primary"
            >
              Component
            </Typography>

            <FieldRow
              label={"Component Name"}
              maxWidth={"100%"}
              required={true}
            >
              <CommonTextField
                sx={{
                  bgcolor: theme.palette.background.default,
                  borderRadius: 2,
                  height: "40px",
                }}
                value={componentCreateData?.name}
                onChange={(e) =>
                  setComponentCreateData({
                    ...componentCreateData,
                    name: e.target.value,
                  })
                }
                placeholder={"Enter Component Name"}
                minWidth={"300px"}
                // helperText={"error"}
                // error={true}
                slotProps={{
                  htmlInput: {
                    maxLength: 30,
                    min: 4,
                  },
                }}
              />
            </FieldRow>

            {componentType === "kpi" && (
              <KpiInputs
                FieldRow={FieldRow}
                componentCreateData={componentCreateData}
                setComponentCreateData={setComponentCreateData}
              />
            )}
            {componentType === "chart" && (
              <ChartsInputs
                FieldRow={FieldRow}
                componentCreateData={componentCreateData}
                setComponentCreateData={setComponentCreateData}
              />
            )}
            {componentType === "target" && (
              <TargetInputs
                FieldRow={FieldRow}
                componentCreateData={componentCreateData}
                setComponentCreateData={setComponentCreateData}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
