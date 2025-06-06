// src/components/StockChart.tsx
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Box } from "@chakra-ui/react";
import { useStockStore } from "../../store/stockStore";
import { SYMBOL_COLORS, SYMBOLS } from "../../constants/stockSymbols";

export const StockChart: React.FC = () => {
  const history = useStockStore((s) => s.history);

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  const chartData = useMemo(() => {
    return Object.values(history).slice(-50);
  }, [history]);

  return (
    <Box>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={chartData}>
          <XAxis dataKey="time" tickFormatter={(tick) => formatXAxis(tick)} />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Legend />
          {SYMBOLS.map((symbol) => (
            <Line
              key={symbol}
              type="monotone"
              dataKey={symbol}
              strokeWidth={2}
              dot={false}
              stroke={SYMBOL_COLORS[symbol]}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
