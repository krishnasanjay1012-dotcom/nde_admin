import AreaChartComp from "../../../../Components/Chart/AreaChartComp";
import BarChartComp from "../../../../Components/Chart/BarChartComp";
import ColumnChartComp from "../../../../Components/Chart/ColumnChartComp";
import DonutChartComp from "../../../../Components/Chart/DonutChartComp";
import HeatMapComp from "../../../../Components/Chart/HeatMapComp";
import LineChartComp from "../../../../Components/Chart/LineChartComp";
import PieChartComp from "../../../../Components/Chart/PieChartComp";
import TableChartComp from "../../../../Components/Chart/TableChartComp";
import Basics from "../../../../Components/KPI/Cards/Basics";
import GrowthIndex from "../../../../Components/KPI/Cards/GrowthIndex";
import Rankings from "../../../../Components/KPI/Cards/Rankings";
import ScoreCard from "../../../../Components/KPI/Cards/Scorecard";
import Standard from "../../../../Components/KPI/Cards/Standard";
import DialGauge from "../../../../Components/TargetMeter/DialGauge";
import SingleBar from "../../../../Components/TargetMeter/SingleBar";
import TrafficLights from "../../../../Components/TargetMeter/TrafficLights";

// chartColors.js
// export const chartPalette = {
//   colors: ["#7C3AED", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"],
//   sequential: ["#EDE9FE", "#C4B5FD", "#A78BFA", "#7C3AED", "#5B21B6"],
//   heatmap: ["#EDE9FE", "#7C3AED", "#4C1D95"],
// };

export const KPI = [
  {
    key: "kpi_basic",
    component: Basics,
    props: {
      data: {
        metric: {
          label: "Basic",
        },
        formattedValue: "₹1,25,000",
        currentValue: 125000,
        name: "Revenue",
      },
    },
  },
  {
    key: "kpi_growth",
    component: GrowthIndex,
    props: {
      data: {
        name: "Revenue This Month",
        metric: {
          label: "Growth Index",
        },
        growth: 13.11,
        currentValue: 391,
        previousValue: 450,
        comparisonLabel: "Last Month",
        comparison: {
          objective: "positive",
        },
      },
    },
  },
  {
    key: "kpi_standard",
    component: Standard,
    props: {
      data: {
        name: "Revenue This Month",
        growth: 13.11,
        currentValue: 600,
        previousValue: 450,
        comparisonLabel: "Last Month",
        comparison: {
          objective: "positive",
        },
        metric: {
          label: "Standard",
        },
      },
    },
  },
  {
    key: "kpi_scorecard",
    component: ScoreCard,
    props: {
      data: {
        items: [
          {
            label: "Communications",
            currentValue: 36,
            growth: 14,
          },
          {
            label: "Advertisement",
            currentValue: 35,
            growth: -10,
          },
          { label: "Cold Call", currentValue: 13, growth: 13 },
          {
            label: "Employee Referral",
            currentValue: 4,
            growth: 19.7,
          },
          {
            label: "External Referral",
            currentValue: 2,
            growth: 20.76,
          },
        ],
        comparison: {
          objective: "negative",
        },
        metric: {
          label: "Score Card",
        },
        name: "Top Industries - Deals",
        comparisonLabel: "Last year",
        comparisonPositive: true,
      },
    },
  },
  {
    key: "kpi_rankings",
    component: Rankings,
    props: {
      data: {
        metric: {
          label: "Rankings",
        },
        name: "Top 5 Deal owners",
        items: [
          { label: "Christopher", value: 1280 },
          { label: "Jason Bell", value: 1010 },
          { label: "Michael Gold", value: 777 },
          { label: "Michael Gold", value: 777 },
          { label: "Michael Gold", value: 777 },
          { label: "Michael Gold", value: 777 },
          { label: "Steve Wright", value: 728 },

          { label: "David Maxwell", value: 696 },
          { label: "Henry John", value: 533 },
        ],
      },
    },
  },
];

