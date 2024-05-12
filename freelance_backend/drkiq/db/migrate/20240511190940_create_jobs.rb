class CreateJobs < ActiveRecord::Migration[7.0]
  def change
    create_table :jobs do |t|
      t.string :title
      t.text :description
      t.integer :freelancer_id
      t.integer :client_id
      t.integer :status
      t.float :rating
      t.text :review
      t.datetime :from_date
      t.datetime :to_date

      t.timestamps
    end
  end
end
