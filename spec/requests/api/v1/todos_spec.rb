require 'rails_helper'

RSpec.describe "Api::V1::Todos", type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:token) { JwtService.encode(user_id: user.id) }
  let(:headers) { { "Authorization" => "Bearer #{token}" } }

  describe "GET /api/v1/todos" do
    it "returns only the current user's todos in descending order" do
      create(:todo, user: user, created_at: 1.day.ago, title: "Older")
      create(:todo, user: user, created_at: Time.current, title: "Newer")
      create(:todo, user: other_user, title: "Someone else's")

      get api_v1_todos_path, headers: headers, as: :json

      json = JSON.parse(response.body)
      expect(json.size).to eq(2)
      expect(json.first["title"]).to eq("Newer")
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST /api/v1/todos" do
    let(:valid_params) { { todo: { title: "Complete Rails 8 Upgrade" } } }

    it "creates a todo for the authenticated user" do
      expect {
        post api_v1_todos_path, params: valid_params, headers: headers, as: :json
      }.to change(user.todos, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it "returns 422 when title is missing" do
      post api_v1_todos_path, params: { todo: { title: "" } }, headers: headers, as: :json
      expect(response).to have_http_status(:unprocessable_content)
    end
  end

  describe "PATCH /api/v1/todos/:id" do
    let(:todo) { create(:todo, user: user, title: "Old Title") }

    it "updates the todo title" do
      patch api_v1_todo_path(todo), params: { todo: { title: "New Title" } }, headers: headers, as: :json
      expect(todo.reload.title).to eq("New Title")
      expect(response).to have_http_status(:ok)
    end

    it "prevents updating another user's todo" do
      others_todo = create(:todo, user: other_user)

      # Rails will raise ActiveRecord::RecordNotFound because of the scoped 'find'
      patch api_v1_todo_path(others_todo), params: { todo: { title: "Hack" } }, headers: headers, as: :json
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE /api/v1/todos/:id" do
    let!(:todo) { create(:todo, user: user) }

    it "deletes the todo" do
      expect {
        delete api_v1_todo_path(todo), headers: headers, as: :json
      }.to change(Todo, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end
end
