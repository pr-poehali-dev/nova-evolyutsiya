import type React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const SQRT_5000 = Math.sqrt(5000)

// Running club testimonials data with randomly generated icons
const testimonials = [
  {
    tempId: 0,
    testimonial:
      "Stride Collective изменил мою жизнь. От попыток пробежать 5 минут до первого марафона — это сообщество верило в меня, когда я сам в себя не верил.",
    by: "Сергей Иванов, марафонец",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=SergeyIvanov&backgroundColor=3b82f6&textColor=ffffff",
  },
  {
    tempId: 1,
    testimonial:
      "Я боялась присоединиться к беговой группе, но Stride Collective встретил меня с распростертыми объятиями. Теперь у меня друзья на всю жизнь и уверенность достигать любых целей.",
    by: "Марина Петрова, трейлраннер",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=MarinaPetrova&backgroundColor=10b981&textColor=ffffff",
  },
  {
    tempId: 2,
    testimonial:
      "Энергетика на пробежках Stride Collective заразительна. Быстрый ты или медленный — все болеют за тебя. Здесь не соревнование, здесь сообщество.",
    by: "Анна Козлова, любитель 5К",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AnnaKozlova&backgroundColor=8b5cf6&textColor=ffffff",
  },
  {
    tempId: 3,
    testimonial:
      "После лет одиночных пробежек Stride Collective стал для меня открытием. Групповые тренировки помогли выйти на личные рекорды, о которых я и мечтать не мог.",
    by: "Дмитрий Смирнов, спринтер",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=DmitrySmirnov&backgroundColor=ef4444&textColor=ffffff",
  },
  {
    tempId: 4,
    testimonial:
      "Stride Collective научил меня, что бег — это не просто тренировка. Это терапия, дружба и приключение в одном флаконе. Этот клуб спас мое ментальное здоровье.",
    by: "Елена Новикова, осознанный бегун",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=ElenaNovikova&backgroundColor=f59e0b&textColor=ffffff",
  },
  {
    tempId: 5,
    testimonial:
      "От дивана до 10К за 6 месяцев с поддержкой Stride Collective. Они принимают тебя таким, какой ты есть, и помогают понять, куда ты можешь дойти. Настоящая магия.",
    by: "Алексей Морозов, история успеха",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AlexeyMorozov&backgroundColor=6366f1&textColor=ffffff",
  },
  {
    tempId: 6,
    testimonial:
      "Рассветные пробежки со Stride Collective — это духовный опыт. Есть что-то мощное в том, чтобы двигаться вместе, пока мир просыпается вокруг нас.",
    by: "Айгуль Рахимова, рассветный патруль",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AigulRahimova&backgroundColor=ec4899&textColor=ffffff",
  },
  {
    tempId: 7,
    testimonial:
      "Я вступила в Stride Collective после переезда в новый город. Нашла не только беговое племя, но и настоящую семью. Движение здесь — это образ жизни.",
    by: "Ольга Ким, строитель сообщества",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=OlgaKim&backgroundColor=06b6d4&textColor=ffffff",
  },
  {
    tempId: 8,
    testimonial:
      "Stride Collective празднует каждую победу, даже самую маленькую. Мой первый километр ощущался как олимпийское золото с этой командой, болеющей за меня.",
    by: "Наталья Соколова, герой первого км",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=NataliyaSokolova&backgroundColor=f97316&textColor=ffffff",
  },
  {
    tempId: 9,
    testimonial:
      "Тренировочные планы в Stride Collective невероятные. Я прошел путь от еле добегающего 5К до квалификации на Бостонский марафон всего за два года.",
    by: "Михаил Волков, Бостонский квалификант",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=MikhailVolkov&backgroundColor=84cc16&textColor=ffffff",
  },
  {
    tempId: 10,
    testimonial:
      "Что я люблю в Stride Collective — это разнообразие. Бегуны всех возрастов, с разным опытом и способностями объединяются одной страстью.",
    by: "София Родригес, чемпион разнообразия",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=SofiaRodriguez&backgroundColor=a855f7&textColor=ffffff",
  },
  {
    tempId: 11,
    testimonial:
      "Дисциплина в Stride Collective не имеет равных. Когда знаешь, что твоя беговая семья ждет тебя — выходишь на пробежку несмотря ни на что.",
    by: "Тимур Асланов, король постоянства",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=TimurAslanov&backgroundColor=059669&textColor=ffffff",
  },
  {
    tempId: 12,
    testimonial:
      "Трейловая группа Stride Collective открыла мне самые красивые места, о которых я и не знал. Бег стал моим способом исследовать мир.",
    by: "Нина Павлова, исследователь троп",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=NinaPavlova&backgroundColor=0ea5e9&textColor=ffffff",
  },
  {
    tempId: 13,
    testimonial:
      "Разговоры после пробежек в Stride Collective ценны не меньше самих пробежек. Мы решаем мировые проблемы километр за километром.",
    by: "Роман Ким, философ бега",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=RomanKim&backgroundColor=dc2626&textColor=ffffff",
  },
  {
    tempId: 14,
    testimonial:
      "Я никогда не думала, что стану бегуном, но дружелюбный к новичкам подход Stride Collective сделал это возможным. Теперь не представляю жизни без бега.",
    by: "Екатерина Орлова, позднее цветение",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=EkaterinaOrlova&backgroundColor=7c3aed&textColor=ffffff",
  },
  {
    tempId: 15,
    testimonial:
      "Поддержка при травмах в Stride Collective потрясающая. Когда я выбыл, они поддерживали мою мотивацию и помогли вернуться сильнее.",
    by: "Даниил Пак, история возвращения",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=DaniilPak&backgroundColor=ea580c&textColor=ffffff",
  },
  {
    tempId: 16,
    testimonial:
      "Благотворительные забеги Stride Collective придают нашим километрам смысл. Мы бежим не только для себя — мы бежим, чтобы изменить мир к лучшему.",
    by: "Раиса Грин, чемпион благотворительности",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=RaisaGrin&backgroundColor=16a34a&textColor=ffffff",
  },
  {
    tempId: 17,
    testimonial:
      "Мастер-классы по технике в Stride Collective преобразили мою беговую форму. Я стал быстрее и забыл о травмах благодаря экспертному руководству.",
    by: "Кирилл Вонг, перфекционист формы",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=KirillVong&backgroundColor=2563eb&textColor=ffffff",
  },
  {
    tempId: 18,
    testimonial:
      "Виртуальные забеги Stride Collective во время локдауна спасли мой рассудок. Даже когда мы не могли бегать вместе, мы оставались связаны как сообщество.",
    by: "Александра Фостер, виртуальный воин",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AlexandraFoster&backgroundColor=be185d&textColor=ffffff",
  },
  {
    tempId: 19,
    testimonial:
      "Наставничество в Stride Collective меняет жизни. Опытные бегуны берут новичков под крыло и щедро делятся своей мудростью.",
    by: "Карлос Мендес, благодарный ученик",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=CarlosMendez&backgroundColor=0891b2&textColor=ffffff",
  },
]

