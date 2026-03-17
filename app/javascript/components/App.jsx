import React, { useState, useEffect } from "react";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetch("/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const addTodo = async (e) => {
	  // 1. Get the token (usually from localStorage or Context)
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to add a todo.");
      return;
    }
    e.preventDefault();
    // 1. Start Loading & Reset Errors
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
	      title: newTodo, 
	      userId: user.id,
	      completed: false }),
    });
    if (!response.ok) { // 2. Check if the server actually succeeded (e.g., 200 OK)
      throw new Error("Failed to save the todo. Please try again.");
    }
    const todo = await response.json();
    // 3. Success! Update state
    setTodos([todo, ...todos]);
    setNewTodo("");
  } catch (err) { // 4. Catch network or server errors
    setError(err.message);
    console.error("Submission Error:", err);
  } finally {
    setIsLoading(false); // 5. Always stop loading, whether success or failure
  }
};

  const toggleTodo = async (todo) => {
    await fetch(`/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    setTodos(todos.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4">Rails 8 + React Todos</h1>
      <form onSubmit={addTodo} className="flex mb-4">
        <input
          type="text"
          className="border p-2 flex-grow rounded-l"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r">Add</button>


      <button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Todo"}
      </button>

      </form>
      {error && (
       <div style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>
        ⚠️ Error: {error}
        <button onClick={() => setError(null)} style={{ marginLeft: '10px' }}>
          Clear
        </button>
       </div>
      )}

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo)}
              className="mr-2"
            />
            <span className={todo.completed ? "line-through text-gray-400" : ""}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
