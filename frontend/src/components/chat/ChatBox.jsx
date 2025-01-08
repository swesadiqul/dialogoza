import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import UserList from "./UserList";

const ChatBox = () => {
  const { messages, sendMessage } = useContext(ChatContext);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="chat-box">
      <UserList />
      <MessageList messages={messages} />
      <MessageInput
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSend={handleSend}
      />
    </div>
  );
};

export default ChatBox;
