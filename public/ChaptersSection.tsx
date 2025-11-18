import React from 'react';

interface Chapter {
  id: string;
  number: string;
  title: string;
  tagline: string;
  role: string;
  stack: string;
  outcome: string;
  description: string;
  caseStudyUrl: string;
  media: {
    type: 'video' | 'image';
    src: string;
    alt?: string;
    caption: string;
    fallbackSrc?: string;
  };
}

const chapters: Chapter[] = [
  {
    id: 'chapter-samepath',
    number: '01',
    title: 'SamePath',
    tagline: 'Mobile scheduling assistant that keeps classmates in sync.',
    role: 'Founder · Product Design · Full Stack Development',
    stack: 'React Native · TypeScript · Flask · Azure Table Storage',
    outcome: 'Private beta surfacing shared classes and free time for study crews.',
    description: 'SamePath turns raw schedules into context-aware suggestions so planning a study session takes seconds. Privacy controls keep each student in charge of what's shared.',
    caseStudyUrl: 'projects/samepath.html',
    media: {
      type: 'video',
      src: 'Images/SamePath/screen-recording.mp4',
      fallbackSrc: 'Images/SamePath/screen-recording.mov',
      caption: 'Walkthrough of onboarding, schedule reveals, and meet-up planning. Download the MOV if playback stalls.',
    },
  },
  {
    id: 'chapter-sportspredictor',
    number: '02',
    title: 'SportsPredictor',
    tagline: 'Weekly NFL pipeline with explainable matchup forecasts.',
    role: 'Developer · Data Pipeline Engineer',
    stack: 'Python · Pandas · scikit-learn · BeautifulSoup',
    outcome: 'Nightly refresh with CLI tools for batch reports and single-game checks.',
    description: 'The system normalizes league stats, injuries, weather, and odds to produce forecasts with confidence percentages and callouts that are easy to share with friends.',
    caseStudyUrl: 'projects/sportspredictor.html',
    media: {
      type: 'image',
      src: 'Images/sportsPredictor/SportsPredictorSingleMatchup.jpg',
      alt: 'Single matchup summary for SportsPredictor',
      caption: 'Sample CLI output highlighting the drivers behind a pick.',
    },
  },
  {
    id: 'chapter-realestate',
    number: '03',
    title: 'RealEstateHirsch',
    tagline: 'Responsive leasing experience with guided tour scheduling.',
    role: 'Product Designer · Frontend Developer',
    stack: 'HTML · CSS · JavaScript · Express.js · MySQL · Nodemailer',
    outcome: 'Deployed on Render with automated confirmations and booking tools.',
    description: 'The site pairs property storytelling with an interactive scheduler that moves leads from discovery to confirmed tours without manual follow-up.',
    caseStudyUrl: 'projects/realestatehirsch.html',
    media: {
      type: 'image',
      src: 'Images/HirschLeasing/HirschLeasingPreview.jpg',
      alt: 'Preview of the RealEstateHirsch website',
      caption: 'Tap to explore property listings, the tour scheduler, and automated confirmations.',
    },
  },
];

