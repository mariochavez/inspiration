class HomeController < ApplicationController
  allow_unauthenticated_access
  include JsonLdGenerator
  include MetaTagsGenerator

  def index
    @pagy, @photos = pagy(Photo.published.with_attached_image.order(published_at: :desc), items: 4)
    set_meta

    respond_to do |format|
      format.html
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.append("photos", partial: "photos", locals: {photos: @photos, pagy: @pagy}),
          turbo_stream.remove("next-#{@pagy.page - 1}")
        ]
      end
    end
  end

  def show
    photo_id_param = params[:id].starts_with?("01j") ? {ulid: params[:id]} : {permalink: params[:id]}
    @photo = Photo.published.with_rich_text_description.with_attached_image.find_by!(photo_id_param)
    set_meta(@photo)
  end

  def share?
    true
  end

  private

  def set_meta(resource = nil)
    @json_ld = generate_json_ld(resource)
    generate_meta_tags(resource) if resource.present?
  end
end
