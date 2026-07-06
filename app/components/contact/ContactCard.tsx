const LINKS = [
  {
    label: "LinkedIn",
    text: "linkedin.com/in/xavier-laine",
    href: "https://www.linkedin.com/in/xavier-laine-721aa9396/",
    external: true,
  },
  {
    label: "Telegram",
    text: "@volnowan",
    href: "https://t.me/volnowan",
    external: true,
  },
  {
    label: "Gmail",
    text: "demolovfennec@gmail.com",
    // A plain mailto: link silently does nothing without an OS-configured
    // default mail client. The Gmail web-compose URL always opens a working
    // compose window in the browser instead.
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=demolovfennec@gmail.com",
    external: true,
  },
];

export default function ContactCard() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-black/60 backdrop-blur-sm">
        <h3 className="border-b border-white/20 px-6 py-4 text-center text-2xl font-bold tracking-widest text-white">
          CONTACT
        </h3>
        <ul className="px-6 py-5 space-y-3 text-sm leading-relaxed">
          {LINKS.map((link) => (
            <li key={link.label} className="flex flex-wrap items-baseline justify-center gap-x-2">
              <span className="text-white/60">{link.label}:</span>
              <a
                href={link.href}
                className="text-blue-400 underline hover:text-blue-300 break-all"
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
