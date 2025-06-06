export type HistoryPoint = {
  time: number;
  [symbol: string]: number;
};

export type StockAlerts = { [symbol: string]: number };

export type History = { [timestamp: string]: HistoryPoint };
