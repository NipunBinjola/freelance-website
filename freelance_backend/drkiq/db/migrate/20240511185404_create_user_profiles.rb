class CreateUserProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :user_profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.text :about
      t.jsonb :experiences
      t.jsonb :skills
      t.jsonb :pricing
      t.jsonb :social_links

      t.timestamps
    end
  end
end
