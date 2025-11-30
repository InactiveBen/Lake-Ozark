import { useState } from 'react';
import { Marquee } from '@joycostudio/marquee/react';

interface Testimony {
  name: string;
  quote: string;
  year?: string;
}

interface Props {
  testimonies?: Testimony[];
}

const defaultTestimonies: Testimony[] = [
  {
    name: "Sarah M.",
    quote: "God's grace transformed my life when I thought all hope was lost.",
    year: "2023"
  },
  {
    name: "Michael T.",
    quote: "I found peace and purpose through faith in Jesus Christ.",
    year: "2024"
  },
  {
    name: "Jennifer L.",
    quote: "The love of this community led me to salvation.",
    year: "2023"
  },
  {
    name: "David R.",
    quote: "God saved me from darkness and gave me new life.",
    year: "2024"
  },
  {
    name: "Lisa K.",
    quote: "Through prayer and faith, I experienced God's healing power.",
    year: "2023"
  },
  {
    name: "Robert P.",
    quote: "I was lost, but now I'm found. Thank you, Jesus!",
    year: "2024"
  },
  {
    name: "Amanda H.",
    quote: "God's love changed everything. I'm forever grateful.",
    year: "2023"
  },
  {
    name: "James W.",
    quote: "Salvation brought me hope when I had none left.",
    year: "2024"
  }
];

export default function SalvationMarquee({ testimonies = defaultTestimonies }: Props) {
  const [isPaused, setIsPaused] = useState(false);
  
  // Duplicate testimonies for seamless loop
  const duplicatedTestimonies = [...testimonies, ...testimonies];

  return (
    <div className="salvation-marquee-wrapper bg-white overflow-hidden" style={{ fontFamily: "'Albert Sans', system-ui, sans-serif" }}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-brand/10 text-brand text-sm font-medium mb-4">
            Stories of Faith
          </span>
          <h2 className="text-4xl lg:text-5xl font-light mb-6 text-gray-900">
            Lives Transformed by God's Grace
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from those who have found hope, peace, and new life through Jesus Christ
          </p>
        </div>
        
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="py-4"
        >
          <Marquee speed={30} direction={-1} play={!isPaused} rootClassName="salvation-marquee">
            <div style={{ display: 'flex', gap: '12px' }}>
              {duplicatedTestimonies.map((testimony, index) => (
                <div
                  key={`${testimony.name}-${index}`}
                  className="mx-3 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow min-w-[320px] max-w-[380px]"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-brand mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                      <p className="text-gray-700 text-base leading-relaxed flex-1">
                        {testimony.quote}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-900">— {testimony.name}</span>
                      {testimony.year && (
                        <span className="text-xs text-gray-500">{testimony.year}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Marquee>
        </div>
      </div>
    </div>
  );
}

