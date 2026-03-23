module Mutations
  class CreateTodo < BaseMutation
    argument :title, String, required: true

    field :todo, Types::TodoType, null: true
    field :errors, [ String ], null: false

    def resolve(title:)
      user = context[:current_user]

      if user.nil?
        return { todo: nil, errors: [ "You must be logged in to create a task." ] }
      end

      todo = user.todos.build(title: title, completed: false)

      if todo.save
        { todo: todo, errors: [] }
      else
        { todo: nil, errors: todo.errors.full_messages }
      end
    end
  end
end
