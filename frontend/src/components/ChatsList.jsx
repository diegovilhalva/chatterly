import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

const ChatsList = () => {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;
  console.log(chats)

  return (
    <>
      {chats?.map((chat) => {
        const lastMessage = chat.lastMessage;
        const lastMessageText = lastMessage
          ? lastMessage.image
            ? "📷 Foto"
            : lastMessage.text
          : "Sem mensagens";

        const lastMessageTime = lastMessage
          ? new Date(lastMessage.createdAt).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        return (
          <div
            key={chat._id}
            className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
            onClick={() => setSelectedUser(chat)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`avatar ${onlineUsers.includes(chat._id) ? "online" : "offline"}`}
              >
                <div className="size-12 rounded-full">
                  <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h4 className="text-slate-200 font-medium truncate">
                    {chat.fullName}
                  </h4>
                  {lastMessageTime && (
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                      {lastMessageTime}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm truncate">{lastMessageText}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ChatsList;
