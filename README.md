# 📈 Real-Time Stock Tracker

A real-time stock tracking dashboard built with React, Vite, and Chakra UI.  
It allows users to:

- Monitor live stock prices via the Finnhub WebSocket API
- Set custom price alerts and receive in-browser notifications
- Visualize live price history across multiple stocks on a single chart

---

## How to Run

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variable**  
   Create a `.env` file in the root of the project and add your Finnhub API token:

   ```env
   VITE_FINNHUB_TOKEN=your_token_here
   ```

3. **Start the app**
   ```bash
   npm run dev
   ```

---

## Tech Stack

| Library                | Reason                                |
| ---------------------- | ------------------------------------- |
| **Vite**               | Lightning-fast bundler and dev server |
| **React + TypeScript** | Core UI and logic with strong typing  |
| **Zustand**            | Simple and scalable state management  |
| **Chakra UI**          | Fast and reliable UI components       |
| **Recharts**           | Real-time data visualization          |
| **Finnhub API**        | Real-time stock trade and quote data  |

---

## Screenshots

>

---

## Features Implemented

- Live stock price updates (WebSocket)
- Custom alert system with browser push notifications (Custom toaster alerts if the user does not allow notifications)
- Real-time line chart with forward-filled price history
- Option to toggle on/off different symbols from the chart.
- Clean responsive UI using Chakra UI
- Modular and maintainable code with Zustand store

---

## Notes

- Push notifications only work when the tab is open and user has granted permission
- The app does not currently include offline/PWA functionality :(

## Final note

Thank you for the opportunity to apply and share this project. I’ve put a lot of care and effort into building it, and I truly enjoyed working on it.
I'm excited about the possibility of joining your team and look forward to hearing your feedback!
