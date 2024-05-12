import { isAuthenticated } from "../auth/auth";

const { API } = require("../backend");

export const getAllChats = (chatId) => {
    return fetch(`${API}/chats/${chatId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated()["user"]["authentication_token"]
        }
    })
        .then(response => (response.json()))
        .catch(err => ({ error: "Please Check Your Internet Conenction" }));
}


export const sendMessage2 = (chatId, message) => {
    return fetch(`${API}/chat_messages`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Authorization": isAuthenticated()["user"]["authentication_token"]
        },
        body: JSON.stringify({
            chat_id: chatId,
            chat_message: {
                message: message
            }
        })
    })
        .then(response => (response.json()))
        .catch(err => ({ error: "Please Check Your Internet Conenction" }));
}