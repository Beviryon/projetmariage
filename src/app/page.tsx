import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MediaGallery } from "@/components/MediaGallery";
import { Timeline } from "@/components/Timeline";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { Guestbook } from "@/components/Guestbook";

// Données de la timeline (à personnaliser ou charger depuis une source)
const TIMELINE_STEPS = [
  {
    id: "1",
    title: "Notre rencontre",
    date: "2018",
    description:
      "C'est par hasard que nos chemins se sont croisés. Un regard, un sourire, et notre histoire a commencé.",
  },
  {
    id: "2",
    title: "Premier voyage ensemble",
    date: "2019",
    description:
      "Notre premier voyage à deux. Des souvenirs inoubliables et des promesses pour l'avenir.",
  },
  {
    id: "3",
    title: "La demande",
    date: "2023",
    description:
      "Un moment magique qui a changé nos vies. Oui, mille fois oui !",
  },
  {
    id: "4",
    title: "Le grand jour",
    date: "2025",
    description:
      "Le plus beau jour de notre vie. Merci à tous ceux qui ont partagé ce moment avec nous.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header names="Berges & Brest" />
      <Hero />
      <section id="galerie" className="py-12 sm:py-16 md:py-20 scroll-mt-16 md:scroll-mt-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-800 text-center mb-8 sm:mb-12">
            Galerie
          </h2>
          <MediaGallery />
        </div>
      </section>

      <section id="timeline" className="py-12 sm:py-16 md:py-20 scroll-mt-16 md:scroll-mt-20 px-4 sm:px-6 bg-champagne-50/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-800 text-center mb-10 sm:mb-16">
            Notre histoire
          </h2>
          <Timeline steps={TIMELINE_STEPS} />
        </div>
      </section>

      <section id="playlist" className="py-12 sm:py-16 md:py-20 scroll-mt-16 md:scroll-mt-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-800 text-center mb-8 sm:mb-12">
            Notre playlist
          </h2>
          <YouTubePlayer />
        </div>
      </section>

      <Guestbook />
    </main>
  );
}
