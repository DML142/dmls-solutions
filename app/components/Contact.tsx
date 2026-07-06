import BlackHoleScene from "./contact/BlackHoleScene";
import ContactCard from "./contact/ContactCard";

export default function Contact() {
  return (
    <section
      id="contact-section"
      className="relative z-20 w-full min-h-screen overflow-hidden bg-black"
    >
      <BlackHoleScene />
      {/* Blends the Skills->Contact seam: Skills' sticky canvas releases a
          hair after Contact's top edge starts, briefly overlapping. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black to-transparent md:h-56" />
      <ContactCard />
    </section>
  );
}
