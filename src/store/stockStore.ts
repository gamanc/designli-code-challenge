import { SYMBOLS } from "../constants/stockSymbols";
import type { StockInfo } from "../interfaces/finnhub";
import { create } from "zustand";

export type HistoryPoint = {
  time: number;
  [symbol: string]: number;
};

export type History = { [timestamp: string]: HistoryPoint };

type StockStore = {
  trackedSymbols: string[];
  alerts: { [symbol: string]: number };
  prices: { [symbol: string]: StockInfo };
  history: History;
  updateAlert: (symbol: string, alertPrice: number) => void;
  updatePrice: (
    symbol: string,
    price: number,
    volume: number,
    timestamp: number,
    previousClosePrice?: number
  ) => void;
  updateSymbolClosePrice: (symbol: string, previousClosePrice: number) => void;
};

export const useStockStore = create<StockStore>((set) => ({
  trackedSymbols: [],
  alerts: {},
  prices: {},
  history: {},
  updateAlert: (symbol, alertPrice) =>
    set((state) => {
      return {
        trackedSymbols: [...state.trackedSymbols, symbol],
        alerts: { ...state.alerts, [symbol]: alertPrice },
      };
    }),

  updatePrice: (symbol, price, volume, timestamp) => {
    set((state) => {
      const prevPrices = state.prices;
      const currentPriceEntry = prevPrices[symbol] || {
        previousClose: null,
        lastUpdated: timestamp,
        volume: 0,
        price: 0,
      };

      const flooredTime = Math.floor(timestamp / 1000);
      const prevHistory = state.history;
      const lastKnownPrices: Record<string, number> = {};

      // Get last known price for each symbol
      Object.keys(prevPrices).forEach((sym) => {
        lastKnownPrices[sym] = prevPrices[sym].price;
      });

      // Get previous empty timestamp
      const lastPoint = prevHistory[flooredTime] || { time: flooredTime };

      // Fill current symbol price
      const updatedPoint: HistoryPoint = {
        ...lastPoint,
        time: flooredTime,
        [symbol]: price,
      };

      // Fill any missing symbols (unless already updated)
      SYMBOLS.forEach((sym) => {
        if (!(sym in updatedPoint)) {
          const lastPrice = lastKnownPrices[sym];
          if (lastPrice != null) {
            updatedPoint[sym] = lastPrice;
          }
        }
      });

      const nextHistory: History = {
        ...prevHistory,
        [flooredTime]: updatedPoint,
      };

      // Limit history size
      const MAX_POINTS = 100;
      const sortedTimestamps = Object.keys(nextHistory)
        .map(Number)
        .sort((a, b) => a - b);

      const trimmedTimestamps =
        sortedTimestamps.length > MAX_POINTS
          ? sortedTimestamps.slice(-MAX_POINTS)
          : sortedTimestamps;

      const trimmedHistory: Record<string, HistoryPoint> = {};
      trimmedTimestamps.forEach((t) => {
        trimmedHistory[t] = nextHistory[t];
      });

      return {
        prices: {
          ...prevPrices,
          [symbol]: {
            ...currentPriceEntry,
            price,
            volume,
            lastUpdated: timestamp,
          },
        },
        history: trimmedHistory,
      };
    });
  },

  updateSymbolClosePrice: (symbol, previousClosePrice) =>
    set((state) => {
      const prevData = state.prices[symbol] || {
        price: 0,
        volume: 0,
        lastUpdated: Date.now(),
        previousClosePrice: 0,
      };
      return {
        prices: {
          ...state.prices,
          [symbol]: {
            ...prevData,
            previousClosePrice,
          },
        },
      };
    }),
}));
