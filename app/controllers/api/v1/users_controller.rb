# app/controllers/api/v1/users_controller.rb
module Api
  module V1
    class UsersController < ApiController
      # We skip the JWT check because the user doesn't have a token yet!
      skip_before_action :authenticate_by_jwt, only: [:create]

      def create
        @user = User.new(user_params)

        if @user.save
          # Create a fresh token for the new user
          token = JwtService.encode({ user_id: @user.id })
          
          render json: {
            token: token,
            user: { id: @user.id, email_address: @user.email_address }
          }, status: :created
        else
          # Return 422 so Axios hits the 'catch' block in React
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_content
        end
      end

      private

      def user_params
        params.require(:user).permit(:email_address, :password, :password_confirmation)
      end
    end
  end
end
