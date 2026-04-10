export type HeroSectionData = {
  heading: string;
  subheading?: string;
  image?: string | null;
  cta_text?: string;
  cta_link?: string | null;
  highlights?: string;
  popular_tags?: string;
  right_card_title?: string;
  right_card_subtitle?: string;
  search_placeholder?: string;
};

type Props = {
  data: HeroSectionData;
};

function headingLines(heading: string): [string, string | null] {
  const parts = heading
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length >= 2) return [parts[0], parts.slice(1).join(" ")];
  const idx = heading.indexOf(".");
  if (idx > 0 && idx < heading.length - 1) {
    return [heading.slice(0, idx + 1).trim(), heading.slice(idx + 1).trim()];
  }
  return [heading, null];
}

function highlightLines(text: string | undefined): string[] {
  if (!text?.trim()) return [];
  return text
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function tagList(text: string | undefined): string[] {
  if (!text?.trim()) return [];
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Same structure as the public home hero — preview only, driven by form/API fields. */
export default function HeroSection({ data }: Props) {
  const heading = data.heading?.trim();
  if (!heading) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
        Enter a heading to preview the hero block.
      </div>
    );
  }

  const [line1, line2] = headingLines(heading);
  const subheading = data.subheading?.trim();
  const highlights = highlightLines(data.highlights);
  const tags = tagList(data.popular_tags);
  const searchPh = data.search_placeholder?.trim();
  const ctaText = data.cta_text?.trim();
  const ctaLink = data.cta_link?.trim() || null;
  const cardTitle = data.right_card_title?.trim();
  const cardSubtitle = data.right_card_subtitle?.trim();
  const showRightCard = Boolean(cardTitle || cardSubtitle);
  const showRightVisual = Boolean(data.image) || showRightCard;

  return (
    <section className="flex flex-col items-center justify-between gap-10 bg-[#EEF3F8] px-6 py-12 text-slate-900 md:flex-row md:px-10 md:py-16">
      <div className="max-w-xl">
        <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
          {line1}
          {line2 ? (
            <>
              <br />
              <span className="text-[#3B6CB7]">{line2}</span>
            </>
          ) : null}
        </h1>
        {subheading ? <p className="mt-3 text-gray-600">{subheading}</p> : null}
        {highlights.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
            {highlights.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        ) : null}
        {searchPh ? (
          <div className="mt-6 flex max-w-lg shadow-sm">
            <input
              readOnly
              placeholder={searchPh}
              className="w-full rounded-l-md border border-gray-300 px-4 py-2.5 text-sm outline-none"
            />
            <span className="flex items-center rounded-r-md bg-[#3B6CB7] px-4 text-white">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z"
                  stroke="currentColor"
                  strokeWidth={2}
                />
              </svg>
            </span>
          </div>
        ) : null}
        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {tags.map((t) => (
              <span key={t} className="rounded-full border bg-white px-3 py-1 text-gray-600">
                {t}
              </span>
            ))}
          </div>
        ) : null}
        {ctaText ? (
          <div className="mt-6">
            {ctaLink ? (
              <a href={ctaLink} className="inline-block rounded-md bg-[#3B6CB7] px-5 py-2.5 text-sm font-medium text-white">
                {ctaText}
              </a>
            ) : (
              <span className="inline-block rounded-md bg-[#3B6CB7] px-5 py-2.5 text-sm font-medium text-white">
                {ctaText}
              </span>
            )}
          </div>
        ) : null}
      </div>
      {showRightVisual ? (
        <div className="relative flex h-[220px] w-full max-w-[340px] shrink-0 items-center justify-center md:h-[320px] md:max-w-[400px]">
          <div className="absolute h-full w-full rounded-full bg-gradient-to-br from-white to-slate-200 shadow-inner" />
          {data.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.image}
              alt=""
              className="relative z-10 max-h-[220px] max-w-[220px] rounded-3xl object-contain md:max-h-[280px] md:max-w-[280px]"
            />
          ) : showRightCard ? (
            <div className="relative z-10 grid max-h-[280px] min-h-[200px] w-[260px] place-items-center rounded-3xl border border-white bg-white/80 p-5 text-center shadow-lg backdrop-blur">
              {cardTitle ? <div className="text-lg font-extrabold text-slate-900 md:text-xl">{cardTitle}</div> : null}
              {cardSubtitle ? <div className="mt-2 text-xs text-slate-600 md:text-sm">{cardSubtitle}</div> : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
