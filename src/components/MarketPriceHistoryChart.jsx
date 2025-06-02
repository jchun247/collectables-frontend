import { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
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

  const descriptionText = useMemo(() => {
    switch (selectedPriceRange) {
      case "3_months":
        return "Market prices over the last 3 months.";
      case "6_months":
        return "Market prices over the last 6 months.";
      case "1_year":
        return "Market prices over the last 1 year.";
      case "all_time":
        return "Overall market price history.";
      default:
        return "Market price history.";
    }
  }, [selectedPriceRange]);

  const footerStats = useMemo(() => {
    if (!chartData || chartData.length === 0 ) {
      return { dateRangeText: "N/A", changes: [] };
    }

    const firstDataPoint = chartData[0];
    const lastDataPoint = chartData[chartData.length - 1];

    const startDate = firstDataPoint.date; // Already formatted "Mon Day"
    const endDate = chartData.length > 1 ? lastDataPoint.date : startDate;
    const dateRangeText = (chartData.length > 1 && startDate !== endDate) ? `${startDate} - ${endDate}` : startDate;

    if (selectedFinishes.length === 0) {
        return { dateRangeText, changes: [] };
    }

    const changes = selectedFinishes.map(finish => {
      const startPrice = firstDataPoint[finish];
      const endPrice = lastDataPoint[finish];
      let percentageChange = null;
      let trendIcon = null;
      let priceDetailText = "Price data not available for this period.";

      if (startPrice !== undefined && endPrice !== undefined && chartData.length > 1) {
        priceDetailText = `From $${startPrice.toFixed(2)} to $${endPrice.toFixed(2)}`;
        if (startPrice > 0) {
          percentageChange = ((endPrice - startPrice) / startPrice) * 100;
        } else if (endPrice > 0) {
          percentageChange = Infinity; // Represents a rise from zero
        } else {
          percentageChange = 0; // From 0 to 0 or 0 to undefined
        }
      } else if (startPrice !== undefined && chartData.length === 1) {
          priceDetailText = `Current: $${startPrice.toFixed(2)}`;
          percentageChange = null; // No change for a single point
      } else if (endPrice !== undefined && chartData.length === 1) { // Should be same as startPrice if length is 1
          priceDetailText = `Current: $${endPrice.toFixed(2)}`;
          percentageChange = null;
      }


      if (percentageChange !== null && isFinite(percentageChange)) {
        if (percentageChange > 0) trendIcon = <TrendingUp className="h-4 w-4 text-green-500" />;
        else if (percentageChange < 0) trendIcon = <TrendingDown className="h-4 w-4 text-red-500" />;
      } else if (percentageChange === Infinity) {
        trendIcon = <TrendingUp className="h-4 w-4 text-green-500" />;
      }

      return {
        finishLabel: chartConfig[finish]?.label || finish,
        percentageChange,
        trendIcon,
        priceDetailText,
        hasDataInRange: startPrice !== undefined || endPrice !== undefined,
      };
    }).filter(item => item.hasDataInRange);

    return { dateRangeText, changes };
  }, [chartData, selectedFinishes, chartConfig]);

  return (
    <Card className={`shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col w-full h-full`}>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Market Price History</CardTitle>
          <CardDescription>
            {descriptionText}
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
        {(!rawData || rawData.length === 0) ? (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            No price history data available
          </div>
        ) : (
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
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 pt-4 text-sm border-t">
        <div className="text-xs text-muted-foreground self-end w-full text-right">
          Date range: {footerStats.dateRangeText}
        </div>
        {footerStats.changes.length > 0 ? (
          footerStats.changes.map((stat, index) => (
            <div key={index} className="grid gap-1 w-full">
              <div className="flex items-center justify-between gap-2 font-medium leading-none">
                <span className="truncate" title={stat.finishLabel}>{stat.finishLabel}:</span>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {stat.percentageChange !== null && isFinite(stat.percentageChange) ? (
                    <>
                      <span className={stat.percentageChange > 0 ? "text-green-600" : stat.percentageChange < 0 ? "text-red-600" : ""}>
                        {stat.percentageChange > 0 ? "+" : ""}
                        {stat.percentageChange.toFixed(1)}%
                      </span>
                      {stat.trendIcon}
                    </>
                  ) : stat.percentageChange === Infinity ? (
                    <>
                      <span className="text-green-600">From $0</span>
                      {stat.trendIcon}
                    </>
                  ) : (
                    <span>No trend</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-start gap-2 text-xs text-muted-foreground">
                <span>{stat.priceDetailText}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted-foreground w-full text-center py-2">
            {(!rawData || rawData.length === 0) ? "No price history data available." :
             selectedFinishes.length > 0 ? "No price data for selected finishes in this period." :
             "Select finishes to see trend data."}
          </div>
        )}
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
