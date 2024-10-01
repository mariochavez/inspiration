class PublishPhotoJob < ApplicationJob
  queue_as :default

  def perform
    last_published_at = Photo.published.last&.published_at
    return unless Time.zone.now.hour.between?(9, 18) && (last_published_at && last_published_at < 2.hours.ago)

    photo = Photo.unpublished.order(created_at: :asc).first
    return unless photo

    photo.update!(published_at: Time.zone.now)
  end
end
