import { useState } from "react"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const AUTH_URL = "https://functions.poehali.dev/32be63d3-7d43-488b-ba88-e2aab0b38075"

interface User {
  id: number
  email: string
  name: string
}

interface AuthModalProps {
  mode: "login" | "register"
  onClose: () => void
  onSuccess: (user: User, token: string) => void
  onSwitchMode: (mode: "login" | "register") => void
}

export default function AuthModal({ mode, onClose, onSuccess, onSwitchMode }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const action = mode === "login" ? "login" : "register"
      const body: Record<string, string> = { email, password }
      if (mode === "register") body.name = name

      const res = await fetch(`${AUTH_URL}?action=${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: "Ошибка", description: data.error, variant: "destructive" })
        return
      }
      localStorage.setItem("auth_token", data.token)
      localStorage.setItem("auth_user", JSON.stringify(data.user))
      onSuccess(data.user, data.token)
      onClose()
    } catch {
      toast({ title: "Ошибка", description: "Не удалось подключиться к серверу", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black tracking-wide text-gray-900 mb-2">
          {mode === "login" ? "Вход в аккаунт" : "Регистрация"}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {mode === "login" ? "Введите email и пароль" : "Создайте аккаунт в «В тонусе»"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Иванов"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Загрузка..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          {mode === "login" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
          <button
            onClick={() => onSwitchMode(mode === "login" ? "register" : "login")}
            className="text-gray-900 font-semibold underline underline-offset-2 hover:text-gray-600"
          >
            {mode === "login" ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>
      </div>
    </div>
  )
}
