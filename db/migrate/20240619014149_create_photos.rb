class CreatePhotos < ActiveRecord::Migration[8.0]
  def change
    create_table :photos do |t|
      t.string :author, null: false
      t.string :project
      t.string :url
      t.string :ulid, default: -> { "ulid()" }
      t.datetime :published_at

      t.timestamps
    end

    add_index :photos, :ulid, unique: true
    add_index :photos, :published_at
  end
end
