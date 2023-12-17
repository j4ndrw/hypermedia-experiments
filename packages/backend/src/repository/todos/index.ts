import { db } from "../../db";
import { Todo } from "../../db/types";
import { v4 } from "uuid";

const get = async ({ id }: { id: Todo["id"] }) =>
  db.selectFrom("todo").where("id", "=", id).selectAll().executeTakeFirst();

const getAll = async () => db.selectFrom("todo").selectAll().execute();

const upsert = async ({
  id,
  state,
  text,
}: {
  id?: Todo["id"] | null | undefined;
  state?: Todo["state"] | null | undefined;
  text?: Todo["text"] | null | undefined;
}) => {
  if (!state && !text) return;

  const update = db
    .updateTable("todo")
    .set({ state: state ?? undefined, text: text ?? undefined });
  const insert = db.insertInto("todo").values({
    id: v4(),
    state: state ?? "to-do",
    text: text ?? "",
    createdAt: new Date().toISOString(),
  });

  if (!id) return insert.execute();

  const todo = await update.execute();
  if (!todo) return insert.execute();
};

const remove = async ({ id }: { id: Todo["id"] }) =>
  db.deleteFrom("todo").where("id", "=", id).executeTakeFirst();

const TodoRepository = {
  get,
  getAll,
  upsert,
  remove,
};
export default TodoRepository;
