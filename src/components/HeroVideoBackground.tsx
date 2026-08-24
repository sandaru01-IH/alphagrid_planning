/** Subtle urban-planning video backdrop for the homepage hero. */
const VIDEO_SOURCES = [
  // Aerial city / urban development (Pexels — free licence)
  "https://videos.pexels.com/video-files/3253695/3253695-sd_640_360_30fps.mp4",
  "https://videos.pexels.com/video-files/2795173/2795173-sd_640_360_30fps.mp4",
];

export default function HeroVideoBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0.22, filter: "saturate(0.7) blur(1px)" }}
      >
        {VIDEO_SOURCES.map((src) => (
          <source key={src} src={src} type="video/mp4" />
        ))}
      </video>
      {/* Readability overlays — keeps text legible over video */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, color-mix(in srgb, var(--surface-0) 94%, transparent) 0%, color-mix(in srgb, var(--surface-0) 78%, transparent) 55%, color-mix(in srgb, var(--surface-0) 88%, transparent) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 40%, color-mix(in srgb, var(--brand) 6%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}
