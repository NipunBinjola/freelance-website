class ChatMessage < ActiveRecord::Base
  belongs_to :chat
  belongs_to :user, optional: true

  def sender_user_type
    user_id.nil? ? 'BOT' : user.user_type
  end
end
