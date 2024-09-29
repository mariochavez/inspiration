class SessionsController < ApplicationController
  rate_limit to: 4, within: 1.minute

  layout "security"

  def new
  end

  def create
    if (user = User.authenticate_by(email: params[:email], password: params[:password]))
      login(user)

      flash.notice = t(".notice")
      redirect_to admin_photos_path
    else
      flash.now.alert = t(".alert")
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    logout(Current.user)
    redirect_to root_path
  end
end
