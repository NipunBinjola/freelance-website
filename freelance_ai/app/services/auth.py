from passlib.context import CryptContext
from datetime import datetime, timedelta
# from jose import JWTError, jwt
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

# from ..database import SessionLocal
# from ..models.user import User
# from ..schemas import UserCreate, UserLogin
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import SessionLocal
from models.user import User
from schemas import UserCreate, User
# from ..config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, db: Session = None):
        self.db = db or SessionLocal()

    def get_user(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()

    def create_user(self, user: UserCreate):
        print("CREATE USER")
        hashed_password = pwd_context.hash(user.password)
        db_user = User(email=user.email, hashed_password=hashed_password)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, user: User):
        db_user = self.get_user_by_email(user.email)
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if not pwd_context.verify(user.password, db_user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return db_user

    # def create_access_token(self, user: User):
    #     expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    #     to_encode = {"sub": str(user.id), "exp": datetime.utcnow() + expires_delta}
    #     encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    #     return encoded_jwt

    # async def get_current_user(self, token: str = Depends(oauth2_scheme)):
    #     try:
    #         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    #         user_id: str = payload.get("sub")
    #         if user_id is None:
    #             raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    #     except JWTError:
    #         raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    #     user = self.get_user(user_id=user_id)
    #     if user is None:
    #         raise HTTPException(status_code=401, detail="User not found")
    #     return user