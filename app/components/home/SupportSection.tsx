export type SupportSectionData = {
  id?: number;
  heading: string;
  plan_tabs?: string;
  cta_text?: string;
  cta_link?: string | null;
  tabs?: string[];
};

type Props = {
  data: SupportSectionData;
};

function tabLabels(data: SupportSectionData): string[] {
  if (data.tabs && data.tabs.length) return data.tabs;
  if (data.plan_tabs?.trim()) {
    return data.plan_tabs.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

export default function SupportSectionComponent({ data }: Props) {
  const tabs = tabLabels(data);
  const ctaText = (data.cta_text ?? "").trim();
  const ctaLink = data.cta_link?.trim() || null;

  return (
    <section className="bg-black py-14 text-center text-white md:py-20">
      <h2 className="text-2xl font-semibold md:text-3xl">{data.heading}</h2>

      {tabs.length > 0 ? (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {tabs.map((item) => (
            <span
              key={item}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}

      {ctaText ? (
        <div className="mt-8">
          {ctaLink ? (
            <a href={ctaLink} className="inline-block rounded-lg bg-[#3B6CB7] px-6 py-3 text-sm font-medium text-white">
              {ctaText}
            </a>
          ) : (
            <span className="inline-block rounded-lg bg-[#3B6CB7] px-6 py-3 text-sm font-medium">{ctaText}</span>
          )}
        </div>
      ) : null}
    </section>
  );
}
