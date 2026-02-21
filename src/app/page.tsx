import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Location } from "@/components/Location";
import { DressCode } from "@/components/DressCode";
import { MediaGallery } from "@/components/MediaGallery";
import { Timeline } from "@/components/Timeline";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import { Guestbook } from "@/components/Guestbook";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { SectionDivider } from "@/components/SectionDivider";
import { CeremonyModal } from "@/components/CeremonyModal";

// Notre histoire – timeline
const TIMELINE_STEPS = [
  {
    id: "1",
    title: "Notre rencontre",
    date: "Au travail",
    description:
      "Notre histoire a commencé simplement, au travail. Nous nous sommes croisés lorsqu'elle venait dans mon service avec sa collègue dans le cadre de leur stage QHSE pour animer les tool box (briefings matinaux). Après chaque tool box, nous avions une petite réunion avec notre chef de service, et cela se passait en anglais.",
  },
  {
    id: "2",
    title: "L'anglais et une promesse",
    date: "Les premiers échanges",
    description:
      "Un jour, elles m'ont vu m'exprimer en anglais et elles se sont rapprochées de moi pour me demander si je pouvais les aider à améliorer leur anglais. J'ai accepté avec plaisir et je leur ai promis de préparer un programme de formation. Mais le temps passait… Un mois, puis quelques semaines encore… et je faisais seulement des promesses sans vraiment commencer les cours.",
  },
  {
    id: "3",
    title: "La même ruelle",
    date: "Le hasard",
    description:
      "Puis, la vie nous a rapprochés d'une manière inattendue. Elle a quitté l'hôtel où elle logeait et a pris un studio… sans savoir qu'il se trouvait dans ma ruelle. Un jour, nous nous sommes croisés par hasard. C'est ce jour-là qu'elle m'a montré où elle habitait, et moi aussi.",
  },
  {
    id: "4",
    title: "Voisins et cours d'anglais",
    date: "Enfin les leçons",
    description:
      "À partir de ce moment, j'ai enfin commencé à lui donner des cours d'anglais, puisque nous étions voisins. Avec le temps, après les cours, nous restions discuter… puis regarder la télévision ensemble…",
  },
  {
    id: "5",
    title: "Quelque chose de plus",
    date: "L'amour",
    description:
      "Et petit à petit, sans vraiment nous en rendre compte, quelque chose de plus fort est né entre nous. Ce qui avait commencé par le travail, l'apprentissage et la proximité est devenu une relation sincère et amoureuse.",
  },
  {
    id: "6",
    title: "Le grand jour",
    date: "2026",
    description:
      "Le plus beau jour de notre vie. Merci à tous ceux qui partagent ce moment avec nous.",
  },
];

const QUOTES = [
  "L'amour ne consiste pas à se regarder l'un l'autre, mais à regarder ensemble dans la même direction.",
  "Le mariage, c'est aimer quelqu'un pour toujours, un jour à la fois.",
  "Deux âmes en une seule pensée, deux cœurs qui ne battent qu'à l'unisson.",
  "Le plus grand bonheur de la vie est d'être aimé pour ce que l'on est.",
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header names="Berges & Brest" />
      <Hero
        weddingDateISO={process.env.NEXT_PUBLIC_WEDDING_DATE || "2026-02-21"}
        weddingHour={process.env.NEXT_PUBLIC_WEDDING_HOUR ? parseInt(process.env.NEXT_PUBLIC_WEDDING_HOUR, 10) : 14}
      />
      <CeremonyModal />
      <Location ceremonyTime={process.env.NEXT_PUBLIC_WEDDING_TIME || "14h00"} />
      <SectionDivider variant="heart" quote={QUOTES[0]} />
      <DressCode color="bleu foncé" />
      <SectionDivider variant="ring" quote={QUOTES[1]} />
      <section id="galerie" className="py-10 sm:py-16 md:py-20 scroll-mt-16 md:scroll-mt-20 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-800 text-center mb-8 sm:mb-12">
            Galerie
          </h2>
          <MediaGallery />
        </div>
      </section>
      <SectionDivider variant="heart" quote={QUOTES[2]} />
      <section id="timeline" className="py-10 sm:py-16 md:py-20 scroll-mt-16 md:scroll-mt-20 px-3 sm:px-6 bg-champagne-50/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-800 text-center mb-10 sm:mb-16">
            Notre histoire
          </h2>
          <Timeline steps={TIMELINE_STEPS} />
        </div>
      </section>
      <SectionDivider variant="ring" quote={QUOTES[3]} />
      <section id="playlist" className="py-10 sm:py-16 md:py-20 scroll-mt-16 md:scroll-mt-20 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-800 text-center mb-8 sm:mb-12">
            Notre playlist
          </h2>
          <YouTubePlayer />
        </div>
      </section>

      <Guestbook />
      <Footer />
      <BackToTop />
    </main>
  );
}
