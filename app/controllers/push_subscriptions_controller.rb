class PushSubscriptionsController < ApplicationController
  allow_unauthenticated_access only: [:create, :destroy]
  skip_before_action :verify_authenticity_token, only: [:create, :destroy]

  def create
    subscription = PushSubscription.find_or_initialize_by(endpoint: params[:subscription][:endpoint])
    subscription.update!(
      auth_key: params[:subscription][:keys][:auth],
      p256dh_key: params[:subscription][:keys][:p256dh]
    )

    head :ok
  end

  def destroy
    subscription = PushSubscription.find_by(endpoint: params[:endpoint])
    subscription&.destroy

    head :ok
  end
end
