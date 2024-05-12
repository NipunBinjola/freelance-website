json.extract! job_application, :id, :status, :created_at, :updated_at
json.client job_application.job.client.name
json.freelancer do
  json.id job_application.freelancer_id
  json.name job_application.freelancer.name
  json.rating do
    json.value job_application.freelancer.rating
    json.overall_count job_application.freelancer.rating_count
  end
  json.chat_id job_application.job.chats.find_by(
    client_id: job_application.job.client_id,
    freelancer_id: job_application.freelancer_id
  )&.id
end
