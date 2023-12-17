import { ChangeEvent, useState } from "react";
import { trpc } from "./api/trpc";

function App() {
  const [newTodo, setNewTodo] = useState<string>("");
  const { data: todos, ...getTodosState } = trpc.react.getTodos.useQuery();
  const { mutate: upsertTodo } = trpc.react.upsertTodo.useMutation();

  const handleCreateTodo = (text: string) => () => {
    upsertTodo(
      { text },
      {
        onSuccess: (data) => {
          if ("actions" in data && "getTodos" in data.actions) {
            getTodosState.refetch();
          }
        },
      },
    );
  };

  const handleUpsert =
    (
      todo: NonNullable<typeof todos>[number],
      actionKey: Exclude<keyof typeof todo.actions.upsertTodo, "endpoint">,
    ) =>
      async () => {
        const response = await trpc.proxy[
          todo.actions.upsertTodo.endpoint
        ].mutate(todo.actions.upsertTodo[actionKey].params);
        if ("actions" in response && "getTodos" in response.actions) {
          getTodosState.refetch();
        }
      };

  const handleNewTodoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  if (!todos) return <></>;
  if (getTodosState.isLoading) <div>loading...</div>;

  return (
    <div className="flex flex-col">
      <div className="flex">
        <input type="text" onChange={handleNewTodoChange} />
        <button onClick={newTodo ? handleCreateTodo(newTodo) : undefined}>
          Add todo
        </button>
      </div>
      <div className="flex">
        {todos.map((todo) => (
          <div key={todo.data.id} className="flex flex-row">
            <p>{todo.data.text}</p>
            <div>
              <p>To Do</p>
              <input
                type="radio"
                checked={todo.data.state === "to-do"}
                onChange={handleUpsert(todo, "markAsTodo")}
              />
            </div>
            <div>
              <p>In Progress</p>
              <input
                type="radio"
                checked={todo.data.state === "in-progress"}
                onChange={handleUpsert(todo, "markAsInProgress")}
              />
            </div>
            <div>
              <p>Done</p>
              <input
                type="radio"
                checked={todo.data.state === "done"}
                onChange={handleUpsert(todo, "markAsDone")}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
