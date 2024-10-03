class HomeController < ApplicationController
  include JsonLdGenerator
  include MetaTagsGenerator

  def index
    @photos = Photo.published.with_attached_image.order(published_at: :desc).limit(10)
    set_meta
  end

  def show
    photo_id_param = params[:id].starts_with?("01j") ? {ulid: params[:id]} : {permalink: params[:id]}
    @photo = Photo.published.with_rich_text_description.with_attached_image.find_by!(photo_id_param)
    set_meta(@photo)
  end

  private

  def set_meta(resource = nil)
    @json_ld = generate_json_ld(resource)
    generate_meta_tags(resource) if resource.present?
  end
end
