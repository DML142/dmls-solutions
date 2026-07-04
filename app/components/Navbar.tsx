'use client';

import { Code2, Home, LucideIcon, Mail, User } from "lucide-react";
import WaveButton from "./WaveButton";
import { scrollToSection, SectionTarget } from "../lib/scrollNavigation";

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

export default function NavBar() {
  return (
    <nav className="site-navbar fixed top-0 left-0 w-full z-50 bg-white backdrop-blur-md border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between text-sm">

        <div className="text-black font-bold text-lg tracking-tight select-none">
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
                className="flex items-center gap-2 text-black/70 hover:text-black text-sm font-medium group"
              >
                <Icon className="w-4 h-4 text-current opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        <WaveButton />
      </div>
    </nav>
  )
}
