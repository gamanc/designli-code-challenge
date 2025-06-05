import axios from "axios";
import type {
  ConnectionStatus,
  FinnhubDataObject,
  FinnhubMessage,
} from "@/interfaces/finnhub";
import { useEffect, useRef, useState } from "react";
import { useStockStore } from "../../store/stockStore";

const API_TOKEN = import.meta.env.VITE_FINNHUB_TOKEN ?? ""; // Update .env file with your Finnhub token

interface Props {
  symbols: string[];
}

const useStockPrices = ({ symbols }: Props) => {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("Disconnected");
  const updateSymbolClosePrice = useStockStore((s) => s.updateSymbolClosePrice);
  const updatePrice = useStockStore((s) => s.updatePrice);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchInitialPrices = async () => {
      await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const res = await axios.get(`https://finnhub.io/api/v1/quote`, {
              params: { symbol, token: API_TOKEN },
            });

            updateSymbolClosePrice(symbol, res.data.pc ?? null);
          } catch (err) {
            console.error(`Failed to fetch quote for ${symbol}`, err);
          }
        })
      );
    };

    fetchInitialPrices();
  }, [symbols]);

  const handleMessageEvent = (event: MessageEvent<any>) => {
    const message: FinnhubMessage = JSON.parse(event.data);
    if (message.type === "trade" && message.data?.length) {
      const updates: FinnhubDataObject[] = message.data;

      updates.forEach(({ s, p, v, t }) => {
        updatePrice(s, p, v, t);
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

  return { connectionStatus };
};

export default useStockPrices;
