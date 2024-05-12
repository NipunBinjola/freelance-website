json.extract! chat, :id, :freelancer_id, :client_id, :job_id, :created_at, :updated_at
json.freelancer do
  json.id chat.freelancer_id
  json.name chat.freelancer.name
  json.profile_picture_url chat.freelancer.profile_picture_url
end
json.client do
  json.id chat.client_id
  json.name chat.client.name
  json.profile_picture_url chat.client.profile_picture_url
end
json.chat_messages chat.chat_messages.to_a, as: :chat_message, partial: 'chat_messages/chat_message'
