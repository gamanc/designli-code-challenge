import type {
  ConnectionStatus,
  FinnhubDataObject,
  FinnhubMessage,
} from "@/interfaces/finnhub";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const API_TOKEN = "d10jco9r01qlsac9fkfgd10jco9r01qlsac9fkg0"; // Replace with your Finnhub token

interface Props {
  symbols: string[];
}

type StockPriceState = {
  [symbol: string]: {
    price: number;
    lastUpdated: number;
    volume: number;
    previousClosePrice: number | null;
  };
};

const useStockPrices = ({ symbols }: Props) => {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("Disconnected");
  const [symbolsData, setSymbolsData] = useState<StockPriceState>({});

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchInitialPrices = async () => {
      const updates: StockPriceState = {};
      await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const res = await axios.get(`https://finnhub.io/api/v1/quote`, {
              params: { symbol, token: API_TOKEN },
            });

            updates[symbol] = {
              price: res.data.c ?? 0,
              volume: 0,
              lastUpdated: Date.now(),
              previousClosePrice: res.data.pc ?? null,
            };
          } catch (err) {
            console.error(`Failed to fetch quote for ${symbol}`, err);
          }
        })
      );
      setSymbolsData(updates);
    };

    fetchInitialPrices();
  }, []);

  const handleMessageEvent = (event: MessageEvent<any>) => {
    const message: FinnhubMessage = JSON.parse(event.data);
    if (message.type === "trade" && message.data?.length) {
      const updates: FinnhubDataObject[] = message.data;
      setSymbolsData((prev) => {
        const updated = { ...prev };
        updates.forEach(({ s, p, t, v }) => {
          const prevData = prev[s] ?? { previousClose: null };
          updated[s] = { ...prevData, price: p, lastUpdated: t, volume: v };
        });
        return updated;
      });
    }
  };

  useEffect(() => {
    const ws = new WebSocket(`wss://ws.finnhub.io?token=${API_TOKEN}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setConnectionStatus("Connected");
      symbols.forEach((symbol) => {
        ws.send(JSON.stringify({ type: "subscribe", symbol }));
      });
    };

    ws.onmessage = (event) => {
      try {
        handleMessageEvent(event);
      } catch (error) {
        console.error("Error parsing message", error);
        setSymbolsData({});
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("Error");
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setConnectionStatus("Disconnected");
    };

    return () => {
      console.log("Closing socket connection");
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        symbols.forEach((symbol) => {
          ws.send(JSON.stringify({ type: "unsubscribe", symbol }));
        });
        socketRef.current.close();
      }
    };
  }, []);

  //   const closeConnection = () => {
  //     if (socketRef.current !== null && socketRef.current.readyState === WebSocket.OPEN) {
  //       symbols.forEach(symbol => {
  //         socketRef.current.send(JSON.stringify({ type: 'unsubscribe', symbol }));
  //       });
  //       socketRef.current.close();
  //     }
  //   };

  return { connectionStatus, symbolsData };
};

export default useStockPrices;
