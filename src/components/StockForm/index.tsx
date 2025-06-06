import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Field,
  Fieldset,
  For,
  Input,
  NativeSelect,
  Text,
} from "@chakra-ui/react";
import { toaster } from "../../components/ui/toaster";
import { useStockStore } from "../../store/stockStore";
import { SYMBOLS } from "../../constants/stockSymbols";

export const StockForm: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [alertPrice, setAlertPrice] = useState("");

  const updateAlert = useStockStore((s) => s.updateAlert);
  const prices = useStockStore((s) => s.prices);

  // Autofill price when selecting a stock
  useEffect(() => {
    if (!selectedSymbol) return;
    const priceInfo = prices[selectedSymbol];
    if (priceInfo?.price) {
      setAlertPrice(priceInfo.price.toFixed(2));
    } else {
      setAlertPrice("");
    }
  }, [selectedSymbol]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymbol || !alertPrice) return;

    const alertValue = parseFloat(alertPrice);
    if (isNaN(alertValue)) {
      toaster.create({
        description: "Invalid alert price.",
        type: "error",
        duration: 10000,
        closable: true,
      });
      return;
    }

    updateAlert(selectedSymbol, alertValue);
    toaster.create({
      title: `Added ${selectedSymbol} with alert at $${alertValue}`,
      type: "success",
      duration: 10000,
      closable: true,
    });

    setSelectedSymbol("");
    setAlertPrice("");
  };

  const handleSelectedSymbol = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setSelectedSymbol(e.target.value),
    []
  );

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" mb={8} width="auto">
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Add Stock to Watch
      </Text>

      <form onSubmit={handleSubmit}>
        <Fieldset.Root size="lg" maxW="md">
          <Fieldset.Content>
            <Field.Root>
              <Field.Label>Stock Symbol</Field.Label>
              <NativeSelect.Root>
                <NativeSelect.Field
                  id="symbol"
                  placeholder="Select a symbol"
                  value={selectedSymbol}
                  onChange={handleSelectedSymbol}
                >
                  <For each={SYMBOLS}>
                    {(item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    )}
                  </For>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
            <Field.Root mb={8}>
              <Field.Label>Alert price ($) when crossing down:</Field.Label>
              <Input
                id="alertPrice"
                type="number"
                placeholder="Enter alert price"
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
              />
            </Field.Root>
          </Fieldset.Content>
        </Fieldset.Root>

        <Button type="submit" colorScheme="teal" width="60">
          Save alert
        </Button>
      </form>
    </Box>
  );
};
