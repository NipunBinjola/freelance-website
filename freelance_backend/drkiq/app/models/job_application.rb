class JobApplication < ApplicationRecord
  belongs_to :job
  belongs_to :freelancer, foreign_key: :freelancer_id, class_name: 'User'

  enum status: %i[pending accepted rejected]
end
