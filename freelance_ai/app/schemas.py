from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserUpdate(BaseModel):
    name: str
    email: str

class Bot(BaseModel):
    session_id: str
    query: str
    job_des: str
