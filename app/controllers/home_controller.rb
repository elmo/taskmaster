class HomeController < ApplicationController
  include Authentication
  allow_unauthenticated_access

  def index
  end
end
