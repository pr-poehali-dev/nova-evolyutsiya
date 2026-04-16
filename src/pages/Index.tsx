import HeroSection from "@/components/HeroSection"
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll"
import { Timeline } from "@/components/ui/timeline"
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials"
import { motion } from "framer-motion"
import SmoothScrollHero from "@/components/ui/smooth-scroll-hero"

export default function Index() {
  const missionStatement =
    "В «В тонусе» мы верим: каждый заслуживает чувствовать себя сильным, энергичным и уверенным. Мы создали клуб, где нет места осуждению — только поддержка, профессиональные тренеры и атмосфера, в которой хочется возвращаться снова и снова. Неважно, хочешь ли ты сбросить вес, набрать мышечную массу или просто начать двигаться — мы выстроим твой путь шаг за шагом. Твоё тело способно на большее, чем ты думаешь. Пришло время это доказать."

  const timelineEntries = [
    {
      id: 1,
      image: "https://cdn.poehali.dev/projects/89100300-6839-4610-b3f6-e5490e939394/files/e8f1363d-cde6-4af6-a5b0-9f1319f3c07b.jpg",
      alt: "Групповая тренировка в зале",
      title: "Групповые тренировки",
      description:
        "Заряд энергии, поддержка команды и профессиональный тренер рядом — наши групповые занятия подходят для любого уровня. Силовые, кардио, функциональный тренинг — выбирай то, что откликается, и приходи хоть завтра.",
      layout: "left" as const,
    },
    {
      id: 2,
      image: "https://cdn.poehali.dev/projects/89100300-6839-4610-b3f6-e5490e939394/files/d4454663-a3a7-4519-93b9-690f21862ac0.jpg",
      alt: "Персональная тренировка",
      title: "Персональный подход",
      description:
        "Хочешь быстрый результат? Наши тренеры составят программу специально под тебя — твои цели, твой ритм жизни, твоё тело. Никаких шаблонов: только то, что работает именно для тебя.",
      layout: "right" as const,
    },
    {
      id: 3,
      image: "https://cdn.poehali.dev/projects/89100300-6839-4610-b3f6-e5490e939394/files/f48390bd-d551-478e-a5ec-dacdc74ac49d.jpg",
      alt: "Атмосфера и сообщество клуба",
      title: "Больше, чем зал",
      description:
        "«В тонусе» — это не просто тренажёры и беговые дорожки. Это место, где тебя знают по имени, где поддерживают в трудные дни и отмечают каждый твой прогресс. Приходи один раз — и ты поймёшь, почему наши члены остаются годами.",
      layout: "left" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Mission Statement Section with Grid Background */}
      <section id="mission" className="relative min-h-screen flex items-center justify-center py-20 bg-white">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-wider mb-12 text-gray-900">НАША МИССИЯ</h2>
            <TextGradientScroll
              text={missionStatement}
              className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-gray-800"
              type="word"
              textOpacity="soft"
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="community" className="relative py-20 bg-white">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="relative z-10">
          <div className="container mx-auto px-6 mb-16">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-black tracking-wider mb-6 text-gray-900">НАШИ ПРОГРАММЫ</h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                У каждого своя цель. Вот что мы предлагаем, чтобы ты её достиг.
              </p>
            </div>
          </div>

          <Timeline entries={timelineEntries} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-20 bg-white">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-wider text-gray-900 mb-6">
              Что говорят наши{" "}
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">УЧАСТНИКИ</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Реальные истории от людей, которые изменили себя вместе с «В тонусе».
            </p>
          </motion.div>

          <StaggerTestimonials />
        </div>
      </section>

      {/* Smooth Scroll Hero with CTA Overlay */}
      <section id="join" className="relative">
        <SmoothScrollHero
          scrollHeight={2500}
          desktopImage="/images/runners-motion-blur.png"
          mobileImage="/images/runners-motion-blur.png"
          initialClipPercentage={30}
          finalClipPercentage={70}
        />
      </section>
    </div>
  )
}