export default function ChaptersSection() {
  return (
    <section className="relative py-20 motion-section overflow-hidden" id="stories" data-section="stories">
      {/* Creative background layers - simplified for performance */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Simple gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(109, 123, 255, 0.08) 0%, rgba(236, 72, 153, 0.06) 50%, rgba(168, 85, 247, 0.05) 100%)`
          }}
        />
        
        {/* Subtle corner accents */}
        <div 
          className="absolute top-0 left-0 w-1/3 h-1/3 opacity-30"
          style={{
            background: `radial-gradient(circle at top left, rgba(109, 123, 255, 0.12), transparent 70%)`
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-1/3 h-1/3 opacity-30"
          style={{
            background: `radial-gradient(circle at bottom right, rgba(236, 72, 153, 0.12), transparent 70%)`
          }}
        />
      </div>

      {/* Spine background */}
      <div className="pointer-events-none absolute inset-x-0 top-8 bottom-0 flex justify-center z-[1]">
        <div className="w-full max-w-6xl rounded-[32px] bg-slate-100/70 shadow-[0_0_80px_rgba(15,23,42,0.08)]" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        <div className="container max-w-6xl mx-auto px-6 md:px-10">
          <header className="section-header max-w-2xl mx-auto mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-heading">
              Project Stories
            </h2>
            <p className="text-lg text-text-secondary">
              Scroll through the chapters or jump straight to the work you want to explore.
            </p>
          </header>

          <nav className="chapter-nav flex flex-wrap justify-center gap-4 mb-12" aria-label="Project chapters">
            {chapters.map((chapter) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                className="px-5 py-2.5 rounded-full border border-card-border bg-surface-soft text-text-secondary font-semibold no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:text-accent"
              >
                {chapter.number} {chapter.title}
              </a>
            ))}
          </nav>

          {chapters.map((chapter) => (
            <article
              key={chapter.id}
              id={chapter.id}
              className="relative mb-16 p-8 md:p-11 rounded-[28px] bg-surface border border-card-border shadow-[0_28px_60px_rgba(15,23,42,0.12)] grid gap-6 md:gap-10 scroll-mt-24"
            >
              {/* Ghost chapter number */}
              <div className="pointer-events-none select-none absolute -top-6 -left-2 md:-top-10 md:-left-4 text-6xl md:text-8xl font-black text-slate-200/70 md:text-slate-200/80 z-0">
                {chapter.number}
              </div>

              <header className="chapter-header grid gap-1 relative z-10">
                <span className="text-sm font-bold tracking-wider uppercase text-text-secondary">
                  Chapter {chapter.number}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-heading">
                  {chapter.title}
                </h3>
                <p className="text-lg text-text-secondary">{chapter.tagline}</p>
              </header>

              <div className="chapter-body grid gap-6 md:gap-10 md:grid-cols-[1fr_1fr] items-start relative z-10">
                <div className="chapter-text">
                  <ul className="list-none p-0 m-0 grid gap-3 mb-6">
                    <li className="font-medium text-text-secondary">
                      <strong>Role:</strong> {chapter.role}
                    </li>
                    <li className="font-medium text-text-secondary">
                      <strong>Stack:</strong> {chapter.stack}
                    </li>
                    <li className="font-medium text-text-secondary">
                      <strong>Outcome:</strong> {chapter.outcome}
                    </li>
                  </ul>
                  <p className="text-text-secondary mb-6">{chapter.description}</p>
                  <div className="chapter-cta">
                    <a
                      href={chapter.caseStudyUrl}
                      className="inline-block px-6 py-3 rounded-lg bg-accent text-white font-semibold no-underline transition-all duration-300 hover:bg-accent-dark hover:shadow-lg"
                    >
                      Read case study
                    </a>
                  </div>
                </div>

                <div className="chapter-media">
                  <figure className="m-0 rounded-[22px] overflow-hidden border border-card-border shadow-[0_24px_50px_rgba(15,23,42,0.12)] bg-surface-soft">
                    {chapter.media.type === 'video' ? (
                      <video
                        className="w-full block project-video project-video-portrait"
                        controls
                        playsInline
                        preload="none"
                      >
                        <source src={chapter.media.src} type="video/mp4" />
                        {chapter.media.fallbackSrc && (
                          <source src={chapter.media.fallbackSrc} type="video/quicktime" />
                        )}
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <a
                        href={chapter.media.src}
                        target="_blank"
                        rel="noopener"
                        className="block"
                      >
                        <img
                          src={chapter.media.src}
                          alt={chapter.media.alt || chapter.title}
                          className="w-full block"
                        />
                      </a>
                    )}
                    <figcaption className="p-4 bg-surface-soft/85 text-sm text-text-secondary">
                      {chapter.media.caption}
                    </figcaption>
                  </figure>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}



