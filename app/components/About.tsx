import { forwardRef } from "react";
// Импорт шрифтов, если нужен текст, но для заглушки можно без них

// Обертываем компонент в forwardRef
const About = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    // Привязываем переданный реф к самому внешнему div
    // top-[100%] прячет её под экран, z-30 кладет поверх героя
    <div 
      ref={ref} 
      className="fixed top-full left-0 w-full h-screen bg-black z-30 flex flex-col items-center justify-center select-none text-white font-mono opacity-0"
    >
      <div className="max-w-xl text-center p-6 border border-zinc-800 bg-zinc-950/50">
        <h2 className="text-xl uppercase tracking-widest mb-4 text-zinc-400">
          &gt; About Me
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          [Черный экран-заглушка. Секция готова к наполнению кодом/контентом]
        </p>
      </div>
    </div>
  );
});

// Задаем имя для отладки
About.displayName = "AboutMeSection";

export default About;