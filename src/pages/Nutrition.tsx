import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Icon from "@/components/ui/icon"
import { useToast } from "@/hooks/use-toast"

const API = "https://functions.poehali.dev/f4dd1a52-5eb5-4752-ad3a-9cb7b1063e92"

interface NutritionEntry {
  id: number
  date: string
  meal_type: string
  food_name: string
  calories: number | null
  proteins: number | null
  fats: number | null
  carbs: number | null
  notes: string
}

const MEAL_TYPES = ["Завтрак", "Обед", "Ужин", "Перекус"]
const today = () => new Date().toISOString().slice(0, 10)

export default function Nutrition() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const token = localStorage.getItem("auth_token") || ""
  const [selectedDate, setSelectedDate] = useState(today())
  const [entries, setEntries] = useState<NutritionEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ meal_type: "Завтрак", food_name: "", calories: "", proteins: "", fats: "", carbs: "", notes: "" })
  const [saving, setSaving] = useState(false)

  const headers = { "Content-Type": "application/json", "X-Auth-Token": token }

  const load = async (date: string) => {
    setLoading(true)
    const res = await fetch(`${API}?action=nutrition&date=${date}`, { headers })
    const data = await res.json()
    setEntries(data.entries || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!token) { navigate("/"); return }
    load(selectedDate)
  }, [selectedDate])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`${API}?action=nutrition-add`, {
      method: "POST", headers,
      body: JSON.stringify({
        date: selectedDate,
        meal_type: form.meal_type,
        food_name: form.food_name,
        calories: form.calories ? Number(form.calories) : null,
        proteins: form.proteins ? Number(form.proteins) : null,
        fats: form.fats ? Number(form.fats) : null,
        carbs: form.carbs ? Number(form.carbs) : null,
        notes: form.notes,
      }),
    })
    const data = await res.json()
    if (data.ok) {
      toast({ title: "Запись добавлена!" })
      setForm({ meal_type: "Завтрак", food_name: "", calories: "", proteins: "", fats: "", carbs: "", notes: "" })
      setShowForm(false)
      load(selectedDate)
    }
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    await fetch(`${API}?action=nutrition-delete`, {
      method: "POST", headers,
      body: JSON.stringify({ id }),
    })
    setEntries(prev => prev.filter(e => e.id !== id))
    toast({ title: "Запись удалена" })
  }

  const grouped = entries.reduce<Record<string, NutritionEntry[]>>((acc, e) => {
    acc[e.meal_type || "Другое"] = acc[e.meal_type || "Другое"] || []
    acc[e.meal_type || "Другое"].push(e)
    return acc
  }, {})

  const totalCalories = entries.reduce((s, e) => s + (e.calories || 0), 0)
  const totalProteins = entries.reduce((s, e) => s + (e.proteins || 0), 0)
  const totalFats = entries.reduce((s, e) => s + (e.fats || 0), 0)
  const totalCarbs = entries.reduce((s, e) => s + (e.carbs || 0), 0)

  const prevDay = () => {
    const d = new Date(selectedDate); d.setDate(d.getDate() - 1)
    setSelectedDate(d.toISOString().slice(0, 10))
  }
  const nextDay = () => {
    const d = new Date(selectedDate); d.setDate(d.getDate() + 1)
    setSelectedDate(d.toISOString().slice(0, 10))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate("/cabinet")} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
          <Icon name="ChevronLeft" size={16} /> Личный кабинет
        </button>
        <span className="text-gray-900 font-black text-lg tracking-wide">ДНЕВНИК ПИТАНИЯ</span>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-gray-700 transition-colors">
          <Icon name="Plus" size={14} /> Добавить
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Date Switcher */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3 mb-6">
          <button onClick={prevDay} className="text-gray-400 hover:text-gray-900 transition-colors p-1">
            <Icon name="ChevronLeft" size={20} />
          </button>
          <div className="text-center">
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              className="text-gray-900 font-bold text-base text-center border-none outline-none bg-transparent cursor-pointer" />
          </div>
          <button onClick={nextDay} className="text-gray-400 hover:text-gray-900 transition-colors p-1">
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>

        {/* Totals */}
        {entries.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Калории", value: totalCalories, unit: "ккал" },
              { label: "Белки", value: totalProteins.toFixed(1), unit: "г" },
              { label: "Жиры", value: totalFats.toFixed(1), unit: "г" },
              { label: "Углеводы", value: totalCarbs.toFixed(1), unit: "г" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                <p className="text-xs text-gray-400 font-medium mb-1">{s.label}</p>
                <p className="text-lg font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400">{s.unit}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h3 className="font-black text-gray-900 text-lg mb-4">Добавить приём пищи</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                {MEAL_TYPES.map(mt => (
                  <button key={mt} type="button" onClick={() => setForm(f => ({ ...f, meal_type: mt }))}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${form.meal_type === mt ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {mt}
                  </button>
                ))}
              </div>
              <input required value={form.food_name} onChange={e => setForm(f => ({ ...f, food_name: e.target.value }))}
                placeholder="Название блюда / продукта" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: "calories", placeholder: "Ккал" },
                  { key: "proteins", placeholder: "Белки, г" },
                  { key: "fats", placeholder: "Жиры, г" },
                  { key: "carbs", placeholder: "Углев., г" },
                ].map(f => (
                  <input key={f.key} type="number" step="0.1" value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                ))}
              </div>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Заметки (необязательно)" rows={2}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="flex-1 bg-gray-900 text-white font-bold py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm">
                  {saving ? "Сохраняю..." : "Сохранить"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 text-gray-500 hover:text-gray-900 text-sm font-medium">Отмена</button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-400 py-16">Загрузка...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="Apple" size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">За этот день записей нет</p>
            <p className="text-gray-300 text-sm mt-1">Нажмите «Добавить», чтобы записать приём пищи</p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(grouped).map(([meal, items]) => (
              <div key={meal}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{meal}</p>
                <div className="space-y-2">
                  {items.map(entry => (
                    <div key={entry.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                          <Icon name="Utensils" size={16} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{entry.food_name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {entry.calories && <span>{entry.calories} ккал</span>}
                            {entry.proteins && <span> · Б: {entry.proteins}г</span>}
                            {entry.fats && <span> · Ж: {entry.fats}г</span>}
                            {entry.carbs && <span> · У: {entry.carbs}г</span>}
                          </p>
                          {entry.notes && <p className="text-xs text-gray-500 mt-1">{entry.notes}</p>}
                        </div>
                      </div>
                      <button onClick={() => handleDelete(entry.id)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
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
