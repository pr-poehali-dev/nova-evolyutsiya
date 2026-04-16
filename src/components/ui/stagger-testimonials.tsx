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
      "«В тонусе» изменил мою жизнь. Пришёл с лишним весом и неуверенностью — за 3 месяца сбросил 12 кг и впервые в жизни полюбил спорт.",
    by: "Сергей Иванов, минус 12 кг",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=SergeyIvanov&backgroundColor=3b82f6&textColor=ffffff",
  },
  {
    tempId: 1,
    testimonial:
      "Боялась, что буду чувствовать себя неловко среди спортивных людей. Но здесь все поддерживают друг друга. Теперь хожу 5 раз в неделю и не могу остановиться!",
    by: "Марина Петрова, постоянный участник",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=MarinaPetrova&backgroundColor=10b981&textColor=ffffff",
  },
  {
    tempId: 2,
    testimonial:
      "Тренер Антон составил мне персональный план, и уже через 6 недель я почувствовала реальные изменения. Никакой «общей программы» — всё под меня.",
    by: "Анна Козлова, персональные тренировки",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AnnaKozlova&backgroundColor=8b5cf6&textColor=ffffff",
  },
  {
    tempId: 3,
    testimonial:
      "Пробовал разные залы — нигде не было такой атмосферы. Здесь тебя знают по имени, помнят твои цели и радуются твоим успехам вместе с тобой.",
    by: "Дмитрий Смирнов, 2 года в клубе",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=DmitrySmirnov&backgroundColor=ef4444&textColor=ffffff",
  },
  {
    tempId: 4,
    testimonial:
      "Пришла после операции на спине — думала, спорт для меня закрыт навсегда. Тренеры разработали безопасную программу, и теперь я чувствую себя лучше, чем 10 лет назад.",
    by: "Елена Новикова, реабилитация",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=ElenaNovikova&backgroundColor=f59e0b&textColor=ffffff",
  },
  {
    tempId: 5,
    testimonial:
      "Первое занятие было бесплатным — думал, что это маркетинговый трюк. Оказалось, просто дают попробовать и влюбиться. Я влюбился. Уже полгода здесь.",
    by: "Алексей Морозов, 6 месяцев участник",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AlexeyMorozov&backgroundColor=6366f1&textColor=ffffff",
  },
  {
    tempId: 6,
    testimonial:
      "Групповые занятия — огонь! Энергия в зале такая, что забываешь об усталости. Тренер заряжает, группа поддерживает — каждый раз хочется выкладываться на полную.",
    by: "Айгуль Рахимова, групповые тренировки",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AigulRahimova&backgroundColor=ec4899&textColor=ffffff",
  },
  {
    tempId: 7,
    testimonial:
      "Переехала в новый город и сразу искала клуб. «В тонусе» стал не просто залом — здесь я нашла новых подруг и чувствую себя как дома.",
    by: "Ольга Ким, нашла своих людей",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=OlgaKim&backgroundColor=06b6d4&textColor=ffffff",
  },
  {
    tempId: 8,
    testimonial:
      "Занимаюсь с 55 лет. Думал, уже поздно — тренеры доказали обратное. Давление нормализовалось, спина перестала болеть. Жалею только, что не пришёл раньше.",
    by: "Наталья Соколова, 55 лет",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=NataliyaSokolova&backgroundColor=f97316&textColor=ffffff",
  },
  {
    tempId: 9,
    testimonial:
      "Три месяца — минус 8 кг и плюс ощущение, что я могу всё. Это не просто зал, это место, где меняется не только тело, но и голова.",
    by: "Михаил Волков, трансформация",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=MikhailVolkov&backgroundColor=84cc16&textColor=ffffff",
  },
  {
    tempId: 10,
    testimonial:
      "Что мне нравится больше всего — разнообразие программ. Не надоедает никогда: силовые, йога, HIIT, растяжка. Каждый найдёт своё.",
    by: "София Родригес, любит разнообразие",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=SofiaRodriguez&backgroundColor=a855f7&textColor=ffffff",
  },
  {
    tempId: 11,
    testimonial:
      "Самое важное — тренеры не дают расслабиться, но и не перегибают. Чувствуется, что им реально важен твой прогресс, а не просто продление абонемента.",
    by: "Тимур Асланов, доверяет тренерам",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=TimurAslanov&backgroundColor=059669&textColor=ffffff",
  },
  {
    tempId: 12,
    testimonial:
      "Раньше после работы не было никаких сил. Теперь тренировка — лучший способ снять стресс. После зала чувствую себя заново рождённой.",
    by: "Нина Павлова, антистресс",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=NinaPavlova&backgroundColor=0ea5e9&textColor=ffffff",
  },
  {
    tempId: 13,
    testimonial:
      "Зал чистый, оборудование современное, душевые отличные. Приходить сюда приятно — и это тоже важно, когда ходишь несколько раз в неделю.",
    by: "Роман Ким, ценит комфорт",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=RomanKim&backgroundColor=dc2626&textColor=ffffff",
  },
  {
    tempId: 14,
    testimonial:
      "Никогда не занималась спортом — в 40 лет начала с нуля. Тренер не смеялся, не торопил. Просто помогал шаг за шагом. Сейчас я горжусь собой каждый день.",
    by: "Екатерина Орлова, начала в 40",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=EkaterinaOrlova&backgroundColor=7c3aed&textColor=ffffff",
  },
  {
    tempId: 15,
    testimonial:
      "Получил травму колена — испугался, что придётся бросить. Тренеры скорректировали программу, не бросили. Вернулся к полноценным тренировкам за 8 недель.",
    by: "Даниил Пак, вернулся после травмы",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=DaniilPak&backgroundColor=ea580c&textColor=ffffff",
  },
  {
    tempId: 16,
    testimonial:
      "Брала абонемент скептически — думала, брошу через месяц. Прошло полтора года. Это стало частью моей жизни, которую я не готова отдавать.",
    by: "Раиса Грин, 1.5 года в клубе",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=RaisaGrin&backgroundColor=16a34a&textColor=ffffff",
  },
  {
    tempId: 17,
    testimonial:
      "Занимаюсь с сыном вместе — для нас это стало общим ритуалом и поводом проводить время вместе. Рекомендую клуб всем, кто ищет не просто зал, а атмосферу.",
    by: "Кирилл Вонг, ходит с сыном",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=KirillVong&backgroundColor=2563eb&textColor=ffffff",
  },
  {
    tempId: 18,
    testimonial:
      "Цены честные, без скрытых платежей. Всё прозрачно — платишь за абонемент и получаешь ровно то, что обещали. Редкость среди фитнес-клубов.",
    by: "Александра Фостер, ценит честность",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=AlexandraFoster&backgroundColor=be185d&textColor=ffffff",
  },
  {
    tempId: 19,
    testimonial:
      "Мне нравится, что тренеры постоянно учатся и привносят что-то новое. Программы обновляются, не застаиваются. Каждый месяц есть что-то интересное.",
    by: "Карлос Мендес, ценит развитие",
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