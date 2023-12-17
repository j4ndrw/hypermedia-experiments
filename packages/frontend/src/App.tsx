import { ChangeEvent, useState } from "react";
import { trpc } from "./api/trpc";

function App() {
  const [newTodo, setNewTodo] = useState<string>("");
  const { data: todos, ...getTodosState } = trpc.getTodos.useQuery();
  const { mutate: upsertTodo } = trpc.upsertTodo.useMutation();

  const handleUpsertAction =
    (...args: Parameters<typeof upsertTodo>) =>
    () => {
      upsertTodo(...args);
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
        <button
          onClick={newTodo ? handleUpsertAction({ text: newTodo }) : undefined}
        >
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
                title="To Do"
                checked={todo.data.state === "to-do"}
                onChange={handleUpsertAction(
                  todo.actions["upsertTodo"].markAsDone.params,
                )}
              />
            </div>
            <div>
              <p>In Progress</p>
              <input
                type="radio"
                checked={todo.data.state === "in-progress"}
                onChange={handleUpsertAction(
                  todo.actions["upsertTodo"].markAsInProgress.params,
                )}
              />
            </div>
            <div>
              <p>Done</p>
              <input
                type="radio"
                checked={todo.data.state === "done"}
                onChange={handleUpsertAction(
                  todo.actions["upsertTodo"].markAsDone.params,
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
