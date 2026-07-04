import Hero from "./components/Hero";
import Skills from "./components/Skills";

export default function Home() {
  return (
    // Hero/About and Skills must NOT be inside a max-width wrapper: About
    // relies on position:fixed while raised/pinned (which ignores ancestor
    // width entirely) but switches to position:absolute during the release
    // into Skills (see useHeroScrollAnimation) — absolute positioning IS
    // constrained by the nearest positioned ancestor's width, so a
    // max-w-7xl wrapper here would shrink it to 1280px centered during the
    // release, leaving margins where the hero's still-unconstrained fixed
    // layer shows through underneath.
    <main className="min-h-screen bg-slate-50">
      <Hero />
      <Skills />
    </main>
  );
}
