import { useState } from "react";

export default function useGetChatMessages(chatId) {

    const [chats, setChats] = useState({
        chatId: chatId,
        me: isAuthenticated().user.id,
        other: null,
        messages: []
    });

    useEffect(() => {
        let delay = 1000;
        let timeout = null;

        const updateChat = () => {
            console.log("hell")
            getAllChats(chatId).then(data => {
            // you must also consider passing a timestamp to the API call
            // so you only fetch the latest messages, instead of all of them every time
            // your state update would look like this:
            // setChatMessages((messages) => [...messages, fetchedChatMessages]);
            setChats({...chats, messages: data["chat_messages"]});
            // reset the delay in case an error has happened and changed it.
            delay = 1000;
            // now call the API again after 1 second
            timeout = setTimeout(updateChat, delay);
            }).catch(error => {
            // exponential backoff here.
            // 1 - the first error will call the API after 2sec
            // 2 - the second error will call the API after 4 sec
            // 3 - the third error will call the API after 8 sec
            // and so on
            console.error("Could not update chat. waiting a bit...", error);
            delay = delay * 2;
            timeout = setTimeout(updateChat, delay);
            });
        }
    }

    
    
    )

    return () => timeout && clearTimeout(timeout)

}