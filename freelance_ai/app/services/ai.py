import logging
from langchain.memory import MongoDBChatMessageHistory
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate

from langchain_community.vectorstores import Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import LLMChain

class ChatService:
    conversation = None

    def __init__(self) -> None:
        print("Chat service initialized")
    
    def get_system_prompt(self) -> ChatPromptTemplate:
        return ChatPromptTemplate(
            messages=[
                SystemMessagePromptTemplate.from_template(
                    """
                    You are an Insurance Bot tasked with providing answers about the insurance queries, based on its policy documentation.
                    For all unrelated queries politely decline.
                    Remember you have to only provide the direct answer to the user's query.
                    """
                ),
                HumanMessagePromptTemplate.from_template(
                    """
                    Using the provided insurance policy documentation, please respond to the question below:
                    Question: {question}
                    Relevant Documents: {input_documents}
                    Previous Chat History: {chat_history}
                    """
                )
            ],
        )
    
    def init_conversation(self):

        prompt = self.get_system_prompt()

        # chat with conversational memory
        return LLMChain(
            llm=ChatOpenAI(temperature=0.7, model_name="gpt-4", max_tokens=1024),
            prompt=prompt,
            verbose=True,
        )

    def get_history(self, message: str, session_id: str):
        # Add messages to history
        connection_string = "mongodb://usr:pas@localhost:27015/test"
        message_history = MongoDBChatMessageHistory(
            connection_string=connection_string, session_id=session_id
        )
        message_history.add_user_message(message)
        return message_history
    
    def get_response(self, question: str, session_id: str):
        # Get history
        history = self.get_history(question, session_id)
        chrome_db = self.get_retriever()
        input_documents = chrome_db.similarity_search(question, filter={"sum_insured":"$50K"})
        conversation = self.init_conversation()
        answer = conversation.predict(question=question, input_documents=input_documents, chat_history=history.messages)
        logging.info("got response from llm - %s", answer)
        return answer
    
    def get_retriever(self):
        # Initialize Chroma DB
        embeddings = OpenAIEmbeddings()
        # Load the Chroma database from disk
        chroma_db = Chroma(persist_directory="/app/chroma_db", 
                   embedding_function=embeddings)
        return chroma_db