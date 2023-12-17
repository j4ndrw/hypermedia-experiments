import z from "zod";
import { hypermedia } from "../../hypermedia";
import { TODO_STATES } from "../../db/constants";

const getTodo = hypermedia.contract({
  endpoint: "getTodo",
  validator: z.object({ id: z.string() }),
});

const getTodos = hypermedia.contract({
  endpoint: "getTodos",
});

const upsertTodo = hypermedia.contract({
  endpoint: "upsertTodo",
  validator: z.object({
    id: z.string().nullish(),
    state: z.enum(TODO_STATES).nullish(),
    text: z.string().nullish(),
  }),
});

const deleteTodos = hypermedia.contract({
  endpoint: "deleteTodo",
  validator: z.object({ id: z.string() }),
});

const TodoContracts = {
  getTodo,
  getTodos,
  upsertTodo: upsertTodo,
  deleteTodo: deleteTodos,
};
export default TodoContracts;
