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

export type ConnectionStatus = "Disconnected" | "Connected" | "Error";
