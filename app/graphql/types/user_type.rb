# frozen_string_literal: true

module Types
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :email, String, null: false, method: :email_address
    field :password_digest, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :todos, [ Types::TodoType ], null: false
    field :incomplete_todo_count, Integer, null: false

    def incomplete_todo_count
      object.todos.where(completed: false).count
    end
  end
end
