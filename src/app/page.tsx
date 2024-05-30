"use client"

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import SendAudio from './components/SendAudio';
import LikeButton from './components/LikeButton';
import Search from './components/Search';
import Online from './components/Online';

interface Message {
  username: string;
  message: string;
}

export default function Home() {
  const [username, setUserName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    Pusher.logToConsole = false;

    const pusher = new Pusher("eee8b3baf05b95a896c6", {
      cluster: "eu",
    });

    pusher.connection.bind("error", function (err: any) {
      console.error("WebSocket error:", err);
    });

    const channel = pusher.subscribe("my-chat");
    channel.bind("message", function (data: Message) {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch("https://my-chat-backend-sable.vercel.app/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        message,
      }),
    });

    console.log("mensaje enviado");
    setMessage("");
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredMessages = messages.filter((msg) =>
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen ">
      <div className="flex sm:items-center justify-between border-b-2 border-gray-200 p-5">
        <div className="flex items-center pl-2">
          <Online />
          <div className="flex flex-col ">
            <div className=" sm:text-xs lg:text-xl md:text-xl">
              <input
                className="text-gray-700 rounded p-1"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder='Enter your username'
              />
            </div>
            <span className="text-lg text-gray-600">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Search onSearch={handleSearch} />
          <LikeButton />
        </div>
      </div>

      <div
        id="messages"
        className="flex flex-col overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch min-h-[75vh] sm:min-h-[80vh] "
      >
         {filteredMessages.map((msg, index) => (
          <div key={index} className="chat-message">
            <div className="flex items-end justify-end">
              <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
                <div>
                  <span
                    className={`flex items-end justify-end ${
                      msg.username === username
                        ? "bg-blue-600 text-white"
                        : "bg-green-900 text-white"
                    } px-4 py-2 rounded-lg inline-block rounded-br-none`}
                  >
                    {msg.message}
                  </span>
                </div>
                <strong className="user-message">{msg.username}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        className="border-t-2 border-gray-200 p-3 item-center"
        onSubmit={handleSubmit}
      >
        <div className="relative flex gap-2">
          <SendAudio />

          <input
            type="text"
            placeholder="Write your message!"
            className="w-[80%] p-2 pl-12 focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 bg-gray-200 rounded-md"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="items-center inset-y-0 sm:flex">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none p-2"
            >
              <span className="font-bold">Send</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6 ml-2 transform rotate-90"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
