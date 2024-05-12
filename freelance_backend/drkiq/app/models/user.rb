class User < ApplicationRecord
  enum user_type: %i[freelancer client]

  has_one :user_profile
  has_many :jobs, foreign_key: :freelancer_id
  has_many :job_applications, foreign_key: :freelancer_id
  has_many :chats

  before_create :generate_auth_token

  def rating
    return unless jobs.completed.exists?

    jobs.completed.pluck(:rating).sum.fdiv(rating_count).round(2)
  end

  def rating_count
    return unless jobs.completed.exists?

    jobs.completed.size
  end

  def reviews
    return unless jobs.completed.exists?

    jobs.completed.map do |job|
      {
        client_name: job.client.name,
        review: job.review,
        rating: job.rating
      }
    end
  end

  def applied_jobs
    job_applications.pending.joins(:job).order(:from_date).map do |job_application|
      job = job_application.job
      {
        title: job.title,
        description: job.title,
        from_date: job.from_date,
        to_date: job.to_date,
        status: job.status,
        client_name: job.client.name
      }
    end
  end

  def jobs_by_status
    assigned_jobs = jobs.order(:from_date).map do |job|
      data = job.slice(:title, :description, :from_date, :to_date, :status)
      data[:client_name] = job.client.name
      data
    end
    assigned_jobs.group_by { |job| job[:status] }
  end

  def generate_auth_token
    loop do
      self.authentication_token = SecureRandom.urlsafe_base64(10)
      break unless User.exists?(authentication_token: authentication_token)
    end
  end
end
