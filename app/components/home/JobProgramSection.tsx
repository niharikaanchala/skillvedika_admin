export type JobProgramItem = {
  id: number;
  title: string;
  description?: string;
};

type Props = {
  data: JobProgramItem[];
  heading: string;
  intro: string;
};

export default function JobProgramSection({ data, heading, intro }: Props) {
  const h = heading.trim();
  const introT = intro.trim();
  const showHeader = Boolean(h || introT);

  return (
    <section className="px-6 py-12 md:px-10 md:py-16">
      {showHeader ? (
        <div className="text-center">
          {h ? <h2 className="text-2xl font-semibold text-gray-900">{h}</h2> : null}
          {introT ? <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 md:text-base">{introT}</p> : null}
        </div>
      ) : null}
      {data.length > 0 ? (
        <div className="mt-10 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-medium text-gray-900">{item.title}</p>
              {item.description ? <p className="mt-2 text-sm text-gray-600">{item.description}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
