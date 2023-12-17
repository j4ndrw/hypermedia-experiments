import { ColumnType, Generated, Selectable } from "kysely";
import { TODO_STATES } from "./constants";

export interface Database {
  todo: TodoTable;
}

export interface TodoTable {
  id: Generated<string>;
  text: string;
  state: (typeof TODO_STATES)[number];
  createdAt: ColumnType<Date, string | undefined, never>;
}

export type Todo = Selectable<TodoTable>;
