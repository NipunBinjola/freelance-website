class ChatsController < ApplicationController
  before_action :set_chat, only: %i[show]

  # # GET /chats or /chats.json
  # def index
  #   @chats = Chat.all
  # end

  # GET /chats/1 or /chats/1.json
  def show
    respond_to do |format|
      format.json { render :show, status: :ok }
    end
  end

  # # GET /chats/new
  # def new
  #   @chat = Chat.new
  # end

  # # GET /chats/1/edit
  # def edit
  # end

  # POST /chats or /chats.json
  def create
    @chat = Chat.new(chat_params)
    @job = Job.find_by(id: chat_params[:job_id])

    if @current_user.client?
      @chat.client_id = @current_user.id
      @chat.freelancer_id = chat_params[:freelancer_id]
    else
      @chat.client_id = @job.client_id
      @chat.freelancer_id = @current_user.id
    end

    respond_to do |format|
      if @chat.save
        format.json { render :show, status: :created }
      else
        format.json { render json: @chat.errors, status: :unprocessable_entity }
      end
    end
  end

  # # PATCH/PUT /chats/1 or /chats/1.json
  # def update
  #   respond_to do |format|
  #     if @chat.update(chat_params)
  #       format.html { redirect_to chat_url(@chat), notice: "Chat was successfully updated." }
  #       format.json { render :show, status: :ok, location: @chat }
  #     else
  #       format.html { render :edit, status: :unprocessable_entity }
  #       format.json { render json: @chat.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # # DELETE /chats/1 or /chats/1.json
  # def destroy
  #   @chat.destroy

  #   respond_to do |format|
  #     format.html { redirect_to chats_url, notice: "Chat was successfully destroyed." }
  #     format.json { head :no_content }
  #   end
  # end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_chat
    @chat = Chat.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def chat_params
    params.require(:chat).require(:job_id)
    if @current_user.client?
      params.require(:chat).permit(:job_id, :freelancer_id)
    else
      params.require(:chat).permit(:job_id)
    end
  end
end
