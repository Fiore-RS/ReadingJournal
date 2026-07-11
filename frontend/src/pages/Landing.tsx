import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: "radial-gradient(ellipse at 30% 20%, #fbf5e9 0%, #f6efe2 55%, #ead9bd 100%)" }}
    >
      <div className="flex-1 flex items-center px-8 md:px-16">
        <div className="w-full max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-14 items-center">

          {/* Texto, anclado abajo-izquierda */}
          <div className="text-center md:text-left self-end md:pb-10 relative z-10">
            <span className="inline-block font-body text-xs tracking-[0.22em] uppercase text-sage font-bold mb-4">
              Guardá cada historia
            </span>
            <h1 className="font-display font-bold text-[46px] md:text-[56px] text-clay mb-3.5 leading-[1.05]">
              My Reading
              <br />
              Journal
            </h1>
            <p className="font-body text-lg text-sand mb-8 leading-relaxed max-w-[380px] mx-auto md:mx-0">
              Un lugar para guardar cada historia que leíste, la que estás leyendo, y la que no ves la hora de
              empezar.
            </p>
            <Link
              to="/library"
              className="inline-block py-[15px] px-[34px] rounded-[26px] bg-sage text-parchment font-extrabold text-xl shadow-[0_8px_18px_rgba(125,157,110,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Abrir mi biblioteca →
            </Link>
          </div>

          {/* Abanico de tarjetas de libro */}
          <div className="relative w-[280px] h-[340px] mx-auto md:mx-0 hidden sm:block">
            <div className="absolute -top-8 -left-6 text-3xl opacity-45 animate-floaty">🍂</div>

            {/* Tarjeta trasera */}
            <div className="absolute top-4 left-8 w-[190px] h-[260px] bg-parchment rounded-2xl rotate-[10deg] shadow-[0_14px_24px_rgba(0,0,0,0.10)] border border-clay/10" />

            {/* Tarjeta media */}
            <div className="absolute top-2 left-4 w-[190px] h-[260px] bg-parchment rounded-2xl rotate-[-6deg] shadow-[0_16px_26px_rgba(0,0,0,0.12)] border border-clay/10 overflow-hidden">
              <div className="h-[62%] bg-sage/75" />
              <div className="p-3">
                <div className="h-2 w-3/4 bg-clay/25 rounded-full mb-2" />
                <div className="h-2 w-1/2 bg-clay/15 rounded-full" />
              </div>
            </div>

            {/* Tarjeta frontal — la protagonista */}
            <div className="absolute top-0 left-0 w-[190px] h-[260px] bg-parchment rounded-2xl rotate-[3deg] shadow-[0_18px_30px_rgba(0,0,0,0.16)] border border-clay/10 overflow-hidden">
              <div className="h-[58%] bg-blush/80 flex items-end p-3">
                <span className="text-[10px] font-body font-bold uppercase tracking-wide text-parchment bg-clay/70 rounded-full px-2 py-0.5">
                  Leyendo ahora
                </span>
              </div>
              <div className="p-3">
                <div className="h-2.5 w-4/5 bg-clay/70 rounded-full mb-1.5" />
                <div className="h-2 w-1/2 bg-clay/30 rounded-full mb-3" />
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4].map((i) => (
                    <span key={i} className="text-sage text-sm">★</span>
                  ))}
                  <span className="text-clay/25 text-sm">★</span>
                </div>
                <div className="h-1.5 w-full bg-clay/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-sage rounded-full" />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 right-2 text-3xl opacity-45 animate-floaty" style={{ animationDelay: "1s" }}>
              🌱
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}