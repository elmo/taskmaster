import type React from "react";

// 1. Define the Shape of a Todo
export interface Todo {
	id: number;
	title: string;
	completed: boolean;
}

// 2. Define Props for TodoItem
interface TodoItemProps {
	todo: Todo;
	onToggle: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle }) => (
	<li className="flex items-center mb-2 p-2 hover:bg-gray-50 rounded">
		<input
			type="checkbox"
			checked={todo.completed}
			onChange={() => onToggle(todo)}
			className="mr-3 h-5 w-5 accent-blue-600 cursor-pointer"
		/>
		<span
			className={
				todo.completed ? "line-through text-gray-400" : "text-gray-700"
			}
		>
			{todo.title}
		</span>
	</li>
);

// 3. Define Props for TodoList
interface TodoListProps {
	todos: Todo[];
	onToggle: (todo: Todo) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onToggle }) => (
	<ul className="divide-y divide-gray-100">
		{todos.map((todo) => (
			<TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
		))}
	</ul>
);
