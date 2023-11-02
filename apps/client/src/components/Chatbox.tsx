import { ChatMessage } from '@dupme/shared-types';
import { useEffect, useRef, useState } from 'react';

import { MySwal } from '../common/alert';
import { socket } from '../common/socket';
import { useGame } from '../contexts/GameContext';

export function Chatbox() {
  const { me } = useGame();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const msgRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onNewMessage = (message: ChatMessage) => {
      setMessages((m) => [...m, message]);
    };
    socket.on('msg', onNewMessage);
    return () => {
      socket.off('msg', onNewMessage);
    };
  }, []);

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="h-[200px] p-4 overflow-auto flex flex-col gap-2" ref={msgRef}>
        {messages.map((message, idx) => (
          <div
            className={`text-lg ${message.socketId === me?.socketId ? 'self-end' : 'self-start'}`}
            key={message.socketId + idx}
          >
            <div className="flex gap-2 items-end">
              <img
                className={`w-10 h-10 object-cover rounded-full border-gray-400 border ${
                  message.socketId !== me?.socketId ? 'block' : 'hidden'
                }`}
                src={message.profilePicture}
              />
              <div className="flex flex-col">
                <span className={`text-xs ${message.socketId === me?.socketId ? 'self-end' : 'self-start'}`}>
                  {message.name}
                </span>
                <span className="border border-gray-400 rounded-full px-2 py-1 text-base">{message.message}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <form className="relative bg-neutral-200 p-4 self-stretch flex w-full items-start justify-between gap-5 max-md:flex-wrap rounded-b-[30px]">
        <input
          className="text-neutral-500 text-xl font-semibold self-stretch w-[254px] max-w-full shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] bg-white grow basis-auto pt-2 pb-2 px-5 rounded-[50px] max-md:max-w-full max-md:pl-1"
          placeholder="Chat..."
          ref={messageRef}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!messageRef.current || messageRef.current.value === '') {
              MySwal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Message cannot be blank!',
              });
              return;
            }
            socket.emit('msg', messageRef.current.value);
            messageRef.current.value = '';
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="5" fill="#005853" />
            <path
              d="M25.3748 15.6775V38.5H21.6248V15.6775L11.5673 25.735L8.91602 23.0837L23.4998 8.5L38.0835 23.0837L35.4323 25.735L25.3748 15.6775Z"
              fill="white"
            />
          </svg>
        </button>
      </form>
    </>
  );
}
