import { Box } from "@chakra-ui/react";
import StockDashboard from "./components/StockDashboard";
import { StockForm } from "./components/StockForm";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <Box>
      <StockDashboard />
      <StockForm />
      <Toaster />
    </Box>
  );
}
