# frozen_string_literal: true
json.extract! user_profile, :about, :experiences, :skills, :pricing, :social_links, :created_at, :updated_at
json.rating do
  json.value user.rating
  json.overall_count user.rating_count
end
json.reviews user.reviews
json.jobs user.jobs_by_status.merge!(applied_jobs: user.applied_jobs)
