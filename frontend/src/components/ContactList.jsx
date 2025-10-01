import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const ContactList = () => {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } = useChatStore()
  const { onlineUsers } = useAuthStore()

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => {
        const isOnline = onlineUsers.includes(contact._id);

        let statusText = "Offline";
        if (isOnline) {
          statusText = "Online";
        } else if (contact.lastSeen) {
          statusText = `Visto por último em ${new Date(contact.lastSeen).toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "short",
          })}`;
        }

        return (
          <div
            key={contact._id}
            className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
            onClick={() => setSelectedUser(contact)}
          >
            <div className="flex items-center gap-3">
              <div className={`avatar ${isOnline ? "online" : "offline"}`}>
                <div className="size-12 rounded-full">
                  <img src={contact.profilePic || "/avatar.png"} />
                </div>
              </div>
              <div className="flex flex-col">
                <h4 className="text-slate-200 font-medium">{contact.fullName}</h4>
                <p className="text-xs text-slate-400 truncate">{statusText}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  )
}

export default ContactList;
