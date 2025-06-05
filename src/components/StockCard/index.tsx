import { Box, Flex, Heading, Skeleton, Text } from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";
import { useStockStore } from "../../store/stockStore";
import { formatCurrencyUSD } from "../../utils/formatCurrencyUSD";

interface Props {
  symbol: string;
  price: number | null;
  previousClose: number | null;
}

const StockCard = ({ symbol, price = null, previousClose = null }: Props) => {
  const alerts = useStockStore((s) => s.alerts);

  const change =
    previousClose !== null && price !== null && price > 0
      ? price - previousClose
      : null;

  const percent =
    previousClose !== null && price !== null && price > 0 && previousClose > 0
      ? (change! / previousClose) * 100
      : null;

  const isUp = change !== null && change >= 0;
  const color = isUp ? "green.500" : "red.500";

  const getCardBackgroundColor = () => {
    if (alerts[symbol] && price)
      return price > alerts[symbol]
        ? useColorModeValue("green.200", "green.900")
        : useColorModeValue("red.200", "red.900");
    return useColorModeValue("white", "gray.700");
  };

  return (
    <Skeleton height={120} loading={price === null}>
      <Box
        key={symbol}
        borderWidth="1px"
        borderRadius="lg"
        minW="200px"
        w="300px"
        height="120px"
        p={4}
        shadow="md"
        flexShrink={0}
        bg={getCardBackgroundColor()}
      >
        <Heading size="md">{symbol}</Heading>

        <Skeleton loading={!price}>
          <Heading size="3xl">{formatCurrencyUSD(price)}</Heading>
        </Skeleton>

        <Flex justifyContent="space-between">
          {percent !== null && (
            <Text mt={2} fontWeight="bold" color={color}>
              {isUp ? "▲" : "▼"} {percent.toFixed(2)}%
            </Text>
          )}

          {!!alerts[symbol] && (
            <Text mt={2} fontWeight="bold">
              ⏰ {formatCurrencyUSD(alerts[symbol])}
            </Text>
          )}
        </Flex>
      </Box>
    </Skeleton>
  );
};

export default StockCard;
