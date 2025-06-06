import { createToaster } from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster";

export const pushNotification = (symbol: string, price: number) => {
  const title = `🚨 ${symbol} crossed alert 🚨`;
  const textBody = `Now at $${price.toFixed(2)}`;

  if (Notification.permission === "granted") {
    new Notification(title, {
      body: textBody,
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, {
          body: textBody,
        });
      }
    });
  }
  toaster.warning({
    title,
    description: textBody,
    closable: true,
    duration: 60 * 1000,
  });
};
