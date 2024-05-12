Rails.application.routes.draw do
  resources :chats, only: %i[create show]
  resources :chat_messages, only: %i[create]
  resources :jobs, only: %i[index show]
  resources :job_applications, only: %i[create]
  resources :user_profiles

  post 'login' => 'users#login'
  resources :users
  # get 'pages/home'
  root 'pages#home'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
