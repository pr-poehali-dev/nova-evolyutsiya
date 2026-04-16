import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { Menu, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthModal from "@/components/AuthModal"

interface User {
  id: number
  email: string
  name: string
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null)
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("auth_user")
    return stored ? JSON.parse(stored) : null
  })
  const navigate = useNavigate()

  const slides = [
    {
      image: "https://cdn.poehali.dev/projects/89100300-6839-4610-b3f6-e5490e939394/files/e45f839b-7a00-44d7-a0a5-53373c121585.jpg",
      alt: "Групповая тренировка в зале",
      label: "",
    },
    {
      image: "https://cdn.poehali.dev/projects/89100300-6839-4610-b3f6-e5490e939394/files/482f52b1-f427-4412-8fca-e5115e29af6d.jpg",
      alt: "Персональный тренер",
      label: "Тренер подбирает вид тренировок и питание лично под каждого",
    },
    {
      image: "https://cdn.poehali.dev/projects/89100300-6839-4610-b3f6-e5490e939394/files/297d0af6-8941-4499-a5c5-1aee193cf3fb.jpg",
      alt: "Личный кабинет на смартфоне",
      label: "В личном кабинете: расписание тренировок, дневник питания и переписка с тренером",
    },
  ]

  const navItems = [
    { name: "Главная", href: "#hero" },
    { name: "О нас", href: "#mission" },
    { name: "Программы", href: "#community" },
    { name: "Отзывы", href: "#testimonials" },
    { name: "Записаться", href: "#join" },
  ]

  // Navigation handlers
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <>
    {authMode && (
      <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSuccess={(u) => setUser(u)}
        onSwitchMode={(m) => setAuthMode(m)}
      />
    )}
    <div id="hero" className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${slides[currentSlide].image}')`,
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-6 md:p-8">
        {/* Logo/Brand */}
        <div className="text-white font-bold text-xl tracking-wider">В ТОНУСЕ</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="relative text-white hover:text-gray-300 transition-colors duration-300 font-medium tracking-wide pb-1 group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 ease-out group-hover:w-full"></span>
            </button>
          ))}
        </div>

        {/* Auth buttons desktop */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate("/cabinet")}
              className="flex items-center gap-2 text-white border border-white/40 rounded-full px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <span className="w-6 h-6 bg-white text-gray-900 rounded-full flex items-center justify-center text-xs font-black">
                {(user.name || user.email)[0].toUpperCase()}
              </span>
              Личный кабинет
            </button>
          ) : (
            <>
              <button
                onClick={() => setAuthMode("login")}
                className="text-white text-sm font-medium hover:text-gray-300 transition-colors"
              >
                Войти
              </button>
              <button
                onClick={() => setAuthMode("register")}
                className="bg-white text-gray-900 text-sm font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                Регистрация
              </button>
            </>
          )}
        </div>

        {/* Mobile: auth icon + burger */}
        <div className="md:hidden flex items-center gap-3">
          {user ? (
            <button
              onClick={() => navigate("/cabinet")}
              className="w-8 h-8 bg-white text-gray-900 rounded-full flex items-center justify-center text-sm font-black"
            >
              {(user.name || user.email)[0].toUpperCase()}
            </button>
          ) : (
            <button
              onClick={() => setAuthMode("login")}
              className="text-white text-sm font-medium border border-white/40 rounded-full px-3 py-1"
            >
              Войти
            </button>
          )}
          <button
            className="text-white hover:text-gray-300 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            <span className="sr-only">Меню</span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/90 z-30 md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-white text-2xl font-bold tracking-wider hover:text-gray-300 transition-colors duration-300"
              >
                {item.name}
              </button>
            ))}
            <div className="pt-4 border-t border-white/20 w-40 flex flex-col items-center gap-4">
              {user ? (
                <button
                  onClick={() => { setIsMenuOpen(false); navigate("/cabinet") }}
                  className="text-white text-xl font-bold tracking-wider hover:text-gray-300 transition-colors"
                >
                  Личный кабинет
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setIsMenuOpen(false); setAuthMode("login") }}
                    className="text-white text-xl font-bold tracking-wider hover:text-gray-300 transition-colors"
                  >
                    Войти
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); setAuthMode("register") }}
                    className="bg-white text-gray-900 text-lg font-bold px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    Регистрация
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="text-center text-white max-w-4xl">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-wider mb-4 leading-none">
            В
            <br />
            ТОНУСЕ
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl font-light tracking-wide mb-4 text-gray-200">Фитнес-клуб для тех, кто хочет результат</p>

          {/* Slide label */}
          {slides[currentSlide].label && (
            <p className="text-base md:text-lg font-medium text-white/90 bg-black/30 backdrop-blur-sm rounded-xl px-5 py-2 mb-8 inline-block max-w-xl">
              {slides[currentSlide].label}
            </p>
          )}
          {!slides[currentSlide].label && <div className="mb-8" />}

          {/* CTA Button */}
          <LiquidButton
            size="xxl"
            className="font-semibold text-lg tracking-wide"
            onClick={() => scrollToSection("#join")}
          >
            Записаться на тренировку
          </LiquidButton>
        </div>
      </div>

      {/* Slider Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          {/* Previous Arrow */}
          <button
            onClick={prevSlide}
            className="text-white hover:text-gray-300 transition-colors p-2"
            aria-label="Предыдущий слайд"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "bg-white" : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={nextSlide}
            className="text-white hover:text-gray-300 transition-colors p-2"
            aria-label="Следующий слайд"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Side Navigation Indicators */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 hidden md:block">
        <div className="flex flex-col space-y-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-1 h-8 transition-all duration-300 ${
                currentSlide === index ? "bg-white" : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Слайд ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
    </>
  )
}