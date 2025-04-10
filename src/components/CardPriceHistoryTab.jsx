import PropTypes from 'prop-types';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState, useMemo } from "react";

const CardPriceHistoryTab = ({ prices }) => {
  const [dateRange, setDateRange] = useState("30");

  // Filter prices based on selected date range
  const filteredPrices = useMemo(() => {
    if (!prices || prices.length === 0) return [];

    const now = new Date();
    const rangeDays = parseInt(dateRange);
    const oldestAllowedDate = new Date();
    oldestAllowedDate.setDate(now.getDate() - rangeDays);

    // If there's no data within the selected range, use all available data
    const oldestDataPoint = new Date(Math.min(...prices.map(p => new Date(p.timestamp))));
    if (oldestDataPoint > oldestAllowedDate) {
      return prices;
    }

    return prices.filter(price => {
      const priceDate = new Date(price.timestamp);
      return priceDate >= oldestAllowedDate;
    });
  }, [prices, dateRange]);

  if (!prices || prices.length === 0) {
    return <p className="text-muted-foreground">No price information available.</p>;
  }

  // Group data by finish type
  const groupedByFinish = filteredPrices.reduce((acc, record) => {
    const fullDate = record.timestamp.split('T')[0];
    const [, month, day] = fullDate.split('-');
    const shortDate = `${month}-${day}`;
    if (!acc[record.finish]) {
      acc[record.finish] = {};
    }
    if (!acc[record.finish][shortDate]) {
      acc[record.finish][shortDate] = {
        price: record.price,
        fullDate
      };
    }
    return acc;
  }, {});

  // Create a unified dataset for the chart
  const chartData = Object.keys(groupedByFinish[Object.keys(groupedByFinish)[0]] || {}).map(shortDate => {
    const dataPoint = { date: shortDate };
    Object.keys(groupedByFinish).forEach(finish => {
      dataPoint[finish] = groupedByFinish[finish][shortDate].price;
      dataPoint[`${finish}FullDate`] = groupedByFinish[finish][shortDate].fullDate;
    });
    return dataPoint;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 3 Months</SelectItem>
            <SelectItem value="180">Last 6 Months</SelectItem>
            <SelectItem value="365">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="pt-3 w-full h-[300px] bg-card rounded-lg border">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              fontWeight={600}
              tickLine={true}
              axisLine={true}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              fontWeight={600}
              tickLine={true}
              axisLine={true}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "0.5rem"
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const fullDate = groupedByFinish[payload[0].name][label].fullDate;
                  const date = new Date(fullDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  });
                  return (
                    <div className="bg-card border rounded-lg p-2 shadow-sm">
                      <p className="text-sm font-medium mb-1">{date}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="text-sm">
                          <span style={{ color: entry.color }}>{entry.name}: </span>
                          <span className="font-medium">${entry.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            {Object.keys(groupedByFinish).map((finish, index) => (
              <Line
                key={finish}
                type="monotone"
                dataKey={finish}
                stroke={index === 0 ? "#22c55e" : "#3b82f6"}
                strokeWidth={2}
                dot={true}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

CardPriceHistoryTab.propTypes = {
  prices: PropTypes.arrayOf(PropTypes.shape({
    condition: PropTypes.string.isRequired,
    finish: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    timestamp: PropTypes.string.isRequired
  }))
};

export default CardPriceHistoryTab;
