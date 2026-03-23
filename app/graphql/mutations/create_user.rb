module Mutations
  class CreateUser < BaseMutation
    argument :email, String, required: true
    argument :password, String, required: true
    argument :password_confirmation, String, required: true

    field :token, String, null: true
    field :user, Types::UserType, null: true
    field :errors, [ String ], null: false

    def resolve(email_address:, password:, password_confirmation:)
      user = User.new(
        email_address: email,
        password: password,
        password_confirmation: password_confirmation
      )

      token = JwtService.encode({ user_id: @user.id })

      if user.save
        { token: token, user: user, errors: [] }
      else
        { token: nil, user: nil, errors: user.errors.full_messages }
      end
    end
  end
end
