import { useMemo } from "react";
import PropTypes from "prop-types";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const CHART_COLOR = "hsl(var(--chart-1))";
export function PortfolioValueHistoryChart({ data: rawData, yAxisLabel }) {
  const { processedData, chartConfig } = useMemo(() => {
    if (!rawData || rawData.length === 0) {
      return {
        processedData: [],
        chartConfig: {},
      };
    }

    const dataPoints = rawData
      .map(item => ({
        date: new Date(item.timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
          year: new Date(item.timestamp).getUTCFullYear() !== new Date().getUTCFullYear() ? "numeric" : undefined,
        }),
        value: item.value,
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

    const dynamicChartConfig = {
      value: {
        label: yAxisLabel || "Value",
        color: CHART_COLOR,
      },
    };

    return {
      processedData: dataPoints,
      chartConfig: dynamicChartConfig,
    };
  }, [rawData, yAxisLabel]);

  const chartData = processedData;

  if (!rawData || rawData.length === 0) {
    return (
      <Card className="shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col w-full h-full items-center justify-center">
        <CardHeader>
          <CardTitle>Portfolio Value History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 dark:text-slate-400">No data available to display chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col w-full h-full`}>
      <CardHeader>
        <div>
          <CardTitle>Portfolio Value History</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ChartContainer 
          config={chartConfig} 
          className={`h-full w-full`}
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              dataKey="value"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              domain={['auto', 'auto']}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', offset: -5, style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))' } } : undefined}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line
              dataKey="value"
              type="natural"
              stroke={chartConfig.value?.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

PortfolioValueHistoryChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ),
  selectedPriceRange: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string,
};
