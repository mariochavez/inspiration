class PushNotificationNotifier
  include ActionView::Helpers::AssetUrlHelper

  def initialize(subscription, title, body, path)
    @subscription = subscription
    @title = title
    @body = body
    @path = path
  end

  def notify
    WebPush.payload_send(
      message: message,
      endpoint: @subscription.endpoint,
      p256dh: @subscription.p256dh_key,
      auth: @subscription.auth_key,
      vapid: {
        subject: "mailto:mario@f64.io",
        public_key: Rails.application.credentials.vapid.public_key,
        private_key: Rails.application.credentials.vapid.private_key,
        expiration: 12 * 60 * 60 # 12 hours
      }
    )
  rescue WebPush::Unauthorized => e
    Rails.logger.error "Push notification authorization failed: #{e.message}"
    Rails.logger.error "Response body: #{e.response.body}" if e.response
  rescue WebPush::ResponseError => e
    Rails.logger.error "Push notification failed: #{e.message}"
    Rails.logger.error "Response body: #{e.response.body}" if e.response
  end

  def self.notify(subscription, title, body, path = "/")
    new(subscription, title, body, path).notify
  end

  private

  def message
    JSON.generate(title: @title, options: {body: @body, icon: icon_path, data: {path: @path}})
  end

  def icon_path
    asset_url(Rails.application.assets.resolver.resolve("icon-192x192.png"))
  end
end
