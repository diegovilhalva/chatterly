import { useEffect, useRef } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useChatStore } from "../store/useChatStore"
import ChatHeader from "./ChatHeader"
import NoChatHistoryPlaceHolder from "./NoChatHistoryPlaceHolder"
import MessageLoadingSkeleton from "./MessageLoadingSkeleton"
import MessageInput from "./MessageInput"
import MessageItem from "./MessageItem"

const ChatContainer = () => {
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading, subscribeToMessages,
    unsubscribeFromMessages } = useChatStore()
  const { authUser } = useAuthStore()
  const messageEndRef = useRef(null);


  useEffect(() => {
    getMessagesByUserId(selectedUser._id)

    subscribeToMessages()
    return () => unsubscribeFromMessages()
  }, [selectedUser, getMessagesByUserId,subscribeToMessages,unsubscribeFromMessages])

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="md:max-w-3xl  mx-auto space-y-6">
            {messages.map((msg) => (
              <MessageItem key={msg._id} msg={msg} isOwn={msg.senderId === authUser._id} />
            ))}
          </div>
        ) : isMessagesLoading ? (
          <MessageLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceHolder name={selectedUser.fullName} />
        )}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </>
  )
}

export default ChatContainer