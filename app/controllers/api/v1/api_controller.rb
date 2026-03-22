# app/controllers/api/v1/api_controller.rb
module Api
  module V1
    class ApiController < ActionController::Base
      # This tells Rails: "If the CSRF token is missing, don't throw an error,
      # just provide a null session." Since we use JWTs, this is perfect.
      protect_from_forgery with: :null_session

      # Ensure your JWT logic is also here
      before_action :authenticate_by_jwt
    end
  end
end
