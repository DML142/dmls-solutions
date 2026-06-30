'use client';

import { Code2, Home, LucideIcon, Mail, User } from "lucide-react";
import Link from "next/link";
import WaveButton from "./WaveButton";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'About me', href: '#about', icon: User },
  { name: 'Skills', href: '#skills', icon: Code2 },
  { name: 'Contact', href: '#contact', icon: Mail },
];

export default function NavBar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white backdrop-blur-md border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between text-sm">
        <div className="text-black font-bold text-lg tracking-tight select-none">
          DML
        </div>

        <nav className="md:flex gap-5 hidden">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-black/70 hover:text-black transition-colors duration-300 text-sm font-medium group"
              >
                <Icon className="flex items-center justify-center w-4 h-4 group-hover:h-4.5 group-hover:w-4.5 text-black/40 group-hover:text-black/80 transition-all duration-300" />
                <span>{item.name}</span>
              </Link>
            )})
          }
        </nav>

        <WaveButton />
      </div>
    </header>
  )
}