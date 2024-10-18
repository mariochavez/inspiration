class ApplicationController < ActionController::Base
  include Pagy::Backend
  include SwitchLocale

  before_action :authenticate_user!

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  # allow_browser versions: :modern

  def self.allow_unauthenticated_access(**)
    skip_before_action(:authenticate_user!, **)
  end

  protected

  def authenticate_user!
    redirect_to new_sessions_path unless current_user
  end

  def current_user
    Current.user ||= authenticate_from_session
  end

  def user_signed_in?
    current_user.present?
  end

  def share?
    false
  end

  helper_method :current_user, :user_signed_in?, :share?

  private

  def authenticate_from_session
    User.find_by(id: session[:user_id])
  end

  def login(user)
    Current.user = user
    reset_session
    session[:user_id] = user.id
  end

  def logout(user)
    Current.user = nil
    reset_session
  end
end
