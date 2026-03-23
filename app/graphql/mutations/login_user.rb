# app/graphql/mutations/login_user.rb
module Mutations
  class LoginUser < BaseMutation
    # Arguments wrapped in the 'input' object by BaseMutation/Relay
    argument :email, String, required: true
    argument :password, String, required: true

    # Fields returned to the frontend
    field :token, String, null: true
    field :user, Types::UserType, null: true
    field :errors, [ String ], null: false

    def resolve(email:, password:)
      user = User.find_by(email_address: email.downcase.strip)

      if user&.authenticate(password)
        # Generate the JWT using your service
        token = JwtService.encode(user_id: user.id)

        {
          token: token,
          user: user,
          errors: []
        }
      else
        {
          token: nil,
          user: nil,
          errors: [ "Invalid email or password" ]
        }
      end
    rescue StandardError => e
      # Catch-all for database or JWT encoding issues
      {
        token: nil,
        user: nil,
        errors: [ e.message ]
      }
    end
  end
end