interface TestimonialCardProps {
  position: number
  testimonial: (typeof testimonials)[0]
  handleMove: (steps: number) => void
  cardSize: number
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0
  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out",
        isCenter
          ? "z-10 bg-gray-900 text-white border-gray-900"
          : "z-0 bg-white text-gray-900 border-gray-200 hover:border-gray-400",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-gray-300"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2,
        }}
      />
      <img
        src={testimonial.imgSrc || "/placeholder.svg"}
        alt={`${testimonial.by.split(",")[0]}`}
        className="mb-4 h-14 w-12 bg-gray-100 object-cover object-top"
        style={{
          boxShadow: "3px 3px 0px hsl(var(--background))",
        }}
      />
      <h3 className={cn("text-base sm:text-xl font-medium", isCenter ? "text-white" : "text-gray-900")}>
        "{testimonial.testimonial}"
      </h3>
      <p
        className={cn(
          "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
          isCenter ? "text-gray-300" : "text-gray-600",
        )}
      >
        - {testimonial.by}
      </p>
    </div>
  )
}

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365)
  const [testimonialsList, setTestimonialsList] = useState(testimonials)

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList]
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift()
        if (!item) return
        newList.push({ ...item, tempId: Math.random() })
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop()
        if (!item) return
        newList.unshift({ ...item, tempId: Math.random() })
      }
    }
    setTestimonialsList(newList)
  }

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)")
      setCardSize(matches ? 365 : 290)
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <div className="relative w-full overflow-hidden bg-white" style={{ height: 600 }}>
      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2 ? index - (testimonialsList.length + 1) / 2 : index - testimonialsList.length / 2
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        )
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-white border-2 border-gray-300 hover:bg-gray-900 hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2",
          )}
          aria-label="Предыдущий отзыв"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
            "bg-white border-2 border-gray-300 hover:bg-gray-900 hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2",
          )}
          aria-label="Следующий отзыв"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}
