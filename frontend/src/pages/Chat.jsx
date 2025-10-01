import { useState, useEffect } from "react";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ChatContainer from "../components/ChatContainer";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import ProfileHeader from "../components/ProfileHeader";
import { useChatStore } from "../store/useChatStore";
import { XIcon, MenuIcon } from "lucide-react";

const Chat = () => {
  const { activeTab, selectedUser } = useChatStore();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Fechar sidebar automaticamente quando o usuário seleciona uma conversa no mobile
  useEffect(() => {
    if (selectedUser) {
      setSidebarOpen(false);
    }
  }, [selectedUser]);

  return (
    <div className="relative w-full h-[calc(100vh-2rem)] max-w-6xl mx-auto">
      <BorderAnimatedContainer>
        {/* Sidebar */}
        <div
          className={`
            fixed top-0 left-0 z-50 h-full bg-slate-900/90 backdrop-blur-sm
            flex flex-col w-80 md:w-72 lg:w-80 sm:relative sm:translate-x-0 sm:flex
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Close button mobile */}
          <div className="flex justify-end sm:hidden p-4">
            <button onClick={toggleSidebar}>
              <XIcon className="w-6 h-6 text-slate-200" />
            </button>
          </div>

          <ProfileHeader />
          <ActiveTabSwitch />
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col max-sm:w-full bg-slate-900/50 backdrop-blur-sm relative">
          {/* Mobile header with toggle if no chat selected */}
          {!selectedUser && (
            <div className="sm:hidden p-4 flex justify-start items-center">
              <button
                onClick={toggleSidebar}
                className="text-slate-200 hover:text-cyan-400 transition-colors"
              >
                <MenuIcon className="w-6 h-6" />
              </button>
            </div>
          )}

          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>

        {/* Overlay mobile quando a sidebar está aberta */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 sm:hidden"
            onClick={toggleSidebar}
          />
        )}
      </BorderAnimatedContainer>
    </div>
  );
};

export default Chat;
