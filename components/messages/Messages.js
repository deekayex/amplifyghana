// components/Messages.js
import React, { useEffect, useState } from "react";
import { fetchMessages } from "./messagesService";
import './Messages.css'

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      const messagesList = await fetchMessages();
      setMessages(messagesList);
    };
    getMessages();
  }, []);

  useEffect(() => {
    console.log("Messages state updated:", messages);
  }, [messages]);

  return (
    <div className="inbox-menu">
      <h1 className="inbox-text">Inbox</h1>
      {messages.length > 0 ? (
        <ul>
          {messages.map(message => (
            <li key={message.id} className="inbox-message">
              <h2>{message.message}</h2>
              <p><strong>From:</strong> {message.senderName}</p>  <p>{message.email}</p>
              <p>{message.contactNumber}</p>
              <p>{message.timestamp}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No messages found.</p>
      )}
    </div>
  );
};

export default Messages;
