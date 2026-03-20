require 'rails_helper'

RSpec.describe "Api::V1::Sessions", type: :request do
  let(:user) { create(:user, email_address: "elliott@example.com", password: "password123") }
  
  describe "POST /api/v1/sessions" do
    context "with valid credentials" do
      let(:valid_params) { { email: user.email_address, password: "password123" } }

      it "returns a success status and a JWT token" do
        post api_v1_login_path, params: valid_params, as: :json
        
        expect(response).to have_http_status(:ok)
        
        json = JSON.parse(response.body)
        expect(json).to have_key("token")
        expect(json["user"]["email"]).to eq(user.email_address)
      end

      it "calls the JwtService to encode the user id" do
        # Testing that the service we expect is actually being used
        expect(JwtService).to receive(:encode).with(user_id: user.id).and_call_original
        post api_v1_login_path, params: valid_params, as: :json
      end
    end

    context "with invalid credentials" do
      it "returns unauthorized for a wrong password" do
        post api_v1_login_path, params: { email: user.email_address, password: "wrong_password" }, as: :json
        
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)["error"]).to eq("Invalid email or password")
      end

      it "returns unauthorized for a non-existent email" do
        post api_v1_login_path, params: { email: "ghost@example.com", password: "password123" }, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

end
