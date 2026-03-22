# app/controllers/concerns/authenticatable.rb
require "jwt"
module Authenticatable
  extend ActiveSupport::Concern

  included do
    # This makes the current_user available to your views/serializers
    attr_reader :current_user
  end

  def authenticate_by_jwt
    token = token_from_header
    if token.blank?
      return render json: { error: "Missing Token" }, status: :unauthorized
    end
    decoded = ::JwtService.decode(token)
    user_id = decoded["user_id"]
    if user_id.present?
      @current_user = User.find_by(id: user_id)
      render json: { error: "User not found" }, status: :unauthorized unless @current_user.present?
    else
      render json: { error: "Invalid token" }, status: :unauthorized
    end
  end

  private

  def token_from_header
    header = request.headers["Authorization"] || request.headers["HTTP_AUTHORIZATION"]

    if header.present? && header.start_with?("Bearer ")
      return header.split(" ").last
    end
    nil
  end

  def render_unauthorized(message)
    render json: { error: message }, status: :unauthorized
  end
end
