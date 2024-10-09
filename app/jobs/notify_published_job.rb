class NotifyPublishedJob < ApplicationJob
  queue_as :default

  def perform
    PushSubscription.find_in_batches(batch_size: 50) do |subscriptions|
      subscriptions.each do |subscription|
        PushNotificationNotifier.notify(subscription, I18n.t("push_notifications.title"), I18n.t("push_notifications.description"))
      end
    end
  end
end
