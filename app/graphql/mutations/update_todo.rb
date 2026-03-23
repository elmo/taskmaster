module Mutations
  class UpdateTodo < BaseMutation
    argument :id, ID, required: true
    argument :title, String, required: false
    argument :completed, Boolean, required: false

    field :todo, Types::TodoType, null: true
    field :errors, [ String ], null: false

    def resolve(id:, **attributes)
      user = context[:current_user]
      return { todo: nil, errors: [ "Unauthorized" ] } unless user
      todo = user.todos.find_by(id: id)
      if todo.nil?
        { todo: nil, errors: [ "Todo not found" ] }
      elsif todo.update(attributes)
        { todo: todo, errors: [] }
      else
        { todo: nil, errors: todo.errors.full_messages }
      end
    end
  end
end
