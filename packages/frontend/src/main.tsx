import React from "react";
import ReactDOM from "react-dom/client";

// import TRPCConsumer from "./TRPCConsumer";
import RegularConsumer from "./RegularConsumer";

import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/api/trpc";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <trpc.react.Provider client={trpc.client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* <TRPCConsumer /> */}
        <RegularConsumer />
      </QueryClientProvider>
    </trpc.react.Provider>
  </React.StrictMode>,
);
