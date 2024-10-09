class PushSubscription < ApplicationRecord
  validates :endpoint, presence: true, uniqueness: true
  validates :auth_key, presence: true
  validates :p256dh_key, presence: true
end
