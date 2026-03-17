class Api::V1::TodosController < ApplicationController
  skip_before_action :verify_authenticity_token
  def index
    @todos = Todo.order(created_at: :desc)
    render json: @todos
  end

  def create
    @todo = Todo.new(todo_params)
    if @todo.save
      render json: @todo, status: :created
    else
      render json: @todo.errors, status: :unprocessable_entity
    end
  end

  def update
    @todo = Todo.find(params[:id])
    @todo.update(todo_params)
    render json: @todo
  end

  def destroy
    Todo.find(params[:id]).destroy
    head :no_content
  end

  private

  def todo_params
    params.require(:todo).permit(:title, :completed)
  end
end
