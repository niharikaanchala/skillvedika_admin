"use client";

import { useState } from "react";

export type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

type Props = {
  data: FAQItem[];
  heading: string;
  intro: string;
};

export default function FAQSection({ data, heading, intro }: Props) {
  const h = heading.trim();
  const introT = intro.trim();
  const [openId, setOpenId] = useState<number | null>(data[0]?.id ?? null);

  return (
    <section className="bg-white px-6 py-10 md:px-10 md:py-14">
      {(h || introT) && (
        <div className="text-center">
          {h ? <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">{h}</h2> : null}
          {introT ? <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600 md:text-base">{introT}</p> : null}
        </div>
      )}
      {data.length > 0 ? (
        <div className="mx-auto mt-8 max-w-3xl space-y-2">
          {data.map((faq) => (
            <div key={faq.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="flex w-full items-center justify-between px-5 py-3.5 text-left"
              >
                <span className="text-sm font-medium text-gray-900">{faq.question}</span>
                <span className="text-lg text-[#0F8F7A]">{openId === faq.id ? "−" : "+"}</span>
              </button>
              {openId === faq.id ? (
                <div className="border-t border-gray-100 px-5 pb-4 text-sm text-gray-600">{faq.answer}</div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
