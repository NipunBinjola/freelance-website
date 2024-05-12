# from passlib.context import CryptContext
from datetime import datetime, timedelta
# from jose import JWTError, jwt
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session


# from ..database import SessionLocal
# from ..models.user import User
# from ..schemas import UserCreate, UserLogin
# from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import SessionLocal
from models.user import User
# from schemas import UserCreate, User
from langchain_community.llms import HuggingFaceHub
from langchain.memory import MongoDBChatMessageHistory
from langchain_community.document_loaders import JSONLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain.chains.query_constructor.base import AttributeInfo
from langchain_community.vectorstores import Chroma
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate

class Bot:
    def __init__(self, session_id,query,job_des,user_id):
        self.session_id = session_id
        self.query = query        
        self.job_des = job_des
        self.user_id = user_id
        

    def get_user(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()    

    def metadata_func(self,record: dict, metadata: dict) -> dict:

        metadata["name"] = record.get("name")
        metadata["about"] = record.get("about")
        metadata["country"] = record.get("country")
        metadata["city"] = record.get("city")    
        metadata["skills"] = record.get("skills")    
        metadata["experience"] = record.get("experiences")    
        
        return metadata

    metadata_field_info = [
        AttributeInfo(
            name="about",
            description="The brief description of the freelancer",
            type="string",
        ),
        AttributeInfo(
            name="country",
            description="The country of the freelancer",
            type="string",
        ),
        AttributeInfo(
            name="city",
            description="The city of the freelancer",
            type="string",
        ),  
        
    ]    

    def getDB(self):
        # ===========================================================================================
        loader = JSONLoader(
        file_path='./jj.json',
        jq_schema='.data[]',
        is_content_key_jq_parsable=True,
        text_content=False,
        metadata_func=self.metadata_func
        # json_lines=True
        )
        
        data = loader.load()            
        embeddings = HuggingFaceEmbeddings()

        doc_func = lambda x: x.page_content
        docs = list(map(doc_func, data))

        query_result = embeddings.embed_documents(docs)
        # ===========================================================================================
        # ids=[]
        # if len(ids) ==0:
        #     ids = [str(uuid.uuid1()) for _ in data]
        db = FAISS.from_documents(data, embeddings)
        db.save_local("faiss_index")

        db = FAISS.load_local("faiss_index", embeddings,allow_dangerous_deserialization=True)

        # db._persist_directory = "./data/db"
        # db.persist()
        # retriever = db.as_retriever()
        return db

    def init_conversation(self,llm):

            prompt = self.get_system_prompt()

            # chat with conversational memory
            return LLMChain(
                llm=llm,
                prompt=prompt,
                verbose=True,
            )

    def get_system_prompt(self,) -> ChatPromptTemplate:
            return ChatPromptTemplate(
                messages=[
                    SystemMessagePromptTemplate.from_template(
                        """
                        Using the provided freelancer's ProfileData, please respond to the question below based only on the following ProfileData which is a json data of a person's profile: For experience of the person, talk about the experiences which is listed under the key "experiences" in the ProfileData context. For the person's completed/ongoing projects, talk about the projects which is listed under the key "jobs" in the ProfileData. For the person's skills, talk about the skills which are listed under the key "skills" in the ProfileData. For the person's reviews, talk about the reviews which is listed under the key "reviews" in the ProfileData. For the person's social links, talk about the social links which is listed under the key "social_links" in the ProfileData. For the person's pricing per day, talk about the pricing per day which is listed under the key "pricing" in the ProfileData.
                        For all unrelated queries politely decline.
                        Remember you have to only provide the direct answer to the user's query
                        """
                    ),
                    HumanMessagePromptTemplate.from_template(
                        """                        
                        Question: {question}
                        ProfileData: {context}                               
                        """
                    )
                ],
            )

    def get_history(self, message: str):
            # Add messages to history
            connection_string = "mongodb://usr:pas@localhost:27015/test"
            message_history = MongoDBChatMessageHistory(
                connection_string=connection_string, session_id=self.session_id
            )
            message_history.add_user_message(message)
            return message_history        

    def invokeQuery(self,db):
        # ************************************************************************************************************************************************
        # ************************************************************************************************************************************************        
        input_documents = db.similarity_search(self.query, filter={"name":self.user_id})        
        # ************************************************************************************************************************************************
        # ************************************************************************************************************************************************

        # ==============================================================================================================================
        # ==============================================================================================================================
        template = """Answer the question based only on the following context which is a json data of a person's profile: For experience of the person, talk about the experiences which is listed  under the key "experiences" in the json data. For the person's completed/ongoing projects, talk about the projects which is listed under the key "jobs" in the json data. For the person's reviews, talk about the reviews which is listed under the key "reviews" in the json data. For the person's social links, talk about the social links which is listed under the key "social_links" in the json data. For the person's pricing per day, talk about the pricing per day which is listed under the key "pricing" in the json data.
        {context}

        Question: {question}
        """    

        history = self.get_history(self.query)
        conversation=self.init_conversation(LLM)
        answer = conversation.predict(question=self.query, context=input_documents, chat_history=history.messages)    
        return answer
    def triggerQuery(self):                
        return self.invokeQuery(self.getDB()) 


    # ==============================================================================================================================
    # ==============================================================================================================================
def getLLM():
    huggingfacehub_api_token = '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'
    return HuggingFaceHub(repo_id='tiiuae/falcon-7b-instruct', huggingfacehub_api_token=huggingfacehub_api_token)

LLM = getLLM()

    # if __name__ == "__main__":
    #     
    #     db = getDB()
    #     invokeQuery(llm,db,"I have a job posting for Content Writer, sill Saurabh be a good fit given his past experiences. talk in detail about them.")