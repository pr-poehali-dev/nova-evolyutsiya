import HeroSection from "@/components/HeroSection"
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll"
import { Timeline } from "@/components/ui/timeline"
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials"
import { motion } from "framer-motion"
import SmoothScrollHero from "@/components/ui/smooth-scroll-hero"

export default function Index() {
  const missionStatement =
    "В Stride Collective мы верим: движение — это не просто выбор, это образ жизни. Рожденные из духа бегового сообщества, мы объединяем бегунов со всего мира, которых связывает страсть к преодолению границ. Бежишь ли ты навстречу рассвету по городским улицам или покоряешь горные тропы — мы здесь, чтобы вдохновлять тебя. Наше сообщество живет ритмом шагов, силой упорства и радостью общих побед. Присоединяйся к нам — беги не только ради формы, но ради свободы, дружбы и чистой любви к движению."

  const timelineEntries = [
    {
      id: 1,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RJ3iTXUn5SUexF6nHMZYhMoQLNCboK.png",
      alt: "Бегунья в художественном размытии движения",
      title: "Каждый шаг важен",
      description:
        "От первой пробежки вокруг дома до сотого марафона — у каждого бегуна своя история. В Stride Collective мы чествуем новичков, которые впервые шнуруют кроссовки. Твой темп не важен — важна твоя страсть. Чего ты ждешь?",
      layout: "left" as const,
    },
    {
      id: 2,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LN9OPh9hw0b9rwSPRSslHoejcfoKHe.png",
      alt: "Бегун с решимостью и концентрацией",
      title: "Найди свой ритм",
      description:
        "Гонишься за личными рекордами или просто встречаешь рассвет на бегу — наше сообщество принимает каждого. От спринтеров до любителей медленного бега, от трейлраннеров до звезд стадиона — здесь найдется место для тебя. Вопрос один: чего ты ждешь?",
      layout: "right" as const,
    },
    {
      id: 3,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1FdGyjVpWQANGzsDWpoPIvF5SVI2za.png",
      alt: "Бегун в динамике, демонстрирующий силу и грацию",
      title: "Стань частью движения",
      description:
        "Бег — это не только километры, это моменты. Утренние разговоры, общие трудности, коллективные победы. В Stride Collective ты вступаешь не просто в группу — ты становишься частью семьи. Зашнуруй кроссовки, выйди на старт и открой, на что ты способен. Серьезно, чего ты ждешь?",
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
              <h2 className="text-4xl md:text-6xl font-black tracking-wider mb-6 text-gray-900">МЫ РАДЫ КАЖДОМУ</h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                У каждого бегуна свой путь. Вот лишь несколько историй из нашего открытого сообщества.
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
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">БЕГУНЫ</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Реальные истории от реальных бегунов, которые нашли свой ритм вместе со Stride Collective.
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
