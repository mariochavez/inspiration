module Admin
  class PhotosController < ApplicationController
    before_action :authenticate_user!

    def index
      @pagy, @photos = pagy(Photo.with_attached_image.includes(image_attachment: :blob).order(created_at: :desc), items: 8)
    end

    def new
      @photo = Photo.new
    end

    def create
      @photo = Photo.new(secure_params)

      if @photo.save
        flash.notice = t("flash.photos.create.notice")
        redirect_to admin_photos_path
      else
        flash.now.alert = t("flash.photos.create.alert")
        render :new, status: :unprocessable_entity
      end
    end

    def edit
      @photo = Photo.find_by!(permalink: params[:id])
    end

    def update
      @photo = Photo.find_by!(permalink: params[:id])

      if @photo.update(secure_params)
        flash.notice = t("flash.photos.update.notice")
        redirect_to admin_photos_path
      else
        flash.now.alert = t("flash.photos.update.alert")
        render :edit, status: :unprocessable_entity
      end
    end

    private

    def secure_params
      params.require(:photo).permit(:author, :project, :image, :description, :url)
    end
  end
end
