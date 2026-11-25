"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import FeatureIcon from "@/components/FeatureIcon";
import type { Church, Province } from "@/lib/mass";

type JadwalSearchHeroProps = {
  churches: Church[];
  provincesCount: number;
  citiesCount: number;
  churchesCount: number;
  lang: string;
};

export default function JadwalSearchHero({
  churches,
  provincesCount,
  citiesCount,
  churchesCount,
  lang,
}: JadwalSearchHeroProps) {
  const router = useRouter();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Dropdown states
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Derived data for dropdowns
  const provinces = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of churches) {
      map.set(c.province_slug, c.province_name);
    }
    return Array.from(map.entries())
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "id"));
  }, [churches]);

  const cities = useMemo(() => {
    if (!selectedProvince) return [];
    const map = new Map<string, string>();
    for (const c of churches) {
      if (c.province_slug === selectedProvince) {
        map.set(c.regency_slug, c.regency_name);
      }
    }
    return Array.from(map.entries())
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "id"));
  }, [churches, selectedProvince]);

  // Search results
  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase();
    return churches
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.regency_name.toLowerCase().includes(q) ||
          c.province_name.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [searchQuery, churches]);

  const handleSearchNavigate = (church: Church) => {
    router.push(`/${lang}/jadwal-misa/${church.province_slug}/${church.regency_slug}/${church.slug}`);
    setShowDropdown(false);
  };

  const handleShowArea = () => {
    if (selectedProvince && selectedCity) {
      // Navigate to the province page. If we want to support city level in the future, we could, but right now the province page lists all cities.
      router.push(`/${lang}/jadwal-misa/${selectedProvince}#${selectedCity}`);
    } else if (selectedProvince) {
      router.push(`/${lang}/jadwal-misa/${selectedProvince}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-5 pt-24 pb-16 relative z-10 w-full">
      {/* Icon */}
      <div className="relative grid h-[4.5rem] w-[4.5rem] place-items-center overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-gold/5 shadow-[0_0_30px_rgba(214,176,114,0.15)] text-brand-gold-hover mb-8">
        <FeatureIcon name="church" className="h-8 w-8" />
      </div>

      {/* Heading */}
      <h1 className="text-gradient-gold text-4xl sm:text-5xl font-bold tracking-tight text-center">
        Jadwal Misa Kudus
      </h1>
      
      {/* Lead */}
      <p className="mt-4 text-[0.95rem] leading-relaxed text-brand-muted text-center max-w-lg">
        Temukan waktu Misa di paroki, gereja, dan kapel Katolik di seluruh Indonesia.
      </p>

      {/* Stats */}
      <div className="mt-8 flex items-center justify-center gap-4 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-[0.8rem] text-brand-muted backdrop-blur-sm">
        <span>
          <span className="font-semibold text-brand-gold">{churchesCount}</span> gereja
        </span>
        <span className="h-3 w-px bg-white/20"></span>
        <span>
          <span className="font-semibold text-brand-gold">{citiesCount}</span> kota
        </span>
        <span className="h-3 w-px bg-white/20"></span>
        <span>
          <span className="font-semibold text-brand-gold">{provincesCount}</span> provinsi
        </span>
      </div>

      {/* Search Bar */}
      <div className="mt-12 w-full max-w-3xl relative">
        <div className="relative flex w-full items-center overflow-hidden rounded-full border border-white/10 bg-[#1f2026] focus-within:border-brand-gold/50 focus-within:ring-1 focus-within:ring-brand-gold/50 transition-all">
          <div className="pl-6 pr-3 text-brand-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            className="w-full bg-transparent py-4 text-brand-light placeholder-brand-muted focus:outline-none"
            placeholder="Cari nama gereja atau paroki..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          <div className="pr-2">
            <button className="rounded-full bg-brand-gold px-6 py-2.5 text-sm font-semibold text-brand-bg transition-transform hover:scale-105">
              Cari
            </button>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#1f2026] shadow-2xl z-50">
            <ul className="max-h-[300px] overflow-auto py-2">
              {searchResults.map((c) => (
                <li key={c.slug}>
                  <button
                    onClick={() => handleSearchNavigate(c)}
                    className="flex w-full flex-col items-start px-6 py-3 text-left transition-colors hover:bg-white/5 focus:bg-white/5 focus:outline-none"
                  >
                    <span className="text-[0.95rem] font-medium text-brand-light">{c.name}</span>
                    <span className="text-xs text-brand-muted mt-0.5">
                      {c.regency_name}, {c.province_name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {showDropdown && searchQuery.length >= 2 && searchResults.length === 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-white/10 bg-[#1f2026] shadow-2xl z-50 p-6 text-center text-sm text-brand-muted">
            Gereja tidak ditemukan. Coba kata kunci lain.
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mt-14 flex w-full max-w-3xl items-center gap-4 opacity-60">
        <hr className="flex-1 border-white/10" />
        <span className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-brand-muted">
          ATAU TELUSURI WILAYAH
        </span>
        <hr className="flex-1 border-white/10" />
      </div>

      {/* Dropdowns Section */}
      <div className="mt-10 w-full max-w-3xl rounded-3xl border border-white/5 bg-[#232429] p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Province */}
          <div>
            <label className="mb-2.5 block text-[0.65rem] font-bold tracking-[0.15em] uppercase text-brand-muted">
              PROVINSI
            </label>
            <div className="relative">
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedCity("");
                }}
                className="w-full appearance-none rounded-xl border border-white/10 bg-[#1A1B1F] px-4 py-3.5 text-sm text-brand-light outline-none focus:border-brand-gold/50"
              >
                <option value="" disabled>Pilih provinsi</option>
                {provinces.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-brand-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="mb-2.5 block text-[0.65rem] font-bold tracking-[0.15em] uppercase text-brand-muted">
              KOTA / KABUPATEN
            </label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedProvince}
                className="w-full appearance-none rounded-xl border border-white/10 bg-[#1A1B1F] px-4 py-3.5 text-sm text-brand-light outline-none focus:border-brand-gold/50 disabled:opacity-50"
              >
                <option value="" disabled>
                  {selectedProvince ? "Pilih kota" : "Pilih provinsi dulu"}
                </option>
                {cities.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-brand-muted">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleShowArea}
          disabled={!selectedProvince}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#61523c] px-4 py-3.5 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-gold disabled:opacity-50 disabled:hover:bg-[#61523c]"
        >
          Tampilkan Gereja
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

