class SitemapController < ApplicationController
  allow_unauthenticated_access

  def index
    @photos = Photo.published
      .with_rich_text_description.with_attached_image
      .order(published_at: :desc)
      .limit(50_000)

    respond_to do |format|
      format.xml
    end
  end
end
