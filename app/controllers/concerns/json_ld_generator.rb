module JsonLdGenerator
  extend ActiveSupport::Concern

  included do
    helper_method :generate_json_ld
  end

  def generate_json_ld(resource = nil)
    case resource
    when Photo
      generate_photo_json_ld(resource)
    else
      generate_default_json_ld
    end
  end

  private

  def generate_photo_json_ld(photo)
    {
      "@context": "https://schema.org",
      "@type": "Photograph",
      name: photo.project,
      author: {
        "@type": "Person",
        name: photo.author
      },
      datePublished: photo.published_at&.iso8601,
      dateModified: photo.updated_at.iso8601,
      image: {
        "@type": "ImageObject",
        url: rails_blob_url(photo.image.variant(:page)),
        width: photo.image.variant(:page).blob.metadata[:width],
        height: photo.image.variant(:page).blob.metadata[:height]
      },
      description: photo.meta_description,
      url: photo_url(photo)
    }.to_json
  end

  def generate_default_json_ld
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: t("title"),
      author: {
        "@type": "Person",
        name: t("author")
      },
      description: t("description"),
      url: root_url
    }.to_json
  end
end
