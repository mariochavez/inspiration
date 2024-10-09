class CreatePushSubscriptions < ActiveRecord::Migration[8.0]
  def change
    create_table :push_subscriptions do |t|
      t.string :endpoint, null: false
      t.string :auth_key, null: false
      t.string :p256dh_key, null: false

      t.timestamps
    end

    add_index :push_subscriptions, :endpoint, unique: true
  end
end
