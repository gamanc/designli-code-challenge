import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider } from "./components/ui/color-mode.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider forcedTheme="dark">
        <App />
      </ColorModeProvider>
    </ChakraProvider>
  </StrictMode>
);
