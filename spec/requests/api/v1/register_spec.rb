require 'rails_helper'

RSpec.describe "Api::V1::Users", type: :request do
  describe "POST /api/v1/users" do
    let(:valid_params) do
      {
        user: {
          email_address: "new_developer@example.com",
          password: "password123",
          password_confirmation: "password123"
        }
      }
    end

    let(:invalid_params) do
      {
        user: {
          email_address: "bad-email",
          password: "123",
          password_confirmation: "456"
        }
      }
    end

    context "with valid parameters" do
      it "creates a new User" do
        expect {
          post api_v1_users_path, params: valid_params, as: :json
        }.to change(User, :count).by(1)
      end

      it "returns a 201 Created status and a fresh JWT" do
        post api_v1_users_path, params: valid_params, as: :json

        expect(response).to have_http_status(:created)

        json = JSON.parse(response.body)
        expect(json).to have_key("token")
        expect(json["user"]["email_address"]).to eq("new_developer@example.com")
      end

      it "automatically encodes the new user_id into the token" do
        # We check that JwtService was called with the ID of the user we just created
        expect(JwtService).to receive(:encode).with(hash_including(user_id: kind_of(Integer))).and_call_original
        post api_v1_users_path, params: valid_params, as: :json
      end
    end

    context "with invalid parameters" do
      it "does not create a User" do
        expect {
          post api_v1_users_path, params: invalid_params, as: :json
        }.not_to change(User, :count)
      end

      it "returns 422 Unprocessable Entity with error messages" do
        post api_v1_users_path, params: invalid_params, as: :json

        expect(response).to have_http_status(:unprocessable_content)

        json = JSON.parse(response.body)
        expect(json["errors"]).to be_an(Array)
        expect(json["errors"]).to include("Password confirmation doesn't match Password")
      end
    end
  end
end
