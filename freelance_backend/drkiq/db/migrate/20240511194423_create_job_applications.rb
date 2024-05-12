class CreateJobApplications < ActiveRecord::Migration[7.0]
  def change
    create_table :job_applications do |t|
      t.references :job, null: false, foreign_key: true
      t.integer :freelancer_id
      t.integer :status

      t.timestamps
    end
  end
end
