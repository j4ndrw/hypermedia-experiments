import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@hypermedia-experiments/backend";

export const trpc = createTRPCReact<AppRouter>();
