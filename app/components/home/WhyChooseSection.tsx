export type WhyChooseItem = {
  id: number;
  title: string;
  description: string;
  icon?: string;
};

type Props = {
  data: WhyChooseItem[];
  heading: string;
  intro: string;
};

function badgeText(item: WhyChooseItem): string {
  const ic = item.icon?.trim();
  if (ic) return ic.slice(0, 2);
  const t = item.title?.trim();
  if (t) return t.charAt(0).toUpperCase();
  return "•";
}

export default function WhyChooseSection({ data, heading, intro }: Props) {
  const h = heading.trim();
  const introT = intro.trim();
  const showHeader = Boolean(h || introT);

  return (
    <section className="bg-white px-6 py-12 md:px-10 md:py-16">
      {showHeader ? (
        <div className="text-center">
          {h ? <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">{h}</h2> : null}
          {introT ? <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 md:text-base">{introT}</p> : null}
        </div>
      ) : null}
      {data.length > 0 ? (
        <div className="mx-auto mt-10 grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-100 bg-[#EEF3F8] p-5 text-left shadow-sm"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#3B6CB7] text-sm font-bold text-white">
                {badgeText(item)}
              </div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
