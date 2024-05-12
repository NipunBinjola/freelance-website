from fastapi import APIRouter,Request

# from models.user import User
# from models.user import User2
# from schemas import User as schemaUser
# from services.auth import AuthService
# from fastapi import Depends
from services.gen_ai import Bot

router = APIRouter()

@router.post("/getBotRes/")
async def get_bot_res(request: Request):
    question = await request.json() 
    b=Bot(session_id=question["session_id"], query=question["query"], job_des=question["job_description"], user_id=question["user_name"])    
    res=b.triggerQuery()    
    res = res.strip().split("\n                        \n")[-1]
    return res
    # return main4.invokeQuery(LLM,db,user_input) 
    # return db.query(User).all()

# @router.get("/users/{user_id}")
# def get_user_by_email(user_id: int, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.id == user_id).first()
#     if user:
#         return user
#     raise HTTPException(status_code=404, detail="User not found")


# @router.post("/users/")
# def create_user(user: UserCreate, db: Session = Depends(get_db)):
#     db_user = User(name=user.name, email=user.email, password=user.password)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user

# @router.put("/users/{user_id}")
# def update_user_by_email(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
#     db_user = db.query(User).filter(User.id == user_id).first()
#     if not db_user:
#         raise HTTPException(status_code=404, detail="User not found")
#     db_user.name = user.name
#     db_user.email = user.email
#     db.commit()
#     return {"message": "User updated successfully"}

# @router.delete("/users/{user_id}")
# def delete_user_by_email(user_id: int, db: Session = Depends(get_db)):
#     db_user = db.query(User).filter(User.id == user_id).first()
#     if not db_user:
#         raise HTTPException(status_code=404, detail="User not found")
#     db.delete(db_user)
#     db.commit()
#     return {"message": "User deleted successfully"}
