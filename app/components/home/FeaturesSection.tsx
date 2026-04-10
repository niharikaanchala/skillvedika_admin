export type FeatureItem = {
  id: number;
  title: string;
  description?: string;
  icon?: string;
};

type Props = {
  data: FeatureItem[];
  heading: string;
  intro: string;
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function FeaturesSection({ data, heading, intro }: Props) {
  const h = heading.trim();
  const introT = intro.trim();
  const showCopy = Boolean(h || introT);

  return (
    <section className="bg-[#EEF3F8] px-6 py-12 md:px-12 md:py-16">
      <div
        className={`mx-auto flex max-w-6xl flex-col gap-10 ${showCopy ? "md:flex-row md:items-start md:justify-between" : ""}`}
      >
        {showCopy ? (
          <div className="max-w-lg shrink-0">
            {h ? <h2 className="text-2xl font-bold leading-snug text-gray-900 md:text-3xl">{h}</h2> : null}
            {introT ? <p className="mt-4 text-gray-600">{introT}</p> : null}
          </div>
        ) : null}
        {data.length > 0 ? (
          <div className={`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 ${showCopy ? "max-w-xl" : "max-w-4xl md:mx-auto"}`}>
            {data.map((f) => (
              <div
                key={f.id}
                className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm"
              >
                <div className="mt-0.5 shrink-0 rounded-full bg-[#3B6CB7]/10 p-2">
                  {f.icon?.trim() ? (
                    <span className="flex h-5 w-5 items-center justify-center text-xs font-bold text-[#3B6CB7]">
                      {f.icon.trim().slice(0, 2)}
                    </span>
                  ) : (
                    <CheckIcon className="text-[#3B6CB7]" />
                  )}
                </div>
                <div>
                  <span className="font-medium text-gray-900">{f.title}</span>
                  {f.description ? <p className="mt-1 text-sm text-gray-600">{f.description}</p> : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
