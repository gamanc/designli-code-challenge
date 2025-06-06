import { Box, Flex } from "@chakra-ui/react";
import StockDashboard from "./components/StockDashboard";
import { StockForm } from "./components/StockForm";
import { Toaster } from "./components/ui/toaster";
import { StockChart } from "./components/StockChart";

export default function App() {
  return (
    <Box p={4}>
      <Box mb={4}>
        <StockDashboard />
      </Box>

      <Flex direction={{ base: "column", md: "row" }} gap={4}>
        <Box minW={{ md: "300px" }} flexShrink={0}>
          <StockForm />
        </Box>

        <Box flex="1">
          <StockChart />
        </Box>
      </Flex>

      <Toaster />
    </Box>
  );
}
