class ApplicationController < ActionController::Base
  protect_from_forgery
  before_action :set_current_user

  def set_current_user
    @current_user = User.find_by(authentication_token: request.headers.env['HTTP_AUTHORIZATION'])
    render json: { error: 'User not found' } if @current_user.nil?
  end
end
