import { createTRPCReact } from "@trpc/react-query";
import { createTRPCProxyClient, httpLink } from "@trpc/client";
import type { AppRouter } from "@hypermedia-experiments/backend";

export const apiHost = import.meta.env.VITE_API_HOST;
if (!apiHost)
  throw new Error(
    "No API host defined. Please define it in a `VITE_API_HOST` variable in .env",
  );
const apiLink = httpLink({ url: apiHost });

export const trpc = (() => {
  const trpcReactClient = createTRPCReact<AppRouter>();
  return {
    react: trpcReactClient,
    proxy: createTRPCProxyClient<AppRouter>({
      links: [apiLink],
    }),
    client: trpcReactClient.createClient({
      links: [httpLink({ url: apiHost })],
    }),
  };
})();
