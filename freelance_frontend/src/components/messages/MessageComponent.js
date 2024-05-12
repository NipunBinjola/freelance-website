import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { isAuthenticated } from "../../services/auth/auth";
import { humanPreciseDateFormat } from "../../services/humanDateFormat";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import { getAllJobs } from "../../services/jobs/jobs";
import { FaFacebookMessenger } from "react-icons/fa";
import { IconContext } from "react-icons";
import './MessageComponent.css'
import { getAllChats, sendMessage2 } from "../../services/chats/chats";

const myMessage = (name, message) => {
    return             <li class="d-flex justify-content-between mb-4">
    <div className="col-md-2" width="60"></div>
    <div class="card">
      <div class="card-header d-flex justify-content-between p-3">
        <p class="fw-bold mb-0">You</p>
      </div>
      <div class="card-body">
        <p class="mb-0">
          {message}
        </p>
      </div>
    </div>
  </li>
}

const otherMessageComp = (name, message) => {
    return <li class="d-flex justify-content-between mb-4">
    <div class="card w-100">
      <div class="card-header d-flex justify-content-between p-3">
        <p class="fw-bold mb-0">{name}</p>
      </div>
      <div class="card-body">
        <p class="mb-0">
          {message}
        </p>
      </div>
    </div>
    <div className="col-md-2" width="60"></div>
  </li>
}

const msgPrint = (msg) => {
    const myID = isAuthenticated()["user"]["id"];
    const inMine = msg["user"]["id"] == myID

    if(inMine) {
        return myMessage(msg["user"]["name"], msg["message"])
    } else {
        return otherMessageComp(msg["user"]["name"], msg["message"])
    }


}

const msgList = (msgData) => {
    return msgData.map(msgPrint);
}


const sendMessage = (e) => {
    let chatId = e.currentTarget.dataset.id
    let message = document.getElementById("textAreaExample2").value

    console.log(chatId);

    sendMessage2(chatId, message)

    document.getElementById("textAreaExample2").value = ""

}


const MessageScreen = (msgArr, chatId) => {
    return <section className="bgc">
    <div class="container py-5">
  
      <div class="row">

        <div className="col-md-2"></div>
  
        <div class="col-md-6 col-lg-7 col-xl-8">
  
          <ul class="list-unstyled">

            {msgList(msgArr)}
            
            <li class="bg-white mb-3">
              <div data-mdb-input-init class="form-outline">
                <textarea class="form-control" id="textAreaExample2" rows="4"></textarea>
                <label class="form-label" for="textAreaExample2">Message</label>
              </div>
            </li>
            <button  type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-info btn-rounded float-end" onClick={sendMessage} data-id={chatId}>Send</button>
          </ul>
  
        </div>
  
      </div>
  
    </div>
  </section>
}


const MessageComponent = () => {

    const myID = isAuthenticated()["user"]["id"];

    const { chatId } = useParams();

    const [chats, setChats] = useState({
        chatId: chatId,
        me: isAuthenticated().user.id,
        other: null,
        messages: []
    });


    useEffect(() => {
        const interval = setInterval(() => {
          getAllChats(chatId).then(data => {
            setChats({...chats, messages: data["chat_messages"]});
          });
        }, 2000);
  
        return () => {
          clearInterval(interval);
        };
    }, [chatId]);

    return <>
        {MessageScreen(chats["messages"], chatId)}
    </>
}

export default withRouter(MessageComponent)