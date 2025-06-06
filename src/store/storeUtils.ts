import type { StockAlerts } from "@/interfaces/store";
import { pushNotification } from "../utils/userNotification";

export const readAlerts = (
  currentAlerts: StockAlerts,
  symbol: string,
  prevPrice: number,
  incomingPrice: number
) => {
  const alertPrice = currentAlerts[symbol];

  let newAlerts = { ...currentAlerts };

  if (!alertPrice) return { newAlerts };

  const isCrossingUp = prevPrice < alertPrice && incomingPrice >= alertPrice;
  const isCrossingDown = prevPrice > alertPrice && incomingPrice <= alertPrice;
  if (isCrossingUp || isCrossingDown) {
    delete newAlerts[symbol];
    console.warn(`🚨 Alert triggered for ${symbol} crossing $${alertPrice}`);
  }

  if (isCrossingDown || isCrossingUp) pushNotification(symbol, alertPrice);

  return { isCrossingDown, isCrossingUp, newAlerts };
};
