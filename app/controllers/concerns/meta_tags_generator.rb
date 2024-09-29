module MetaTagsGenerator
  extend ActiveSupport::Concern

  included do
    before_action :set_default_meta_tags
  end

  def generate_meta_tags(resource)
    case resource
    when Photo
      generate_photo_meta_tags(resource)
    end
  end

  private

  def set_default_meta_tags
    set_meta_tags(
      site: t("title"),
      reverse: true,
      separator: "|",
      description: t("description"),
      keywords: t("keywords"),
      author: t("author"),
      og: {
        site_name: t("title"),
        type: "website",
        url: request.original_url,
        image: view_context.image_url("heroimage.jpg")
      },
      twitter: {
        card: "summary_large_image",
        site: "@mario_chavez",
        image: view_context.image_url("heroimage.jpg")
      }
    )
  end

  def generate_photo_meta_tags(photo)
    set_meta_tags(
      title: photo.author,
      description: photo.meta_description,
      keywords: "#{t("keywords")}, #{photo.author}, #{photo.project}",
      og: {
        title: photo.author,
        description: photo.meta_description,
        type: "article",
        url: photo_url(photo),
        image: rails_blob_url(photo.image.variant(:page))
      },
      twitter: {
        card: "summary_large_image",
        title: photo.author,
        description: photo.meta_description,
        image: rails_blob_url(photo.image.variant(:page))
      },
      article: {
        published_time: photo.published_at&.iso8601,
        modified_time: photo.updated_at.iso8601,
        author: photo.author
      }
    )
  end
end
