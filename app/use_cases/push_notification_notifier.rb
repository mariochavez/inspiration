class PushNotificationNotifier
  def initialize(subscription, message)
    @subscription = subscription
    @message = message
  end

  def notify
    WebPush.payload_send(
      message: @message,
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

  def self.notify(subscription, message)
    new(subscription, message).notify
  end
end
