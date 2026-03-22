module Api
  module V1
    class SessionsController < ApplicationController
      include Authenticatable
      skip_before_action :verify_authenticity_token, raise: false
      def create
        user = User.find_by(email_address: params[:email].downcase)

        if user&.authenticate(params[:password])
          # Generate token (Assuming you have a WebToken helper or logic in User model)
          token = JwtService.encode(user_id: user.id)

          render json: {
            token: token,
            user: { id: user.id, email: user.email_address }
          }, status: :ok
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def destroy
        # With JWT, 'logging out' is usually handled by the client
        # deleting the token, but you can implement blacklisting here.
        head :no_content
      end
    end
  end
end
