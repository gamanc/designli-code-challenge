// src/components/StockChart.tsx
import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Badge, Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { useStockStore } from "../../store/stockStore";
import { SYMBOL_COLORS, SYMBOLS } from "../../constants/stockSymbols";

export const StockChart: React.FC = () => {
  const history = useStockStore((s) => s.history);
  const [selectedStocks, setSelectedStocks] = useState<string[]>(SYMBOLS);

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  const chartData = useMemo(() => {
    // Taking last 60 values
    return Object.values(history).slice(-60);
  }, [history]);

  const handleToggleStock = (stock: string) => {
    setSelectedStocks((prev) =>
      prev.includes(stock) ? prev.filter((s) => s !== stock) : [...prev, stock]
    );
  };

  return (
    <Flex direction={{ base: "column", md: "row" }} gap={8} overflow="scroll">
      <Flex
        direction={{ base: "row", md: "column" }}
        padding={6}
        gap={2}
        marginRight={4}
        alignItems="start"
        borderWidth="1px"
        borderRadius="lg"
        wrap={{ base: "wrap", md: "nowrap" }}
        width={{ base: "100%", md: "min-content" }}
      >
        <Text
          fontSize="lg"
          fontWeight="bold"
          mb={4}
          width={{ base: "100%", md: "min-content" }}
        >
          Select symbols
        </Text>
        {SYMBOLS.map((symbol) => (
          <Badge
            key={symbol}
            variant={selectedStocks.includes(symbol) ? "solid" : "outline"}
            onClick={() => handleToggleStock(symbol)}
            backgroundColor={
              selectedStocks.includes(symbol)
                ? SYMBOL_COLORS[symbol]
                : "inherit"
            }
            borderWidth="1px"
            borderColor={
              selectedStocks.includes(symbol)
                ? "inherit"
                : SYMBOL_COLORS[symbol]
            }
          >
            {symbol}
          </Badge>
        ))}
      </Flex>
      {selectedStocks.length === 0 ? (
        <Flex
          p={8}
          borderWidth="1px"
          borderRadius="lg"
          alignContent="center"
          justifyContent="center"
          width="100%"
          minWidth={500}
        >
          <Heading size="3xl" color="gray.500">
            Select some symbols to start the chart
          </Heading>
        </Flex>
      ) : (
        <ResponsiveContainer height={500}>
          <LineChart data={chartData}>
            <XAxis dataKey="time" tickFormatter={(tick) => formatXAxis(tick)} />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Legend />
            {selectedStocks.map((symbol) => (
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
      )}
    </Flex>
  );
};
