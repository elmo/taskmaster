class RegistrationsController < ApplicationController
  include Authentication
  allow_unauthenticated_access only: [ :new, :create ]

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      # 2. 'start_new_session_for' is the Rails 8 helper that
      #    creates a session record and sets the signed cookie.
      start_new_session_for @user

      redirect_to root_path, notice: "Welcome aboard! You've successfully signed up."
    else
      # If validation fails (e.g., email already taken), show the form again
      render :new, status: :unprocessable_entity
    end
  end

  private

  def user_params
    # 3. Use Strong Parameters to prevent mass-assignment vulnerabilities
    params.require(:user).permit(:email_address, :password, :password_confirmation)
  end
end
