module Types
  class QueryType < Types::BaseObject
    field :node, Types::NodeType, null: true, description: "Fetches an object given its ID." do
      argument :id, ID, required: true, description: "ID of the object."
    end

    def node(id:)
      context.schema.object_from_id(id, context)
    end

    field :nodes, [ Types::NodeType, null: true ], null: true, description: "Fetches a list of objects given a list of IDs." do
      argument :ids, [ ID ], required: true, description: "IDs of the objects."
    end

    def nodes(ids:)
      ids.map { |id| context.schema.object_from_id(id, context) }
    end

    # Define the field
    field :todos, [ Types::TodoType ], null: false, description: "Returns a list of todos" do
      argument :completed, Boolean, required: false
    end

    field :me, Types::UserType, null: true, description: "Returns the currently logged-in user"

    def me
      context[:current_user]
    end

    def todos(completed: nil)
      user = context[:current_user]
      return [] unless user
      scope = user.todos
      scope = scope.where(completed: completed) unless completed.nil?
      scope.order(created_at: :desc)
    end
  end
end
