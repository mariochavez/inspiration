class PublishPhotoJob < ApplicationJob
  queue_as :default

  def perform
    photo = Photo.unpublished.order(created_at: :asc).first
    return unless photo

    photo.update!(published_at: Time.zone.now)
  end
end
