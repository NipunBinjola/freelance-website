json.extract! job, :id, :title, :description, :freelancer_id, :client_id, :status, :rating, :review, :from_date, :to_date, :created_at, :updated_at
json.client job.client.name
if current_user.client?
  json.job_applications job.job_applications.to_a, as: :job_application, partial: 'job_applications/job_application'
else
  # If the user is a freelancer, send only job applications where freelancer_id = user.id
  json.job_applications job.job_applications.where(freelancer_id: current_user.id).to_a, as: :job_application, partial: 'job_applications/job_application'
end
