import { useCallback, useEffect, useState } from "react";
import api from "../../utils/api"; // Assuming this is your Axios instance
import Login from "./Login";
import Register from "./Register";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [authMode, setAuthMode] = useState("login");
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setTodos([]);
  }, []);

  // 1. Fetch Todos via Query
  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const GET_TODOS = `
      query {
        todos {
          id
          title
          completed
        }
      }
    `;
    try {
      const { data } = await api.post("/graphql", { query: GET_TODOS });
      setTodos(data.data.todos); // GraphQL nesting: data -> data -> todos
    } catch (err) {
      setError("Could not load tasks.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Add Todo via Mutation
  const handleAddTodo = async (title) => {
    const CREATE_TODO = `
      mutation CreateTodo($title: String!) {
        createTodo(input: { title: $title }) {
          todo { id title completed }
          errors
        }
      }
    `;
    try {
      const { data } = await api.post("/graphql", { 
        query: CREATE_TODO, 
        operationName: "CreateTodo",
        variables: { title } 
      });
      const newTodo = data.data.createTodo.todo;
      setTodos((prev) => [newTodo, ...prev]);
    } catch (_err) {
      setError("Failed to add task.");
    }
  };

  // 3. Toggle Todo via Update Mutation
  const handleToggleTodo = async (todo) => {
    const UPDATE_TODO = `
      mutation UpdateTodo($id: ID!, $completed: Boolean!) {
        updateTodo(input: { id: $id, completed: $completed }) {
          todo { id title completed }
          errors
        }
      }
    `;
    try {
      const { data } = await api.post("/graphql", {
        query: UPDATE_TODO,
        variables: { id: todo.id, completed: !todo.completed }
      });
      const updated = data.data.updateTodo.todo;
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (_err) {
      setError("Failed to update task.");
    }
  };

  // 4. Delete Todo via Destroy Mutation
  const handleDeleteTodo = async (id) => {
    const DESTROY_TODO = `
      mutation DestroyTodo($id: ID!) {
        destroyTodo(input: { id: $id }) {
          id
          errors
        }
      }
    `;
    try {
      await api.post("/graphql", { 
        query: DESTROY_TODO, 
        variables: { id } 
      });
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("Could not delete task.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchTodos();
  }, [isAuthenticated, fetchTodos]);

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				{authMode === "login" ? (
					<Login
						onLoginSuccess={() => setIsAuthenticated(true)}
						onSwitchToRegister={() => setAuthMode("register")}
					/>
				) : (
					<Register
						onRegisterSuccess={() => setIsAuthenticated(true)}
						onSwitchToLogin={() => setAuthMode("login")}
					/>
				)}
			</div>
		);
	}
  
  return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-2xl border border-gray-100">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-extrabold text-gray-800">Tasks</h1>
				<button
					type="button" // 3. Changed from "submit" to "button"
					onClick={handleLogout}
					className="text-sm text-gray-400 hover:text-red-500 transition-colors"
				>
					Logout
				</button>
			</div>

			<TodoForm onAdd={handleAddTodo} isLoading={isLoading} />

			{error && (
				<div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
					{error}
				</div>
			)}

			<TodoList
				todos={todos}
				onToggle={handleToggleTodo}
				onDelete={handleDeleteTodo}
				isLoading={isLoading}
			/>
		</div>
  );
};

export default App;
