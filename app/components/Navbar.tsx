'use client';

import { useEffect, useRef, useState } from "react";
import { Code2, Home, LucideIcon, Mail, User } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WaveButton from "./WaveButton";
import { scrollToSection, SectionTarget } from "../lib/scrollNavigation";
import { TRIGGER_POINT, LOCK_DISTANCE } from "../hooks/useHeroScrollAnimation";

gsap.registerPlugin(ScrollTrigger);

interface NavItem {
  name: string;
  target: SectionTarget;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { name: 'Home', target: 'top', icon: Home },
  { name: 'About me', target: 'about', icon: User },
  { name: 'Skills', target: 'skills', icon: Code2 },
  { name: 'Contact', target: 'contact', icon: Mail },
];

interface NavBarProps {
  // Explicit override; when omitted the navbar tracks scroll position itself,
  // switching to dark once the user reaches the Skills release point.
  theme?: "light" | "dark";
}

export default function NavBar({ theme }: NavBarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [autoTheme, setAutoTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const releasePoint = TRIGGER_POINT + LOCK_DISTANCE;
    // Each theme swap is timed to the instant its reveal animation begins,
    // while the navbar is still off-screen: dark at the release point (where
    // it re-shows over Skills), light back at the hero trigger point (where
    // it slides back down over the hero). Swapping at the release point on
    // the way back showed a visible dark-to-light flash mid-hide.
    const darkTrigger = ScrollTrigger.create({
      start: releasePoint,
      end: releasePoint,
      onEnter: () => setAutoTheme("dark"),
    });
    const lightTrigger = ScrollTrigger.create({
      start: TRIGGER_POINT,
      end: TRIGGER_POINT,
      onLeaveBack: () => setAutoTheme("light"),
    });
    // Third visibility zone: hidden again for the whole Contact section.
    // Keyed to the section's DOM element rather than a pixel constant —
    // Contact has no fixed-height formula like the Hero runway or Skills,
    // so its document offset is only knowable from layout. Contact is the
    // final 100vh section, so its top reaches the viewport top only at the
    // document's absolute maximum scroll — "top top" would fire on the very
    // last pixel or never; "top 25%" fires once the section dominates the
    // viewport instead. overwrite:"auto" kills any still-running show/hide
    // tween from the Skills release trigger so the two never fight over
    // yPercent.
    const contactEl = document.getElementById("contact-section");
    const contactTrigger = contactEl
      ? ScrollTrigger.create({
          trigger: contactEl,
          start: "top 25%",
          onEnter: () => {
            gsap.to(navRef.current, { yPercent: -100, duration: 0.5, ease: "power2.inOut", overwrite: "auto" });
          },
          onLeaveBack: () => {
            gsap.to(navRef.current, { yPercent: 0, duration: 0.5, ease: "power2.inOut", overwrite: "auto" });
          },
        })
      : null;
    return () => {
      darkTrigger.kill();
      lightTrigger.kill();
      contactTrigger?.kill();
    };
  }, []);

  const activeTheme = theme ?? autoTheme;
  const isDark = activeTheme === "dark";

  return (
    <nav
      ref={navRef}
      // No color transition: theme swaps happen while the navbar is
      // off-screen, and animating them made the swap visible mid-slide.
      className={`site-navbar fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b ${
        isDark ? "bg-black/80 border-white/10" : "bg-white border-black/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between text-sm">

        <div className={`font-bold text-lg tracking-tight select-none ${isDark ? "text-white" : "text-black"}`}>
          DML
        </div>

        <nav className="md:flex gap-5 hidden">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => scrollToSection(item.target)}
                className={`flex items-center gap-2 text-sm font-medium group ${
                  isDark ? "text-white/70 hover:text-white" : "text-black/70 hover:text-black"
                }`}
              >
                <Icon className="w-4 h-4 text-current opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        <WaveButton theme={activeTheme} />
      </div>
    </nav>
  )
}
