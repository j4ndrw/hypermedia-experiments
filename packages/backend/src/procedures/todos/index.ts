import { db } from "../../db";
import { publicProcedure } from "../../trpc";
import z from "zod";
import { hypermedia } from "../../hypermedia";
import { TODO_STATES } from "../../db/constants";

export const getTodo = hypermedia.endpoint("getTodo", {
  validator: z.object({ id: z.number() }),
  procedure: (validator) =>
    publicProcedure.input(validator).query(async ({ input }) => {
      const todo = await db
        .selectFrom("todo")
        .where("id", "=", input.id)
        .selectAll()
        .executeTakeFirst();
      if (!todo) return null;
      return {
        data: todo,
        actions: {
          [upsertTodo.endpoint]: {
            markAsTodo: {
              params: { id: todo.id, state: "to-do" } as Pick<
                z.infer<NonNullable<typeof upsertTodo.validator>>,
                "id" | "state"
              >,
            },
            markAsInProgress: {
              params: { id: todo.id, state: "in-progress" } as Pick<
                z.infer<NonNullable<typeof upsertTodo.validator>>,
                "id" | "state"
              >,
            },
            markAsDone: {
              params: { id: todo.id, state: "done" } as Pick<
                z.infer<NonNullable<typeof upsertTodo.validator>>,
                "id" | "state"
              >,
            },
          },
          [deleteTodo.endpoint]: {
            params: { id: todo.id } as z.infer<
              NonNullable<typeof deleteTodo.validator>
            >,
          },
        },
      };
    }),
});

export const getTodos = hypermedia.endpoint("getTodos", {
  procedure: () =>
    publicProcedure.query(async () => {
      const todos = await db.selectFrom("todo").selectAll().execute();
      return todos.map((todo) =>
        hypermedia.response(todo, {
          [getTodo.endpoint]: {
            params: { id: todo.id } as z.infer<
              NonNullable<typeof getTodo.validator>
            >,
          },
          [upsertTodo.endpoint]: {
            markAsTodo: {
              params: { id: todo.id, state: "to-do" } as Pick<
                z.infer<NonNullable<typeof upsertTodo.validator>>,
                "id" | "state"
              >,
            },
            markAsInProgress: {
              params: { id: todo.id, state: "in-progress" } as Pick<
                z.infer<NonNullable<typeof upsertTodo.validator>>,
                "id" | "state"
              >,
            },
            markAsDone: {
              params: { id: todo.id, state: "done" } as Pick<
                z.infer<NonNullable<typeof upsertTodo.validator>>,
                "id" | "state"
              >,
            },
          },
          [deleteTodo.endpoint]: {
            params: { id: todo.id } as z.infer<
              NonNullable<typeof deleteTodo.validator>
            >,
          },
        }),
      );
    }),
});

export const upsertTodo = hypermedia.endpoint("upsertTodo", {
  validator: z.object({
    id: z.number().nullish(),
    state: z.enum(TODO_STATES).nullish(),
    text: z.string().nullish(),
  }),
  procedure: (validator) =>
    publicProcedure.input(validator).mutation(async ({ input }) => {
      if (!input.state && !input.text) return;

      const update = db.updateTable("todo").set({
        state: input.state ?? undefined,
        text: input.text ?? undefined,
      });

      const insert = db.insertInto("todo").values({
        state: input.state ?? "to-do",
        text: input.text ?? "",
        createdAt: new Date().toISOString(),
      });

      if (!input.id) {
        await insert.execute();
      }

      const todo = await update.executeTakeFirst();
      if (!todo) await insert.execute();
    }),
});

export const deleteTodo = hypermedia.endpoint("deleteTodo", {
  validator: z.object({ id: z.number() }),
  procedure: (validator) =>
    publicProcedure.input(validator).mutation(async ({ input }) => {
      await db.deleteFrom("todo").where("id", "=", input.id).executeTakeFirst();
    }),
});
