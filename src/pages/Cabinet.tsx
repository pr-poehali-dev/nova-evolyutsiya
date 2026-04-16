import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Icon from "@/components/ui/icon"

const AUTH_URL = "https://functions.poehali.dev/32be63d3-7d43-488b-ba88-e2aab0b38075"

interface User {
  id: number
  email: string
  name: string
}

export default function Cabinet() {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem("auth_user")
    const token = localStorage.getItem("auth_token")
    if (!stored || !token) {
      navigate("/")
      return
    }
    setUser(JSON.parse(stored))
  }, [navigate])

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      await fetch(`${AUTH_URL}?action=logout`, {
        method: "POST",
        headers: { "X-Auth-Token": token },
      }).catch(() => {})
    }
    localStorage.removeItem("auth_token")
    localStorage.removeItem("auth_user")
    navigate("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-gray-900 font-bold text-xl tracking-wider hover:opacity-70 transition-opacity"
        >
          В ТОНУСЕ
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
        >
          <Icon name="LogOut" size={16} />
          Выйти
        </button>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white text-xl font-black">
              {(user.name || user.email)[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {user.name || "Участник клуба"}
              </h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-3">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Icon name="User" size={18} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Имя</p>
                <p className="text-gray-900 font-medium">{user.name || "Не указано"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Icon name="Mail" size={18} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Email</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick access cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => navigate("/workouts")}
            className="bg-gray-900 text-white rounded-2xl p-6 text-left hover:bg-gray-800 transition-colors group"
          >
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
              <Icon name="Calendar" size={24} className="text-white" />
            </div>
            <h3 className="font-black text-lg mb-1">Расписание тренировок</h3>
            <p className="text-gray-400 text-sm">Планируйте и следите за своими занятиями</p>
          </button>

          <button
            onClick={() => navigate("/nutrition")}
            className="bg-white border border-gray-100 rounded-2xl p-6 text-left hover:border-gray-300 transition-colors group shadow-sm"
          >
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
              <Icon name="Apple" size={24} className="text-green-600" />
            </div>
            <h3 className="font-black text-gray-900 text-lg mb-1">Дневник питания</h3>
            <p className="text-gray-400 text-sm">Записывайте приёмы пищи и считайте КБЖУ</p>
          </button>
        </div>
      </div>
    </div>
  )
}