Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", :as => :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  get "service-worker" => "rails/pwa#service_worker", :as => :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", :as => :pwa_manifest

  get "feed", to: "rss#index", format: "rss"
  get "sitemap", to: "sitemap#index", defaults: {format: "xml"}

  resource :sessions, only: [:new, :create, :destroy]
  namespace :admin do
    resources :photos, except: [:show, :destroy]
  end

  scope "/admin" do
    mount MissionControl::Jobs::Engine, at: "/jobs"
  end
  get "/admin" => "admin/photos#index"

  resource :about, controller: :about, only: [:show]

  # Defines the root path route ("/")
  get "/:id" => "home#show", :constraints => {id: /[a-zA-Z0-9_-]{26}/}, :as => :photo
  root "home#index"
end
