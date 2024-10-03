class AddPermalinkToPhoto < ActiveRecord::Migration[8.0]
  def change
    add_column :photos, :permalink, :string
    add_index :photos, :permalink, unique: true
  end
end
