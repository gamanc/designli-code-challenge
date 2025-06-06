import { Box, Heading, HStack, Spinner, Text } from "@chakra-ui/react";
import useStockPrices from "../../hooks/useStockPrices";
import StockCard from "../StockCard";
import { useStockStore } from "../../store/stockStore";
import { SYMBOLS } from "../../constants/stockSymbols";

const StockDashboard = () => {
  const { connectionStatus } = useStockPrices({
    symbols: SYMBOLS,
  });

  const prices = useStockStore((s) => s.prices);

  return (
    <Box>
      <Box
        width="100%"
        overflowX="auto"
        whiteSpace="nowrap"
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <HStack px={2}>
          {SYMBOLS.map((stockSymbol) => {
            const data = prices[stockSymbol];

            return (
              <StockCard
                key={stockSymbol}
                symbol={stockSymbol}
                price={data?.price}
                previousClose={data?.previousClosePrice}
              />
            );
          })}
        </HStack>
      </Box>
      <Heading paddingTop={4}>📈 Live Stock Dashboard</Heading>
      <Text color={connectionStatus === "Connected" ? "green.500" : "inherit"}>
        {connectionStatus === "Loading" ? (
          <Spinner size="sm" />
        ) : (
          connectionStatus
        )}
      </Text>
    </Box>
  );
};

export default StockDashboard;
