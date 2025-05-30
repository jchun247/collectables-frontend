import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function MarketPriceHistoryChart({ data: rawData, selectedPriceRange }) {
  const [selectedFinishes, setSelectedFinishes] = useState([]);

  const { processedData, chartConfig, uniqueFinishes } = useMemo(() => {
    if (!rawData || rawData.length === 0) {
      return {
        processedData: [],
        chartConfig: {},
        uniqueFinishes: [],
      };
    }

    const filteredDataByRange = rawData.filter(item => {
      const itemDate = new Date(item.timestamp);
      const now = new Date();
      let startDate;

      switch (selectedPriceRange) {
        case "3_months":
          startDate = new Date(now.setMonth(now.getMonth() - 3));
          break;
        case "6_months":
          startDate = new Date(now.setMonth(now.getMonth() - 6));
          break;
        case "1_year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        case "all_time":
        default:
          return true; // No date filtering for "all_time"
      }
      return itemDate >= startDate;
    });

    const groupedByDate = filteredDataByRange.reduce((acc, item) => {
      const date = new Date(item.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!acc[date]) {
        acc[date] = { date };
      }
      acc[date][item.finish] = item.price;
      return acc;
    }, {});

    const dataPoints = Object.values(groupedByDate);

    const finishes = new Set();
    filteredDataByRange.forEach((item) => finishes.add(item.finish));
    const sortedFinishes = Array.from(finishes).sort();

    const dynamicChartConfig = sortedFinishes.reduce((acc, finish, index) => {
      acc[finish] = {
        label: finish
          .replace(/_/g, " ")
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" "),
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
      return acc;
    }, {});

    return {
      processedData: dataPoints,
      chartConfig: dynamicChartConfig,
      uniqueFinishes: sortedFinishes,
    };
  }, [rawData, selectedPriceRange]);

  useEffect(() => {
    if (uniqueFinishes.length > 0 && selectedFinishes.length === 0) {
      setSelectedFinishes(uniqueFinishes);
    }
  }, [uniqueFinishes, selectedFinishes]);

  const handleFinishChange = (finish) => {
    setSelectedFinishes((prev) =>
      prev.includes(finish)
        ? prev.filter((f) => f !== finish)
        : [...prev, finish]
    );
  };

  const chartData = processedData;

  return (
    <Card className={`shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col w-full h-full`}>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Market Price History</CardTitle>
          <CardDescription>
            Showing price data for the last 6+ months
          </CardDescription>
        </div>
        {uniqueFinishes.length > 1 && (
          <Popover modal={false}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-[180px] justify-between"
              >
                Select Finishes
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <div className="grid gap-1 p-2">
                {uniqueFinishes.map((finish) => (
                  <div
                    key={finish}
                    className="flex items-center space-x-2 cursor-pointer py-1 px-2 hover:bg-accent hover:text-accent-foreground rounded-sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent Popover from closing
                      handleFinishChange(finish);
                    }}
                  >
                    <Checkbox
                      id={`finish-${finish}`}
                      checked={selectedFinishes.includes(finish)}
                      onCheckedChange={() => handleFinishChange(finish)}
                    />
                    <label
                      htmlFor={`finish-${finish}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {chartConfig[finish]?.label || finish}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
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
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            {selectedFinishes.map((finish) => (
              <Line
                key={finish}
                dataKey={finish}
                type="natural"
                stroke={chartConfig[finish]?.color}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up since last month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January 2025 - May 2025
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

MarketPriceHistoryChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      condition: PropTypes.string,
      finish: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedPriceRange: PropTypes.string.isRequired,
};
