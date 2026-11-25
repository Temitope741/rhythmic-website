import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

/**
 * Rhythmic Archive
 *
 * Every image placed in `src/assets/archive/` shows up here automatically.
 * Name files with a category prefix to make them filterable:
 *   weddings-01.jpg, portraits-02.jpg, branding-03.jpg, events-04.jpg
 * Files without a recognised prefix still appear under "All".
 */

const CATEGORY_LABELS: Record<string, string> = {
  weddings: 'Weddings',
  portraits: 'Portraits',
  branding: 'Branding',
  events: 'Events',
};

interface Photo {
  id: string;
  src: string;
  category: string | null;
  alt: string;
}

const modules = import.meta.glob(
  '../assets/archive/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}',
  { eager: true }
) as Record<string, { default: string }>;

const photos: Photo[] = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, mod], i) => {
    const file = path.split('/').pop() ?? '';
    const prefix = file.split(/[-_ .]/)[0].toLowerCase();
    const category = prefix in CATEGORY_LABELS ? prefix : null;
    const label = category ? `${CATEGORY_LABELS[category]} photograph` : 'Photograph';
    return {
      id: path,
      src: mod.default,
      category,
      alt: `${label} ${i + 1} by Ayomide Babs`,
    };
  });

const availableCategories = Object.keys(CATEGORY_LABELS).filter((c) =>
  photos.some((p) => p.category === c)
);

/* ------------------------------------------------------------------ */
/* Gallery tile                                                        */
/* ------------------------------------------------------------------ */

interface TileProps {
  photo: Photo;
  index: number;
  onOpen: (index: number) => void;
}

const Tile = ({ photo, index, onOpen }: TileProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`View larger: ${photo.alt}`}
      style={{ minHeight: loaded ? undefined : 280 }}
      className="group relative block w-full mb-5 break-inside-avoid overflow-hidden rounded-2xl bg-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/60"
    >
      <img
        ref={(el) => {
          // Covers images that were already cached before React attached onLoad
          if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
        }}
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`block w-full h-auto transition-all duration-700 ease-out group-hover:scale-[1.03] ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-4 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300">
        <span className="text-white text-sm font-medium tracking-wide">
          {photo.category ? CATEGORY_LABELS[photo.category] : 'Rhythmic Archive'}
        </span>
        <Maximize2 className="w-5 h-5 text-white" aria-hidden="true" />
      </div>
    </button>
  );
};

/* ------------------------------------------------------------------ */
/* Lightbox                                                            */
/* ------------------------------------------------------------------ */

interface LightboxProps {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNav: (dir: 1 | -1) => void;
}

const Lightbox = ({ photos: list, index, onClose, onNav }: LightboxProps) => {
  const touchStartX = useRef<number | null>(null);
  const photo = list[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, onNav]);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 50) onNav(delta < 0 ? 1 : -1);
  };

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
      onClick={onClose}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close viewer"
        className="absolute top-4 right-4 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {list.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNav(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-6 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
            aria-label="Next photo"
            className="absolute right-2 sm:right-6 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      <figure className="max-w-[92vw] sm:max-w-[80vw]" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.src}
          alt={photo.alt}
          decoding="async"
          className="max-h-[82vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
        />
        <figcaption className="mt-4 flex items-center justify-between text-sm text-white/70">
          <span>{photo.category ? CATEGORY_LABELS[photo.category] : 'Rhythmic Archive'}</span>
          <span className="tabular-nums">
            {index + 1} / {list.length}
          </span>
        </figcaption>
      </figure>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const Archive = () => {
  const [params, setParams] = useSearchParams();
  const requested = params.get('category') ?? 'all';
  const active = availableCategories.includes(requested) ? requested : 'all';

  const filtered = useMemo(
    () => (active === 'all' ? photos : photos.filter((p) => p.category === active)),
    [active]
  );

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const count = filtered.length;

  const closeViewer = useCallback(() => setOpenIndex(null), []);
  const navViewer = useCallback(
    (dir: 1 | -1) =>
      setOpenIndex((i) => (i === null || count === 0 ? i : (i + dir + count) % count)),
    [count]
  );

  const setFilter = (category: string) => {
    setOpenIndex(null);
    setParams(category === 'all' ? {} : { category }, { replace: true });
  };

  const chips = ['all', ...availableCategories];

  return (
    <div className="pt-16">
      {/* Page header */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-amber-600 mb-4">
            Rhythmic Archive
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 mb-6">
            Rhythmic <span className="text-amber-500">Archive</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The full collection: weddings, portraits, branding and live events, each frame
            telling its own story.
          </p>
        </div>
      </section>

      {/* Filters */}
      {availableCategories.length > 0 && (
        <div className="sticky top-16 z-30 bg-white/90 backdrop-blur border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="Filter photos">
              {chips.map((c) => {
                const selected = c === active;
                return (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setFilter(c)}
                    className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                      selected
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-600 border border-gray-300 hover:border-amber-500 hover:text-amber-600'
                    }`}
                  >
                    {c === 'all' ? 'All' : CATEGORY_LABELS[c]}
                  </button>
                );
              })}
            </div>
            <p className="hidden sm:block text-sm text-gray-500 tabular-nums">
              {count} {count === 1 ? 'photograph' : 'photographs'}
            </p>
          </div>
        </div>
      )}

      {/* Gallery */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {photos.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              <p className="text-lg font-semibold text-gray-700 mb-2">The archive is empty</p>
              <p>
                Add images to <code className="font-mono">src/assets/archive/</code> and they
                will appear here.
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
              {filtered.map((photo, i) => (
                <Tile key={photo.id} photo={photo} index={i} onOpen={setOpenIndex} />
              ))}
            </div>
          )}
        </div>
      </section>

      {openIndex !== null && (
        <Lightbox photos={filtered} index={openIndex} onClose={closeViewer} onNav={navViewer} />
      )}
    </div>
  );
};

export default Archive;