import z from "zod";

import TodoRepository from "../../repository/todos";
import TodoContracts from "./contracts";

import { publicProcedure } from "../../trpc";
import { hypermedia } from "../../hypermedia";

export const getTodo = hypermedia.endpoint(
  TodoContracts.getTodo,
  ({ validator }) =>
    publicProcedure.input(validator).query(async ({ input }) => {
      const todo = await TodoRepository.get(input);
      if (!todo) return hypermedia.response(undefined, {});

      return hypermedia.response(todo, {
        ...hypermedia.createAction(TodoContracts.upsertTodo.endpoint, {
          endpoint: TodoContracts.upsertTodo.endpoint,
          markAsTodo: {
            params: { id: todo.id, state: "to-do" } as Pick<
              z.infer<NonNullable<typeof TodoContracts.upsertTodo.validator>>,
              "id" | "state"
            >,
          },
          markAsInProgress: {
            params: { id: todo.id, state: "in-progress" } as Pick<
              z.infer<NonNullable<typeof TodoContracts.upsertTodo.validator>>,
              "id" | "state"
            >,
          },
          markAsDone: {
            params: { id: todo.id, state: "done" } as Pick<
              z.infer<NonNullable<typeof TodoContracts.upsertTodo.validator>>,
              "id" | "state"
            >,
          },
        }),
        ...hypermedia.createAction(TodoContracts.deleteTodo.endpoint, {
          params: { id: todo.id } as z.infer<
            NonNullable<typeof TodoContracts.deleteTodo.validator>
          >,
        }),
      });
    }),
);

export const getTodos = hypermedia.endpoint(TodoContracts.getTodos, () =>
  publicProcedure.query(async () => {
    const todos = await TodoRepository.getAll();
    return todos.map((todo) =>
      hypermedia.response(todo, {
        ...hypermedia.createAction(TodoContracts.getTodo.endpoint, {
          params: { id: todo.id } as z.infer<
            NonNullable<typeof TodoContracts.getTodo.validator>
          >,
        }),
        ...hypermedia.createAction(TodoContracts.upsertTodo.endpoint, {
          markAsTodo: {
            params: { id: todo.id, state: "to-do" } as Pick<
              z.infer<NonNullable<typeof TodoContracts.upsertTodo.validator>>,
              "id" | "state"
            >,
          },
          markAsInProgress: {
            params: { id: todo.id, state: "in-progress" } as Pick<
              z.infer<NonNullable<typeof TodoContracts.upsertTodo.validator>>,
              "id" | "state"
            >,
          },
          markAsDone: {
            params: { id: todo.id, state: "done" } as Pick<
              z.infer<NonNullable<typeof TodoContracts.upsertTodo.validator>>,
              "id" | "state"
            >,
          },
        }),
        ...hypermedia.createAction(TodoContracts.deleteTodo.endpoint, {
          params: { id: todo.id } as z.infer<
            NonNullable<typeof TodoContracts.deleteTodo.validator>
          >,
        }),
      }),
    );
  }),
);

export const upsertTodo = hypermedia.endpoint(
  TodoContracts.upsertTodo,
  ({ validator }) =>
    publicProcedure.input(validator).mutation(async ({ input }) => {
      await TodoRepository.upsert(input);
      return hypermedia.response(
        undefined,
        hypermedia.createAction(TodoContracts.getTodos.endpoint, {}),
      );
    }),
);

export const deleteTodo = hypermedia.endpoint(
  TodoContracts.deleteTodo,
  ({ validator }) =>
    publicProcedure.input(validator).mutation(async ({ input }) => {
      await TodoRepository.remove(input);
      return hypermedia.response(
        undefined,
        hypermedia.createAction(TodoContracts.getTodos.endpoint, {}),
      );
    }),
);
