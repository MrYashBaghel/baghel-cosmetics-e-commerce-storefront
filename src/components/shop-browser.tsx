"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, formatPrice, type CategoryKey, type Product } from "@/lib/types";

type CategoryFilter = "all" | CategoryKey;
type SortKey = "featured" | "newest" | "price-low" | "price-high" | "rating";

const categoryOptions: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "All pieces" },
  ...CATEGORIES.map((category) => ({ key: category.key as CategoryFilter, label: category.label })),
];

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest first" },
  { key: "price-low", label: "Price: low to high" },
  { key: "price-high", label: "Price: high to low" },
  { key: "rating", label: "Top rated" },
];

function normalizeSortKey(value: string): SortKey {
  return sortOptions.some((option) => option.key === value) ? (value as SortKey) : "featured";
}

export function ShopBrowser({
  products,
  initialCategory = "all",
  initialQuery = "",
  initialSort = "featured",
}: {
  products: Product[];
  initialCategory?: string;
  initialQuery?: string;
  initialSort?: string;
}) {
  const [category, setCategory] = useState<CategoryFilter>(
    categoryOptions.some((option) => option.key === initialCategory)
      ? (initialCategory as CategoryFilter)
      : "all",
  );
  const [query, setQuery] = useState(initialQuery);
  const [maxPrice, setMaxPrice] = useState(8000);
  const [offersOnly, setOffersOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>(normalizeSortKey(initialSort));
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setCategory(
      categoryOptions.some((option) => option.key === initialCategory)
        ? (initialCategory as CategoryFilter)
        : "all",
    );
    setQuery(initialQuery);
    setSort(normalizeSortKey(initialSort));
  }, [initialCategory, initialQuery, initialSort]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (product.price > maxPrice) return false;
      if (offersOnly && !product.compareAt) return false;
      if (!normalizedQuery) return true;
      const haystack = `${product.name} ${product.collection} ${product.shortDescription} ${product.category} ${product.shades.join(" ")}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating || b.reviewCount - a.reviewCount;
        case "newest":
          return Number(b.isNew) - Number(a.isNew) || b.id - a.id;
        default:
          return Number(b.featured) - Number(a.featured) || Number(b.bestseller) - Number(a.bestseller) || a.id - b.id;
      }
    });
  }, [products, category, query, maxPrice, offersOnly, sort]);

  const resetFilters = () => {
    setCategory("all");
    setQuery("");
    setMaxPrice(8000);
    setOffersOnly(false);
    setSort("featured");
  };

  const activeFilters = category !== "all" || query.trim() !== "" || maxPrice < 8000 || offersOnly;

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-plum/12 pb-6">
        <div>
          <p className="eyebrow text-gold">The collection · {products.length} curated pieces</p>
          <h2 className="display-font mt-2 text-4xl sm:text-5xl">Find your kind of beautiful</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className="btn-outline lg:hidden"
            aria-expanded={filtersOpen}
          >
            {filtersOpen ? <X size={14} /> : <SlidersHorizontal size={14} />} Filters
          </button>
          <label className="flex items-center gap-3">
            <span className="hidden text-[0.65rem] font-bold tracking-[0.14em] text-plum/50 uppercase sm:block">Sort by</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="border border-plum/18 bg-white/60 px-4 py-3 text-xs font-semibold text-plum outline-none focus:border-gold"
              aria-label="Sort products"
            >
              {sortOptions.map((option) => (
                <option key={option.key} value={option.key}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[230px_1fr] xl:gap-14">
        <aside className={`${filtersOpen ? "block" : "hidden"} lg:block`} aria-label="Product filters">
          <div className="lg:sticky lg:top-32">
            <div className="flex items-center justify-between">
              <h3 className="eyebrow text-plum">Refine by</h3>
              {activeFilters && (
                <button type="button" onClick={resetFilters} className="text-[0.65rem] font-bold tracking-[0.1em] text-wine uppercase hover:underline">Clear all</button>
              )}
            </div>

            <div className="mt-6 border-b border-plum/12 pb-7">
              <p className="field-label">Search</p>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Bangles, rose, gifts..."
                className="field-input text-xs"
                aria-label="Search products"
              />
            </div>

            <div className="mt-7 border-b border-plum/12 pb-7">
              <p className="field-label">Category</p>
              <div className="mt-3 space-y-1">
                {categoryOptions.map((option) => {
                  const count = option.key === "all" ? products.length : products.filter((product) => product.category === option.key).length;
                  return (
                    <button
                      type="button"
                      key={option.key}
                      onClick={() => setCategory(option.key)}
                      aria-pressed={category === option.key}
                      className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-xs font-semibold transition-colors ${category === option.key ? "bg-plum text-white" : "text-plum/65 hover:bg-cream hover:text-plum"}`}
                    >
                      <span>{option.label}</span>
                      <span className={category === option.key ? "text-gold" : "text-plum/35"}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7 border-b border-plum/12 pb-7">
              <div className="flex items-center justify-between">
                <p className="field-label mb-0">Maximum price</p>
                <span className="text-xs font-bold text-wine">{maxPrice >= 8000 ? "Any" : formatPrice(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={8000}
                step={250}
                value={maxPrice}
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                className="mt-5 w-full accent-[#b99a68]"
                aria-label="Maximum price"
              />
              <div className="mt-1 flex justify-between text-[0.62rem] text-plum/40">
                <span>₹1,000</span>
                <span>₹8,000+</span>
              </div>
            </div>

            <label className="mt-7 flex cursor-pointer items-center gap-3 text-xs font-semibold text-plum/75">
              <input
                type="checkbox"
                checked={offersOnly}
                onChange={(event) => setOffersOnly(event.target.checked)}
                className="h-4 w-4 accent-[#71394a]"
              />
              Show special offers only
            </label>

            <div className="mt-9 hidden border border-plum/12 bg-cream/60 p-5 lg:block">
              <p className="eyebrow text-gold">A little help?</p>
              <p className="display-font mt-2 text-2xl leading-tight">Not sure which size to choose?</p>
              <p className="mt-2 text-xs leading-5 text-plum/60">Our bangle size guide and shade notes are on every product page.</p>
            </div>
          </div>
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-plum/55">
            <span>Showing <strong className="text-plum">{visibleProducts.length}</strong> of {products.length} pieces</span>
            {activeFilters && (
              <div className="flex flex-wrap gap-2">
                {category !== "all" && <span className="border border-plum/12 bg-white/60 px-3 py-1.5">{categoryOptions.find((option) => option.key === category)?.label}</span>}
                {query.trim() && <span className="border border-plum/12 bg-white/60 px-3 py-1.5">“{query.trim()}”</span>}
                {offersOnly && <span className="border border-plum/12 bg-white/60 px-3 py-1.5">Offers</span>}
                {maxPrice < 8000 && <span className="border border-plum/12 bg-white/60 px-3 py-1.5">Under {formatPrice(maxPrice)}</span>}
              </div>
            )}
          </div>

          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 xl:grid-cols-3">
              {visibleProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} priority={index < 3} />
              ))}
            </div>
          ) : (
            <div className="border border-plum/12 bg-white/50 px-6 py-20 text-center">
              <h3 className="display-font text-4xl">No pieces found</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-plum/60">Try a different search, widen your price range or explore the full collection.</p>
              <button type="button" onClick={resetFilters} className="btn-primary mt-7">Reset filters</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
