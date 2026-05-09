import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "./navbar";
import { useLanguage } from "../contexts/language-context";

interface Suggestion {
  docno: string;
  name: string;
  score: number;
}

export function Home() {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const [searchQuery,      setSearchQuery]      = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [suggestions,      setSuggestions]      = useState<Suggestion[]>([]);
  const [showSuggestions,  setShowSuggestions]  = useState(false);
  // ── NEW: tracks which suggestion row is keyboard-highlighted (-1 = none) ──
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  // Ref to the suggestions list so we can scroll highlighted items into view
  const listRef       = useRef<HTMLDivElement>(null);

  const popularSearches = [
    { key: "home.pop.headache", query: "headache" },
    { key: "home.pop.chest",    query: "chest pain" },
    { key: "home.pop.fever",    query: "fever and cough" },
    { key: "home.pop.stomach",  query: "stomach ache" },
    { key: "home.pop.back",     query: "back pain" },
    { key: "home.pop.dizzy",    query: "dizziness" },
  ];

  // ── Close suggestions when clicking outside ──────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Scroll highlighted item into view (mirrors Google behaviour) ──────────
  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[
      // +1 to skip the header row
      highlightedIndex + 1
    ] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  // ── Debounced TF-IDF autocomplete fetch ───────────────────────────────────
  const fetchSuggestions = (q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Reset highlight whenever the query changes
    setHighlightedIndex(-1);

    if (!q.trim() || q.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(
          `http://localhost:8000/autocomplete?q=${encodeURIComponent(q.trim())}&limit=8`
        );
        if (!res.ok) return;
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
        setShowSuggestions((data.suggestions ?? []).length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 180);
  };

  // ── Symptom tag helpers ───────────────────────────────────────────────────
  const addSymptom = (symptom: string) => {
    const trimmed = symptom.trim();
    if (trimmed && !selectedSymptoms.includes(trimmed)) {
      setSelectedSymptoms(prev => [...prev, trimmed]);
    }
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const removeSymptom = (s: string) =>
    setSelectedSymptoms(prev => prev.filter(x => x !== s));

  const handleSearch = () => {
    const symptoms = searchQuery.trim()
      ? [...selectedSymptoms, searchQuery.trim()]
      : selectedSymptoms;
    if (symptoms.length === 0) return;
    navigate("/narrowing", { state: { query: symptoms.join(", ") } });
  };

  // ── Keyboard handler — Google-style arrow navigation ─────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Always close on Escape
    if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      return;
    }

    // Arrow navigation (only when dropdown is visible)
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault(); // stop cursor jumping to end of input
        setHighlightedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0   // wrap to top
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault(); // stop cursor jumping to start of input
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1   // wrap to bottom
        );
        return;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (showSuggestions && highlightedIndex >= 0) {
        // User arrowed down to a suggestion → select it
        addSymptom(suggestions[highlightedIndex].name);
      } else if (searchQuery.trim()) {
        // User typed something but never highlighted → add raw input as tag
        addSymptom(searchQuery);
      } else {
        // Nothing typed, no highlight → fire the search
        handleSearch();
      }
    }
  };

  // ── Score → bar width ─────────────────────────────────────────────────────
  const maxScore = suggestions.length > 0
    ? Math.max(...suggestions.map(s => s.score))
    : 1;

  const scoreToWidth = (score: number) =>
    Math.round((score / (maxScore || 1)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-[#0B1220] dark:via-[#0B1220] dark:to-[#0B1220] flex items-center justify-center px-4 py-12 pt-24">
      <Navbar />

      <div className="max-w-4xl w-full">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1
            className="text-5xl md:text-6xl font-bold text-[#1e293b] dark:text-[#F9FAFB] mb-4"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            {t("home.title")}
          </h1>
          <p className="text-lg md:text-xl text-[#64748b] dark:text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            {t("home.subtitle")}
          </p>
        </motion.div>

        {/* ── Search bar + autocomplete dropdown ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-4"
        >
          <div className="relative" ref={searchWrapRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-[#64748b] dark:text-[#94a3b8]" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  fetchSuggestions(e.target.value);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                // ── Updated: use the new keyboard handler ──
                onKeyDown={handleKeyDown}
                dir={isRTL ? "rtl" : "ltr"}
                placeholder={t("home.placeholder")}
                className={`w-full pl-12 pr-12 py-4 bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl border-2 border-[#e2e8f0] dark:border-[#334155]
                  focus:border-[#2563EB] dark:focus:border-[#3B82F6] focus:outline-none focus:ring-4 focus:ring-[#2563EB]/10
                  text-lg text-[#1e293b] dark:text-[#F8FAFC] placeholder:text-[#94a3b8] dark:placeholder:text-[#475569]
                  transition-all duration-200 ${isRTL ? "text-right pr-12 pl-4" : ""}`}
              />

              {searchQuery.trim() && (
                <button
                  onMouseDown={e => { e.preventDefault(); addSymptom(searchQuery); }}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#3B82F6] hover:text-[#2563EB]"
                  aria-label="Add symptom"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* ── Autocomplete dropdown ── */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  ref={listRef}
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  {/* Header row — doesn't count as an index */}
                  <div className="px-4 py-2 border-b border-[#f1f5f9] dark:border-[#334155] flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest">
                      Conditions matching your input
                    </span>
                    <span className="text-[10px] text-[#94a3b8]">TF-IDF similarity</span>
                  </div>

                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onMouseDown={e => { e.preventDefault(); addSymptom(s.name); }}
                      // ── Highlight on mouse hover too (keeps parity with arrow nav) ──
                      onMouseEnter={() => setHighlightedIndex(i)}
                      onMouseLeave={() => setHighlightedIndex(-1)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left border-b border-[#f1f5f9] dark:border-[#1e293b] last:border-0 transition-colors ${
                        highlightedIndex === i
                          ? "bg-[#eff6ff] dark:bg-[#1e3a5f]"   // highlighted row
                          : "hover:bg-[#f1f5f9] dark:hover:bg-[#334155]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Show an arrow icon when keyboard-highlighted, search icon otherwise */}
                        {highlightedIndex === i ? (
                          <Search className="w-3.5 h-3.5 text-[#3b82f6] flex-shrink-0" />
                        ) : (
                          <Search className="w-3.5 h-3.5 text-[#94a3b8] flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm ${
                            highlightedIndex === i
                              ? "text-[#2563eb] dark:text-[#93c5fd] font-medium"
                              : "text-[#0f172a] dark:text-[#f1f5f9]"
                          }`}
                        >
                          {s.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <span className="text-[10px] text-[#94a3b8] min-w-[28px] text-right">
                          {scoreToWidth(s.score)}%
                        </span>
                        <div className="w-16 h-1.5 bg-[#e2e8f0] dark:bg-[#334155] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#3b82f6] rounded-full transition-all"
                            style={{ width: `${scoreToWidth(s.score)}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Selected symptom tags ── */}
        <AnimatePresence>
          {selectedSymptoms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white dark:bg-[#1e293b] rounded-xl border-2 border-[#3B82F6] dark:border-[#60A5FA] p-4 shadow-lg">
                <div className={`flex items-center justify-between mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <p
                    className="text-sm font-semibold text-[#1e293b] dark:text-[#F9FAFB]"
                    style={{ fontFamily: "var(--font-family-heading)" }}
                  >
                    {t("home.selected")} ({selectedSymptoms.length})
                  </p>
                  <button
                    onClick={() => setSelectedSymptoms([])}
                    className="text-xs text-[#64748b] dark:text-[#94A3B8] hover:text-[#EF4444] transition-colors"
                  >
                    {t("home.clearAll")}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <AnimatePresence>
                    {selectedSymptoms.map(symptom => (
                      <motion.div
                        key={symptom}
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#DBEAFE] dark:bg-[#1F2937] text-[#2563EB] dark:text-[#60A5FA] rounded-full border border-[#3B82F6] dark:border-[#60A5FA]"
                      >
                        <span className="text-sm font-medium">{symptom}</span>
                        <button
                          onClick={() => removeSymptom(symptom)}
                          className="hover:bg-[#EF4444]/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <button
                  onClick={handleSearch}
                  className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl font-semibold transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                  style={{ fontFamily: "var(--font-family-heading)" }}
                >
                  <Search className="w-5 h-5" />
                  {t("home.searchBtn")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Trust line ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-center mb-12"
        >
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">{t("home.trusted")}</p>
        </motion.div>

        {/* ── Popular searches ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-6"
        >
          <div className={`flex items-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <TrendingUp className="w-4 h-4 text-[#64748b] dark:text-[#94a3b8]" />
            <h3
              className="text-sm text-[#64748b] dark:text-[#94a3b8]"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              {t("home.popular")}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((s, i) => (
              <motion.button
                key={s.key}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.45 + i * 0.05 }}
                onClick={() => navigate("/narrowing", { state: { query: s.query } })}
                className="px-4 py-2 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-full text-sm text-[#1e293b] dark:text-[#F8FAFC] hover:bg-[#f8fafc] dark:hover:bg-[#334155] hover:border-[#2563EB] dark:hover:border-[#3B82F6] transition-all active:scale-95"
              >
                {t(s.key)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Disclaimer ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-[#94a3b8] dark:text-[#64748b]">{t("home.disclaimer")}</p>
        </motion.div>

      </div>
    </div>
  );
}