export const CHARTS = [
  {
    key: "column",
    component: ColumnChartComp,
    props: {
      data: {
        measure: {
          label: "Column Chart",
        },
        name: "Top 5 Deal owners",
        items: [
          { label: "Christopher", value: 1280 },
          { label: "Jason", value: 1010 },
          { label: "Michael", value: 777 },
        ],
      },
    },
  },
  {
    key: "area",
    component: AreaChartComp,
    props: {
      data: {
        measure: {
          label: "Area Chart",
        },
        name: "Top 5 Deal owners",
        items: [
          { x1: "Christopher", x2: "Dec 12", value: 1280 },
          { x1: "Bala", x2: "Dec 15", value: 180 },
          { x1: "Jason", x2: "Dec 12", value: 700 },
          { x1: "Sundar", x2: "Dec 10", value: 500 },
          { x1: "Michael", x2: "Dec 15", value: 307 },
          { x1: "Michael", x2: "Dec 12", value: 1007 },
          { x1: "Michael", x2: "Dec 10", value: 507 },
          { x1: "Boopathi", x2: "Dec 12", value: 907 },
        ],
      },
    },
  },
  {
    key: "bar",
    component: BarChartComp,
    props: {
      data: {
        measure: {
          label: "Bar Chart",
        },
        name: "Top 5 Deal owners",
        items: [
          { label: "Michael", value: 777 },

          { label: "Jason", value: 1010 },
          { label: "Christopher", value: 500 },
        ],
      },
    },
  },
  {
    key: "line",
    component: LineChartComp,
    props: {
      data: {
        measure: {
          label: "Line Chart",
        },
        name: "Top 5 Deal owners",
        items: [
          { label: "Michael", value: 777 },

          { label: "Jason", value: 1010 },
          { label: "Christopher", value: 500 },
        ],
      },
    },
  },
  {
    key: "table",
    component: TableChartComp,
    props: {
      data: {
        measure: {
          label: "Table Chart",
        },
        name: "Top 5 Deal owners",
        items: [
          { label: "Michael", value: 777 },

          { label: "Jason", value: 1010 },
          { label: "Christopher", value: 500 },
        ],
      },
    },
  },
  {
    key: "pie",
    component: PieChartComp,
    props: {
      data: {
        measure: {
          label: "Pie Chart",
        },
        name: "Top 5 Deal owners",
        items: [
          { label: "Michael", value: 777 },

          { label: "Jason", value: 1010 },
          { label: "Christopher", value: 500 },
        ],
      },
    },
  },
  {
    key: "donut",
    component: DonutChartComp,
    props: {
      data: {
        measure: {
          label: "Donut Chart",
        },
        name: "Top 5 Deal owners",
        items: [
          { label: "Michael", value: 777 },

          { label: "Jason", value: 1010 },
          { label: "Christopher", value: 500 },
        ],
      },
    },
  },

  {
    key: "heatmap",
    component: HeatMapComp,
    props: {
      data: {
        measure: {
          label: "Heat Chart",
        },
        name: "Top 5 Deal owners",
        items: [
          { x: "Pavithran", y: "Apr", value: 45 },
          { x: "Pavithran", y: "Mar", value: 45 },
          { x: "Pavithran", y: "Jun", value: 45 },

          { x: "Boopathi", y: "Mar", value: 12 },
          { x: "Boopathi", y: "Jun", value: 12 },
          { x: "Sundar", y: "Jan", value: 12 },
          { x: "Boopathi", y: "Jun", value: 12 },
        ],
      },
    },
  },
];

export const TARGET_METERS = [
  {
    key: "dial_gauge",
    component: DialGauge,
    props: {
      data: {
        metric: {
          label: "Dial Gauge",
        },
        name: "Top 5 Deal owners",
        targetValue: 40,
        currentValue: 30,
      },
    },
  },
  {
    key: "traffic_lights",
    component: TrafficLights,
    props: {
      data: {
        metric: {
          label: "Traffic Lights",
        },
        name: "Top 5 Deal owners",
        targetValue: 80,
        currentValue: 25,
        firstPercent: 20,
        secondPercent: 70,
      },
    },
  },
  {
    key: "single_bar",
    component: SingleBar,
    props: {
      data: {
        metric: {
          label: "Single Bar",
        },
        name: "Top 5 Deal owners",
        targetValue: 80,
        currentValue: 30,
      },
    },
  },
];
