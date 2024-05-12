class CreateChats < ActiveRecord::Migration[7.0]
  def change
    create_table :chats do |t|
      t.integer :freelancer_id
      t.integer :client_id
      t.integer :job_id

      t.timestamps
    end
  end
end
