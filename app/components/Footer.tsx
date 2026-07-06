export default function Footer() {
  return (
    <footer className="relative z-20 w-full border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-6 py-6 text-sm text-white/60 sm:flex-row sm:justify-between">
        <span>Made by DML_142</span>
        <a
          href="https://github.com/DML142"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          github.com/DML142
        </a>
      </div>
    </footer>
  );
}
