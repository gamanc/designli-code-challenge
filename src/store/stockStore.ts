import type { StockInfo } from "@/interfaces/finnhub";
import { create } from "zustand";

type HistoryPoint = {
  time: number;
  price: number;
};

type StockStore = {
  trackedSymbols: string[];
  alerts: { [symbol: string]: number };
  prices: { [symbol: string]: StockInfo };
  history: { [symbol: string]: HistoryPoint[] };
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
      if (state.trackedSymbols.includes(symbol)) return state;
      return {
        trackedSymbols: [...state.trackedSymbols, symbol],
        alerts: { ...state.alerts, [symbol]: alertPrice },
      };
    }),

  updatePrice: (symbol, price, volume, timestamp) =>
    set((state) => {
      const prevData = state.prices[symbol] || {
        price: 0,
        volume: 0,
        lastUpdated: Date.now(),
        previousClosePrice: 0,
      };

      const updatedHistory = [
        ...(state.history[symbol] || []),
        { time: timestamp, price },
      ].slice(-100); // Keep last 100 records of the price

      return {
        prices: {
          ...state.prices,
          [symbol]: {
            ...prevData,
            price,
            volume,
            lastUpdated: timestamp,
          },
        },
        history: {
          ...state.history,
          [symbol]: updatedHistory,
        },
      };
    }),

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
