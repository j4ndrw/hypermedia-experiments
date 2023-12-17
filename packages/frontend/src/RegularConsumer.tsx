import { ChangeEvent, useState } from "react";
import { apiHost } from "./api/trpc";

type Todo = {
  id: string;
  state: "to-do" | "in-progress" | "done";
  text: string;
};

function App() {
  const [newTodo, setNewTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleCreateTodo = (text: string) => async () => {
    const upsertResponse = await fetch(`${apiHost}/upsertTodo`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    const upsertJson = (await upsertResponse.json()).result.data;
    if (
      "actions" in upsertJson &&
      "getTodos" in upsertJson.actions &&
      !!upsertJson.actions.getTodos.endpoint
    ) {
      const getResponse = await fetch(
        `${apiHost}/${upsertJson.actions.getTodos.endpoint}`,
      );
      const todos = (await getResponse.json()).result.data;
      setTodos(todos.map((todo: { data: Todo }) => todo.data));
    }
  };

  const handleNewTodoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  if (!todos) return <></>;

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
          <div key={todo.id} className="flex flex-row">
            <p>{todo.text}</p>
            <div>
              <p>To Do</p>
              <input type="radio" checked={todo.state === "to-do"} />
            </div>
            <div>
              <p>In Progress</p>
              <input type="radio" checked={todo.state === "in-progress"} />
            </div>
            <div>
              <p>Done</p>
              <input type="radio" checked={todo.state === "done"} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
