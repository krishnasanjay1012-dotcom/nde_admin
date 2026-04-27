import React from "react";
import KpiSelectList from "./components/KpiSelectList";
import ChartSelectList from "./components/ChartSelectList";
import TargetMeterList from "./components/TargetMeterList";
import Content from "./components/Content";

export default function CreateComponent({
  setComponentCreateData,
  componentCreateData,
  componentType,
  handleDrawer,
}) {
  // Cards selection
  if (componentType === "kpi" && !componentCreateData?.key) {
    return <KpiSelectList setComponentCreateData={setComponentCreateData} />;
  }
  if (componentType === "chart" && !componentCreateData?.key) {
    return <ChartSelectList setComponentCreateData={setComponentCreateData} />;
  }
  if (componentType === "target" && !componentCreateData?.key) {
    return <TargetMeterList setComponentCreateData={setComponentCreateData} />;
  }

  // after Card selection
  return (
    <Content
      handleDrawer={handleDrawer}
      componentType={componentType}
      setComponentCreateData={setComponentCreateData}
      componentCreateData={componentCreateData}
    />
  );
}
