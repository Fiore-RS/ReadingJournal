import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

export default function Login() {
  const { user, checkingSession, login, loginError, loggingIn } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Already logged in (e.g. came back with a valid saved session) — skip
  // straight to the library instead of showing the form again.
  if (!checkingSession && user) {
    return <Navigate to="/library" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = await login(username, password);
    if (ok) navigate("/library");
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
      {/* Welcome panel — introduces the project and points visitors to the
          public gift list. Stacks above the form on small screens since
          there isn't room for two side-by-side columns there. */}
      <div
        className="order-1 lg:order-2 w-full lg:w-1/2 flex flex-col items-center justify-center text-center px-6 sm:px-10 py-10 lg:py-8 gap-4"
        style={{ background: "radial-gradient(ellipse at 50% 20%, #8fae7d 0%, #7d9d6e 60%, #6a8c5c 100%)" }}
      >
        <span className="text-[40px]">👋</span>
        <h2 className="font-display font-bold text-[26px] sm:text-[30px] text-parchment leading-tight max-w-sm">
          Welcome to my reading corner!
        </h2>
        <p className="font-body text-[15px] text-parchment/90 max-w-sm leading-relaxed">
          This is my personal library — where I keep track of everything I'm reading, have read, or am hoping to read next.
        </p>
        <p className="font-body text-[15px] text-parchment/90 max-w-sm leading-relaxed">
          Looking for a gift idea? Take a peek at my wishlist.
        </p>
        <Link
          to="/gift-list"
          className="mt-2 inline-block py-3 px-7 rounded-[20px] bg-parchment text-clay font-extrabold text-base shadow-[0_4px_10px_rgba(0,0,0,0.18)] transition-transform hover:-translate-y-0.5"
        >
          🎁 See my Gift List
        </Link>
      </div>

      {/* Login form panel */}
      <div
        className="order-2 lg:order-1 w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 py-10 lg:py-8"
        style={{ background: "radial-gradient(ellipse at 50% 15%, #fbf5e9 0%, #f6efe2 55%, #ead9bd 100%)" }}
      >
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-7">
          <span className="text-[32px]">📕</span>
          <h1 className="font-display font-bold text-[28px] sm:text-[32px] text-clay leading-tight mt-1">
            My Reading Journal
          </h1>
          <p className="font-body text-sand text-[15px] mt-1.5">Sign in to open a library</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-[26px] p-6 sm:p-8 shadow-[0_12px_30px_rgba(74,53,39,0.16)] flex flex-col gap-3.5"
        >
          <div>
            <label className="text-sm font-bold text-sand uppercase">Username</label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border-[1.5px] border-bark/25 mt-1 text-base text-clay outline-none focus:border-sage"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm font-bold text-sand uppercase">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border-[1.5px] border-bark/25 mt-1 text-base text-clay outline-none focus:border-sage"
            />
          </div>

          {!!loginError && (
            <div className="text-[13.5px] text-[#a15b3d] font-bold bg-[#a15b3d]/10 border-[1.5px] border-[#a15b3d]/25 rounded-xl py-2 px-3">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={loggingIn || !username.trim() || !password}
            className="mt-1 py-3 rounded-[20px] border-none bg-sage text-parchment font-extrabold text-base cursor-pointer shadow-[0_4px_10px_rgba(125,157,110,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loggingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-5 text-center bg-sage/10 border-[1.5px] border-sage/25 rounded-2xl py-3 px-4">
          <p className="font-body text-[13.5px] text-bark leading-snug">
            Just want to try the project out? Sign in with{" "}
            <span className="font-bold text-clay">Visitor</span> / <span className="font-bold text-clay">vstr123</span> —
            it's a sandbox library you're free to add to, edit, or delete from. Nothing there affects the real thing.
          </p>
        </div>

        <div className="mt-5 flex justify-center">
          <Link
            to="/"
            className="inline-block py-2.5 px-6 rounded-[20px] bg-sage text-parchment font-extrabold text-sm shadow-[0_4px_10px_rgba(125,157,110,0.35)] transition-transform hover:-translate-y-0.5"
          >
            ← Back to home
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
