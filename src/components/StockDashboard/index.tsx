import { Box, Heading, HStack } from "@chakra-ui/react";
import useStockPrices from "../../hooks/useStockPrices";
import StockCard from "../StockCard";
import { useStockStore } from "../../store/stockStore";

const SYMBOLS = [
  "BINANCE:BTCUSDT",
  "COINBASE:BTC-USD",
  "MSFT",
  "AMZN",
  "IC MARKETS:1",
];

const StockDashboard = () => {
  const { connectionStatus } = useStockPrices({
    symbols: SYMBOLS,
  });

  const prices = useStockStore((s) => s.prices);
  const history = useStockStore((s) => s.history);

  return (
    <Box>
      <Heading p={6} mb={4}>
        📈 Live Stock Dashboard - {connectionStatus}
      </Heading>
      <Box
        width="100%"
        overflowX="auto"
        whiteSpace="nowrap"
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
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
    </Box>
  );
};

export default StockDashboard;
