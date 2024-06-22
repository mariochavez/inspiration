module Admin
  class PhotosController < ApplicationController
    def index
      @photos = Photo.all
    end

    def new
      @photo = Photo.new
    end

    def create
      @photo = Photo.new(secure_params)

      if @photo.save
        redirect_to admin_photos_path
      else
        render :new
      end
    end

    def edit
      @photo = Photo.find(params[:id])
    end

    def update
      @photo = Photo.find(params[:id])

      if @photo.update(secure_params)
        redirect_to admin_photos_path
      else
        render :edit
      end
    end

    def show
      @photo = Photo.find(params[:id])
    end

    private

    def secure_params
      params.require(:photo).permit(:author, :project, :image, :description)
    end
  end
end
