import "./overrides";

import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";

import { router } from "./trpc";
import { hypermedia } from "./hypermedia";

import { getTodos, getTodo, upsertTodo, deleteTodo } from "./procedures/todos";

import TodoContracts from "./procedures/todos/contracts";

const todoEndpoints = hypermedia.routeEndpoints({
  [TodoContracts.getTodos.endpoint]: getTodos,
  [TodoContracts.getTodo.endpoint]: getTodo,
  [TodoContracts.upsertTodo.endpoint]: upsertTodo,
  [TodoContracts.deleteTodo.endpoint]: deleteTodo,
});
const endpoints = { ...todoEndpoints };

const appRouter = router(endpoints);
export type AppRouter = typeof appRouter;

createHTTPServer({
  middleware: cors(),
  router: appRouter,
}).listen(42068);
