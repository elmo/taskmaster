Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "*" # In production, use your actual domain
    resource "*",
      headers: :any, # This allows the Authorization header
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      expose: [ "Authorization" ]
  end
end
