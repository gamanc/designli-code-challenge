export interface FinnhubDataObject {
  s: string; // symbol
  p: number; // price
  t: number; // timestamp
  v: number; // volume
}

export type FinnhubMessage = {
  type: string;
  data?: FinnhubDataObject[];
};

export type StockQuote = {
  [symbol: string]: StockInfo;
};

export type StockInfo = {
  price: number;
  volume: number;
  lastUpdated: number;
  previousClosePrice: number | null;
};

export type ConnectionStatus =
  | "Loading"
  | "Disconnected"
  | "Connected"
  | "Error";
