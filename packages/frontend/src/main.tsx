import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";

import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpLink } from "@trpc/client";
import { trpc } from "@/api/trpc";

const apiHost = import.meta.env.VITE_API_HOST;

if (!apiHost)
  throw new Error(
    "No API host defined. Please define it in a `VITE_API_HOST` variable in .env",
  );

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [httpLink({ url: apiHost })],
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>,
);
