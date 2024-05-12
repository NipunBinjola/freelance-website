class ChatMessagesController < ApplicationController
  # POST /chat_messages
  def create
    @chat_message = ChatMessage.create(chat_message_params)
    puts "chat_message #{@chat_message.inspect}"
    register_call_to_bot if @current_user.client?

    respond_to do |format|
      format.json { render :show, status: :ok }
    end
  end

  private

  # Only allow a list of trusted parameters through.
  def chat_message_params
    params.require(:chat_message).permit(:message).merge(
      user_id: @current_user.id, chat_id: params[:chat_id]
    )
  end

  def register_call_to_bot
    data = {
      session_id: @chat_message.chat_id,
      query: @chat_message.message,
      job_description: @chat_message.chat.job.description,
      user_name: @chat_message.chat.freelancer.name
    }
    puts "register_call_to_bot:data #{data}"
    response = HTTParty.post("#{ENV['AGI_HOST']}/getBotRes", body: data.to_json, timeout: 15)
    ChatMessage.create(chat: @chat_message.chat, message: response.body) if response.success?
  end
end
