const TodoItem = ({ todo, onToggle }) => (
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

const _TodoList = ({ todos, onToggle }) => (
	<ul className="divide-y divide-gray-100">
		{todos.map((todo) => (
			<TodoItem key={todo.id} todo={todo} onToggle={onToggle} />
		))}
	</ul>
);
