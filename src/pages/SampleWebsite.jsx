import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Code2, Layers, Shield, Zap } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Digital Solutions",
    description: "Modern digital products designed to help businesses grow."
  },
  {
    icon: Layers,
    title: "Web Experiences",
    description: "Beautiful, responsive and intuitive digital experiences."
  },
  {
    icon: Shield,
    title: "Technology",
    description: "Reliable technology built around your business needs."
  }
];

export default function SampleWebsite() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-[#151515]">

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <a href="#home" className="text-2xl font-black tracking-tight">
          NOVA<span className="text-blue-600">.</span>
        </a>

        <div className="hidden md:flex items-center gap-9 text-sm font-medium text-slate-600">
          <a href="#home" className="hover:text-blue-600">Home</a>
          <a href="#about" className="hover:text-blue-600">About</a>
          <a href="#services" className="hover:text-blue-600">Services</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </div>

        <a
          href="#contact"
          className="bg-[#151515] text-white px-5 py-3 rounded-full text-sm font-semibold"
        >
          Let's Talk <ArrowUpRight className="inline" size={16} />
        </a>
      </nav>

      {/* Hero */}
      <section id="home" className="max-w-7xl mx-auto px-6 py-24 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="uppercase tracking-[0.25em] text-blue-600 text-xs font-bold mb-8">
            Innovation · Design · Technology
          </p>

          <h1 className="text-6xl md:text-8xl font-black leading-[1.05] tracking-tight max-w-5xl">
            Building ideas into
            <span className="text-blue-600"> meaningful </span>
            experiences.
          </h1>

          <div className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="text-slate-500 text-lg max-w-lg leading-relaxed">
              We help businesses transform their ideas
              into modern digital experiences through
              creativity, technology and innovation.
            </p>

            <a
              href="#services"
              className="inline-flex items-center gap-3 bg-blue-600 text-white px-7 py-4 rounded-full font-semibold w-fit hover:bg-blue-700 transition"
            >
              Discover More <ArrowRight size={18} />
            </a>
          </div>
        </motion.div>

        <div className="mt-20 rounded-3xl overflow-hidden min-h-[280px] md:min-h-[430px] bg-gradient-to-br from-[#101d42] via-[#194d91] to-[#4f46e5] relative flex items-center justify-center">
          <div className="absolute w-72 h-72 bg-cyan-300/20 blur-[100px] rounded-full top-0 left-10" />
          <div className="absolute w-80 h-80 bg-purple-400/30 blur-[100px] rounded-full bottom-0 right-10" />

          <div className="relative text-center text-white px-6">
            <Zap size={55} className="mx-auto text-cyan-300 mb-6" />
            <p className="text-4xl md:text-6xl font-black">
              Think Beyond.
            </p>
            <p className="text-blue-100 mt-4">
              Create What's Next.
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-blue-600 font-bold tracking-widest text-xs uppercase">
              About Nova
            </p>

            <h2 className="text-4xl md:text-5xl font-black mt-5 leading-tight">
              Ideas deserve
              <span className="text-blue-600"> better </span>
              possibilities.
            </h2>
          </div>

          <p className="text-slate-500 leading-relaxed text-lg">
            We believe technology should make things
            simpler, smarter and more meaningful.
            Our approach combines thoughtful design
            and practical innovation to create solutions
            that make a difference.
          </p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-24">
        <p className="text-blue-600 font-bold tracking-widest text-xs uppercase">
          What We Do
        </p>

        <h2 className="text-4xl md:text-5xl font-black mt-5 mb-14">
          Solutions for what's next.
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="bg-white border border-slate-200 p-9 rounded-3xl hover:shadow-xl transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Icon size={28} />
              </div>

              <p className="text-xs text-slate-400 mt-9">
                0{index + 1}
              </p>

              <h3 className="text-2xl font-bold mt-3">
                {title}
              </h3>

              <p className="text-slate-500 leading-relaxed mt-4">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-[#111827] text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase">
            Let's Connect
          </p>

          <h2 className="text-5xl md:text-7xl font-black mt-6 max-w-3xl">
            Have an idea?
            Let's make it happen.
          </h2>

          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center gap-3 mt-10 bg-blue-600 px-7 py-4 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Get in Touch <ArrowUpRight size={18} />
          </a>

          <div className="border-t border-white/10 mt-24 pt-8 flex justify-between text-sm text-slate-500">
            <span>© 2026 NOVA. All rights reserved.</span>
            <span>Built for What's Next.</span>
          </div>
        </div>
      </section>
    </main>
  );
}