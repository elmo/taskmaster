# frozen_string_literal: true

class GraphqlController < ApplicationController
  # If accessing from outside this domain, nullify the session
  # This allows for outside API access while preventing CSRF attacks,
  # but you'll have to authenticate your user separately
  before_action :authenticate_by_jwt, unless: :public_operation?
  protect_from_forgery with: :null_session

  def execute
    operation = params[:operationName] || params[:operation_name]
    variables = prepare_variables(params[:variables])
    query = params[:query]
    context = {
      current_user: @current_user,
      session: session
    }

    variables = ensure_hash(params[:variables])

    result = TodoAppSchema.execute(query,
                                   variables: variables,
                                   context: context,
                                   operation_name: operation)
    begin

    render json: result
  rescue StandardError => e
    raise e unless Rails.env.development?
    handle_error_in_development(e)
   end
  end

  private

def ensure_hash(ambiguous_param)
  case ambiguous_param
  when String
    if ambiguous_param.present?
      ensure_hash(JSON.parse(ambiguous_param))
    else
      {}
    end
  when Hash, ActionController::Parameters
    ambiguous_param
  when nil
    {}
  else
    raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
  end
end

  def public_operation?
    [ "LoginUser", "SignUp" ].include?(params[:operationName])
  end

  def authenticate_by_jwt
    token = token_from_header
    p token
    return nil if token.blank?
    decoded = ::JwtService.decode(token)
    user_id = decoded["user_id"]
    @current_user = User.find(user_id)
  end

  def token_from_header
    header = request.headers["Authorization"] || request.headers["HTTP_AUTHORIZATION"]

    if header.present? && header.start_with?("Bearer ")
      return header.split(" ").last
    end
    nil
  end


  # Handle variables in form data, JSON body, or a blank value
  def prepare_variables(variables_param)
    case variables_param
    when String
      if variables_param.present?
        JSON.parse(variables_param) || {}
      else
        {}
      end
    when Hash
      variables_param
    when ActionController::Parameters
      variables_param.to_unsafe_hash # GraphQL-Ruby will validate name and type of incoming variables.
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{variables_param}"
    end
  end

  def handle_error_in_development(e)
    logger.error e.message
    logger.error e.backtrace.join("\n")

    render json: { errors: [ { message: e.message, backtrace: e.backtrace } ], data: {} }, status: 500
  end
end
