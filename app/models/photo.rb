class Photo < ApplicationRecord
  has_rich_text :description

  has_one_attached :image do |attachable|
    attachable.variant :landscape, resize_to_limit: [900, 900]
    attachable.variant :portrait, resize_to_limit: [750, 750]
    attachable.variant :thumb, resize_to_limit: [48, 48]
  end

  validates :author, :image, presence: true

  def published?
    published_at.present?
  end

  def landscape?
    return true if !image.attached?
    image.blob.metadata[:width] > image.blob.metadata[:height]
  end

  def to_param
    ulid
  end
end
