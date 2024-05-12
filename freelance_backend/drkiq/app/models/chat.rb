class Chat < ApplicationRecord
  belongs_to :job
  belongs_to :client, foreign_key: :client_id, class_name: 'User', optional: true
  belongs_to :freelancer, foreign_key: :freelancer_id, class_name: 'User', optional: true
  has_many :chat_messages, -> { order(:created_at) }
end
