import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Icon from "@/components/ui/icon"
import { useToast } from "@/hooks/use-toast"

const API = "https://functions.poehali.dev/f4dd1a52-5eb5-4752-ad3a-9cb7b1063e92"

interface Workout {
  id: number
  title: string
  date: string
  time: string
  duration: number | null
  notes: string
}

const today = () => new Date().toISOString().slice(0, 10)

export default function Workouts() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const token = localStorage.getItem("auth_token") || ""
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", date: today(), time: "", duration: "", notes: "" })
  const [saving, setSaving] = useState(false)

  const headers = { "Content-Type": "application/json", "X-Auth-Token": token }

  const load = async () => {
    setLoading(true)
    const res = await fetch(`${API}?action=workouts`, { headers })
    const data = await res.json()
    setWorkouts(data.workouts || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!token) { navigate("/"); return }
    load()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`${API}?action=workout-add`, {
      method: "POST", headers,
      body: JSON.stringify({ ...form, duration: form.duration ? Number(form.duration) : null }),
    })
    const data = await res.json()
    if (data.ok) {
      toast({ title: "Тренировка добавлена!" })
      setForm({ title: "", date: today(), time: "", duration: "", notes: "" })
      setShowForm(false)
      load()
    }
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    await fetch(`${API}?action=workout-delete`, {
      method: "POST", headers,
      body: JSON.stringify({ id }),
    })
    setWorkouts(prev => prev.filter(w => w.id !== id))
    toast({ title: "Тренировка удалена" })
  }

  const grouped = workouts.reduce<Record<string, Workout[]>>((acc, w) => {
    acc[w.date] = acc[w.date] || []
    acc[w.date].push(w)
    return acc
  }, {})

  const formatDate = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate("/cabinet")} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
          <Icon name="ChevronLeft" size={16} /> Личный кабинет
        </button>
        <span className="text-gray-900 font-black text-lg tracking-wide">РАСПИСАНИЕ</span>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-gray-700 transition-colors">
          <Icon name="Plus" size={14} /> Добавить
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h3 className="font-black text-gray-900 text-lg mb-4">Новая тренировка</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Название (напр. Силовая тренировка)" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
              <div className="grid grid-cols-3 gap-3">
                <input type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                  placeholder="Время" className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                <input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                  placeholder="Мин." className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
              </div>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Заметки (необязательно)" rows={2}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="flex-1 bg-gray-900 text-white font-bold py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm">
                  {saving ? "Сохраняю..." : "Сохранить"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 text-gray-500 hover:text-gray-900 text-sm font-medium">
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-400 py-16">Загрузка...</div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16">
            <Icon name="Calendar" size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Тренировок пока нет</p>
            <p className="text-gray-300 text-sm mt-1">Нажмите «Добавить», чтобы запланировать первую</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, items]) => (
              <div key={date}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 capitalize">{formatDate(date)}</p>
                <div className="space-y-2">
                  {items.map(w => (
                    <div key={w.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <Icon name="Dumbbell" size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{w.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {w.time && <span>{w.time.slice(0,5)} · </span>}
                            {w.duration && <span>{w.duration} мин.</span>}
                          </p>
                          {w.notes && <p className="text-xs text-gray-500 mt-1">{w.notes}</p>}
                        </div>
                      </div>
                      <button onClick={() => handleDelete(w.id)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                        <Icon name="Trash2" size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
