import { router } from "./trpc";
import { getTodos, getTodo, upsertTodo, deleteTodo } from "./procedures/todos";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";

const todoEndpoints = {
  [getTodos.endpoint]: getTodos.procedure,
  [getTodo.endpoint]: getTodo.procedure,
  [upsertTodo.endpoint]: upsertTodo.procedure,
  [deleteTodo.endpoint]: deleteTodo.procedure,
} as const;
const endpoints = { ...todoEndpoints };

const appRouter = router(endpoints);
export type AppRouter = typeof appRouter;

createHTTPServer({
  middleware: cors(),
  router: appRouter,
}).listen(42068);
