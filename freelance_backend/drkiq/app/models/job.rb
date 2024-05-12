class Job < ApplicationRecord
  belongs_to :client, foreign_key: :client_id, class_name: 'User'
  belongs_to :freelancer, foreign_key: :freelancer_id, class_name: 'User'
  has_many :chats

  has_many :job_applications

  enum status: %i[pending ongoing completed]
end
