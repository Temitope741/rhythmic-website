import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const disciplines = [
  {
    no: '01',
    slug: 'weddings',
    title: 'Weddings',
    blurb: 'Full wedding day coverage, from the first preparations to the last dance.',
  },
  {
    no: '02',
    slug: 'portraits',
    title: 'Portraits',
    blurb: 'Individual, couple and family sessions with room for your personality to show.',
  },
  {
    no: '03',
    slug: 'branding',
    title: 'Branding',
    blurb: 'Headshots, products and brand imagery that tell your business story.',
  },
  {
    no: '04',
    slug: 'events',
    title: 'Events',
    blurb: 'Live performances, concerts and celebrations, with the candid moments included.',
  },
];

const RecentWork = () => {
  return (
    <section id="portfolio" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Intro */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="text-sm font-semibold tracking-[0.2em] uppercase text-amber-600 mb-4">
                Rhythmic Archive
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">Recent Work</h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                A glimpse into some of my favorite captures - each telling a unique story.
              </p>
              <Link
                to="/archive"
                className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Explore the Rhythmic Archive
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Index of work */}
          <ol className="lg:col-span-7 border-t border-gray-200">
            {disciplines.map((d) => (
              <li key={d.slug}>
                <Link
                  to={`/archive?category=${d.slug}`}
                  aria-label={`View ${d.title} in the Rhythmic Archive`}
                  className="group flex items-center gap-5 sm:gap-8 py-8 px-2 -mx-2 rounded-xl border-b border-gray-200 hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/60"
                >
                  <span className="w-8 text-sm font-semibold tabular-nums text-gray-400 group-hover:text-amber-500 transition-colors duration-300">
                    {d.no}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 transition-transform duration-300 group-hover:translate-x-2">
                      {d.title}
                    </h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">{d.blurb}</p>
                  </div>
                  <span className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-all duration-300 group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-white">
                    <ArrowUpRight className="w-5 h-5" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default RecentWork;