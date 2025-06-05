import { Box, Heading, Skeleton, Text } from "@chakra-ui/react";
import { useColorModeValue } from "../ui/color-mode";

interface Props {
  symbol: string;
  price: number | null;
  previousClose: number | null;
}

const StockCard = ({ symbol, price = null, previousClose = null }: Props) => {
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
        bg={useColorModeValue("white", "gray.700")}
      >
        <Heading size="md">{symbol}</Heading>

        <Skeleton loading={!price}>
          <Heading size="3xl">${price?.toFixed(2) ?? "—"}</Heading>
        </Skeleton>

        {percent !== null && (
          <Text mt={2} fontWeight="bold" color={color}>
            {isUp ? "▲" : "▼"} {percent.toFixed(2)}%
          </Text>
        )}
      </Box>
    </Skeleton>
  );
};

export default StockCard;
