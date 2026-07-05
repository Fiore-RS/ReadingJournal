import { Link } from "react-router-dom";
import { LandingNav } from "../components/NavBar.js";

export default function Landing() {
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: "radial-gradient(ellipse at 30% 20%, #fbf5e9 0%, #f6efe2 55%, #ead9bd 100%)" }}
    >
      <LandingNav />

      <div className="flex-1 flex items-center justify-center relative px-10">
        <div className="absolute top-[10%] left-[8%] text-[48px] opacity-50 animate-floaty">🍂</div>
        <div className="absolute bottom-[14%] right-[10%] text-5xl opacity-50 animate-floaty" style={{ animationDelay: "1s" }}>
          🌱
        </div>
        <div
          className="absolute top-[16%] right-[14%] w-[46px] h-16 bg-blush opacity-85 rotate-[8deg] shadow-[0_6px_12px_rgba(0,0,0,0.12)]"
          style={{ clipPath: "polygon(0 0,100% 0,100% 100%,50% 78%,0 100%)" }}
        />

        <div className="text-center max-w-[640px]">
          <h1 className="font-display font-bold text-[58px] text-clay mb-3.5 leading-[1.05]">My Reading Journal</h1>
          <p className="font-body text-xl text-sand mb-7 leading-relaxed">
            A little nook to keep every story you've read, are reading, and can't wait to start — wrapped up in warm
            pages and soft green ribbons.
          </p>
          <Link
            to="/library"
            className="inline-block py-[15px] px-[34px] rounded-[26px] bg-sage text-parchment font-extrabold text-xl shadow-[0_8px_18px_rgba(125,157,110,0.35)] transition-transform hover:-translate-y-0.5"
          >
            Open My Library →
          </Link>
        </div>
      </div>
    </div>
  );
}
