module Types
  class MutationType < Types::BaseObject
    field :login_user, mutation: Mutations::LoginUser
    field :create_todo, mutation: Mutations::CreateTodo
    field :update_todo, mutation: Mutations::UpdateTodo
    field :toggle_todo, mutation: Mutations::ToggleTodo
    field :destroy_todo, mutation: Mutations::DestroyTodo
  end
end
