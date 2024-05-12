json.extract! chat_message, :message, :created_at, :updated_at
json.user do
  json.id chat_message.user_id
  json.name chat_message.user&.name
  json.user_type chat_message.sender_user_type
  json.message chat_message.message
end
