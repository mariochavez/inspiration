class RssController < ApplicationController
  def index
    @photos = Photo.published
      .with_rich_text_description.with_attached_image
      .order(published_at: :desc)
      .limit(1_000)

    respond_to do |format|
      format.rss { render layout: false }
    end
  end
end
