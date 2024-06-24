module Admin
  class PhotosController < ApplicationController
    def index
      @pagy, @photos = pagy(Photo.order(created_at: :desc))
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
      @photo = Photo.find_by!(ulid: params[:id])
    end

    def update
      @photo = Photo.find_by!(ulid: params[:id])

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
