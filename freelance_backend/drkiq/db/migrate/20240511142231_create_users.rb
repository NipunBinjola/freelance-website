class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :password
      t.integer :user_type
      t.string :phone_number
      t.string :country
      t.string :city
      t.string :profile_picture_url
      t.string :authentication_token

      t.timestamps
    end
  end
end
