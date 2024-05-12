class JobApplicationsController < ApplicationController
  # before_action :set_job_application, only: %i[show edit update destroy]
  before_action :validate_user_type, only: %i[create]

  # # GET /jobs or /jobs.json
  # def index
  #   @jobs = Job.all.pending
  #   @jobs = @jobs.where(client_id: @current_user.id) if @current_user.client?
  #   respond_to do |format|
  #     format.json { render :index }
  #   end
  # end

  # # GET /jobs/1 or /jobs/1.json
  # def show
  #   respond_to do |format|
  #     format.json { render :show }
  #   end
  # end

  # POST /jobs or /jobs.json
  def create
    @job_application = JobApplication.pending.new(job_application_params)
    @job_application.freelancer_id = @current_user.id

    respond_to do |format|
      if @job_application.save
        format.json { render :show, status: :created }
      else
        format.json { render json: @job_application.errors, status: :unprocessable_entity }
      end
    end
  end

  # # PATCH/PUT /jobs/1 or /jobs/1.json
  # def update
  #   respond_to do |format|
  #     if @job.update(job_params)
  #       format.html { redirect_to job_url(@job), notice: "Job was successfully updated." }
  #       format.json { render :show, status: :ok, location: @job }
  #     else
  #       format.html { render :edit, status: :unprocessable_entity }
  #       format.json { render json: @job.errors, status: :unprocessable_entity }
  #     end
  #   end
  # end

  # # DELETE /jobs/1 or /jobs/1.json
  # def destroy
  #   @job.destroy

  #   respond_to do |format|
  #     format.html { redirect_to jobs_url, notice: "Job was successfully destroyed." }
  #     format.json { head :no_content }
  #   end
  # end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_job_application
    @job_application = JobApplication.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def job_application_params
    params.require(:job_application).permit(:job_id)
  end

  def validate_user_type
    render json: { error: 'Not allowed' } unless @current_user.freelancer?
  end
end
