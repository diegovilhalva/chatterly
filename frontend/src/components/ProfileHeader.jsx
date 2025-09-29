import { useState, useRef } from "react"
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react"
import { useAuthStore } from "../store/useAuthStore"
import { useChatStore } from "../store/useChatStore"
import { toast } from "sonner"

const mouseClickSound = new Audio("/sounds/mouse-click.mp3")

const ProfileHeader = () => {
  const { logout, authUser, isUploading, updateProfile } = useAuthStore()
  const { isSoundEnabled, toggleSound } = useChatStore()
  const [selectedImg, setSelectedImg] = useState(null)


  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // validação: 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Arquivo muito grande (máx 2MB)")
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = async () => {
      const base64Image = reader.result
      setSelectedImg(base64Image)
      await updateProfile({ profilePic: base64Image })

    }
  }

  const handleLogout = () => {
      logout()
  }

  const handleToggleSound = () => {
    if (isSoundEnabled) {
      mouseClickSound.currentTime = 0
      mouseClickSound.play().catch(() => { })
    }
    toggleSound()
  }

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        {/* Avatar + Nome */}
        <div className="flex items-center gap-3">
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group cursor-pointer"
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">
                  {isUploading ? "Salvando..." : "Trocar foto"}
                </span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser.fullName}
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-4 items-center">
          {/* Logout */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={handleLogout}
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* Toggle Sound */}
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={handleToggleSound}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
