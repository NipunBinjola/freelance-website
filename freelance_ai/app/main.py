from fastapi import FastAPI
from api.routes import router as api_router
from langchain_community.llms import HuggingFaceHub
from api.user import router as api_user_router
from api.bot import router as api_bot_router
from database import engine
from models.user import User

app = FastAPI()

# Include the API routes
app.include_router(api_router)
app.include_router(api_user_router)
app.include_router(api_bot_router)

# Create the database tables
def create_tables():
    from .models import Base
    User.metadata.create_all(bind=engine)

# Drop the database tables
def drop_tables():
    from .models import Base
    Base.metadata.drop_all(bind=engine)


# Run the application
if __name__ == "__main__":
    User.metadata.create_all(bind=engine)        
    app.run()