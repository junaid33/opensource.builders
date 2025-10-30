"use client";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";

const chartConfig = {
  compatible: {
    label: "Compatible",
    color: "#10B981",
  },
  notCompatible: {
    label: "Not Compatible",
    color: "#EF4444",
  },
} satisfies ChartConfig;

interface DonutChartProps {
  percentage: number;
  compatible: boolean;
  isAnimationActive?: boolean;
}

export function DonutChart({ percentage, compatible, isAnimationActive = true }: DonutChartProps) {
  const backgroundData = [{ name: "background", value: 100, fill: "#E5E7EB" }];
  const fillColor = compatible ? "#10B981" : "#EF4444"; // Green for compatible, red for not compatible
  const foregroundData = [
    {
      name: "used",
      value: compatible ? 100 : Math.max(0, Math.min(100, Number(percentage))),
      fill: fillColor,
    },
    {
      name: "empty",
      value: compatible ? 0 : 100 - Math.max(0, Math.min(100, Number(percentage))),
      fill: "transparent",
    },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="w-6 h-6 flex-shrink-0 aspect-square"
    >
      <PieChart>
        <Pie
          data={backgroundData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={6}
          outerRadius={10}
          isAnimationActive={false}
        >
          {backgroundData.map((entry, index) => (
            <Cell key={`bg-cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Pie
          data={foregroundData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={6}
          outerRadius={10}
          startAngle={90}
          endAngle={-270}
          isAnimationActive={isAnimationActive}
        >
          {foregroundData.map((entry, index) => (
            <Cell key={`fg-cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}