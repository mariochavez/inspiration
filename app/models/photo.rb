class Photo < ApplicationRecord
  include PermalinkGenerator

  before_validation :generate_permalink, on: :create, if: -> { author.present? && project.present? }
  after_update_commit :notify_published, if: -> { published? }

  has_rich_text :description

  has_one_attached :image do |attachable|
    attachable.variant :page, resize_to_limit: [900, 900]
    attachable.variant :thumb, resize_to_limit: [48, 48]
  end

  validates :author, :image, :permalink, presence: true

  scope :published, -> { where.not(published_at: nil) }
  scope :unpublished, -> { where(published_at: nil) }

  def published?
    published_at.present?
  end

  def landscape?
    return true if !image.attached?
    image.blob.metadata[:width].to_i > image.blob.metadata[:height].to_i
  end

  def to_param
    permalink
  end

  def meta_description
    "#{author} :: #{project}. #{description.to_plain_text.truncate(130)}".strip
  end

  def notify_published
    Rails.logger.info("Notify published")
    NotifyPublishedJob.perform_later
  end
end
