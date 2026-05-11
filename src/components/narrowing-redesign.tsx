// src/components/narrowing.tsx — full replacement
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, ArrowLeft, CheckCircle2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "./navbar";
import { useLanguage } from "../contexts/language-context";
import { searchConditions, SearchResult, correctQuery } from "../contexts/search-api";
import { API_URL } from "../config";

type Ranker = "bert" | "bm25" | "tfidf";

const EVAL_METRICS = {
  bert:  { p5: 0.84, precision: 0.17, recall: 0.84, f1: 0.28 },
  bm25:  { p5: 0.84, precision: 0.17, recall: 0.84, f1: 0.28 },
  tfidf: { p5: 0.80, precision: 0.16, recall: 0.80, f1: 0.27 },
};

const RESULTS_PER_PAGE = 10;

export function NarrowingRedesign() {
  const location               = useLocation();
  const navigate               = useNavigate();
  const { t, isRTL, language } = useLanguage();

  const query = location.state?.query || "";

  const [searchQuery,       setSearchQuery]       = useState(query);
  const [allResults,        setAllResults]        = useState<{ bert: SearchResult[]; bm25: SearchResult[]; tfidf: SearchResult[] }>({ bert: [], bm25: [], tfidf: [] });
  const [translatedQuery,   setTranslatedQuery]   = useState("");
  const [isLoading,         setIsLoading]         = useState(true);
  const [isTranslating,     setIsTranslating]     = useState(false);
  const [error,             setError]             = useState<string | null>(null);
  const [ranker,            setRanker]            = useState<Ranker>("bert");
  const [timingMs,          setTimingMs]          = useState<number | null>(null);
  const [translatedResults, setTranslatedResults] = useState<Record<string, { name: string; description: string }>>({});
  const [currentPage,       setCurrentPage]       = useState(1);
  const [didYouMean,        setDidYouMean]        = useState<string | null>(null);

  // Run search on mount
  useEffect(() => {
    if (!query) { navigate("/"); return; }
    runSearch(query);
  }, [query]);

  // Reset page when ranker or results change
  useEffect(() => {
    setCurrentPage(1);
  }, [ranker, allResults]);

  // Translate current page results whenever page, results, ranker, or language changes
  useEffect(() => {
    const start = (currentPage - 1) * RESULTS_PER_PAGE;
    const pageResults = allResults[ranker].slice(start, start + RESULTS_PER_PAGE);

    if (!pageResults.length || language === "en") {
      setTranslatedResults({});
      return;
    }

    const payload: Record<string, { name: string; description: string }> = {};
    pageResults.forEach(r => {
      payload[r.docno] = { name: r.name, description: r.description };
    });

    setIsTranslating(true);
    fetch(`${API_URL}/translate`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ fields: payload, targetLanguage: language }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setTranslatedResults(data as Record<string, { name: string; description: string }>);
      })
      .catch(() => setTranslatedResults({}))
      .finally(() => setIsTranslating(false));
  }, [allResults, ranker, language, currentPage]);

  const runSearch = async (q: string) => {
    setIsLoading(true);
    setError(null);
    setDidYouMean(null);
    try {
      const data = await searchConditions(q);
      setAllResults({
        bert:  data.results,
        bm25:  data.bm25Results  ?? data.results,
        tfidf: data.tfidfResults ?? data.results,
      });
      setTranslatedQuery(data.translatedQuery);
      setTimingMs(data.timingMs);

      // ── Did you mean? — fires when results are empty or very few ──
      if (data.results.length === 0) {
        const corrected = await correctQuery(q);
        setDidYouMean(corrected);
      }
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const results          = allResults[ranker];
  const totalPages       = Math.ceil(results.length / RESULTS_PER_PAGE);
  const paginatedResults = results.slice(
    (currentPage - 1) * RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );
  const metrics = EVAL_METRICS[ranker];

  const getLabel = (score: number) => {
    if (score >= 0.75) return t("narrow.high");
    if (score >= 0.5)  return t("narrow.moderate");
    return t("narrow.related_cond");
  };

  const handleNewSearch = (q?: string) => {
    const target = q ?? searchQuery;
    navigate("/narrowing", { state: { query: target } });
    window.location.reload();
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const rankerLabel: Record<Ranker, string> = {
    bert:  "BM25 + PubMedBERT",
    bm25:  "BM25",
    tfidf: "TF-IDF",
  };

  const getDisplayName = (r: SearchResult) => {
    const tr = translatedResults[r.docno];
    if (tr?.name && tr.name !== r.name) return `${tr.name} (${r.name})`;
    return r.name;
  };

  const getDisplayDesc = (r: SearchResult) => {
    const tr = translatedResults[r.docno];
    return tr?.description ?? r.description;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] pt-16" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      {/* Sticky search bar */}
      <div className="sticky top-16 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-[#e2e8f0] dark:border-[#374151] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button onClick={() => navigate("/")}
              className="p-2 hover:bg-[#f8fafc] dark:hover:bg-[#1F2937] rounded-lg transition-colors flex-shrink-0">
              <ArrowLeft className={`w-5 h-5 text-[#64748b] dark:text-[#CBD5E1] ${isRTL ? "rotate-180" : ""}`} />
            </button>
            <div className="flex-1 relative">
              <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]`} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleNewSearch()}
                dir={isRTL ? "rtl" : "ltr"}
                placeholder={t("home.placeholder")}
                className={`w-full ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 bg-[#f8fafc] dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#374151] rounded-lg focus:border-[#3B82F6] focus:outline-none text-[#1e293b] dark:text-[#F9FAFB]`}
              />
            </div>
            <button onClick={() => handleNewSearch()}
              className="px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0">
              {t("narrow.searchBtn")}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Header + ranker switcher */}
        <div className={`flex items-start justify-between mb-2 gap-4 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={isRTL ? "text-right" : ""}>
            <h2 className="text-lg font-semibold text-[#1e293b] dark:text-[#F9FAFB]"
              style={{ fontFamily: "var(--font-family-heading)" }}>
              {isLoading
                ? t("narrow.searching")
                : `${results.length} ${t("narrow.results")} · Page ${currentPage}/${totalPages || 1}`}
              {timingMs !== null && !isLoading && (
                <span className="mx-2 text-sm font-normal text-[#94a3b8]">· {timingMs}ms</span>
              )}
            </h2>
            <p className={`text-sm text-[#64748b] dark:text-[#94A3B8] ${isRTL ? "text-right" : ""}`}>
              {t("narrow.query")}: "{translatedQuery || query}"
            </p>
          </div>

          {/* Ranker switcher */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] rounded-xl p-1">
            {(["bert", "bm25", "tfidf"] as Ranker[]).map(r => (
              <button key={r} onClick={() => setRanker(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  ranker === r
                    ? "bg-[#3B82F6] text-white shadow-sm"
                    : "text-[#64748b] dark:text-[#94a3b8] hover:bg-[#f1f5f9] dark:hover:bg-[#334155]"
                }`}>
                {rankerLabel[r]}
              </button>
            ))}
          </div>
        </div>

        {/* ── Did you mean? ── */}
        <AnimatePresence>
          {didYouMean && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mb-4 text-sm text-[#64748b] dark:text-[#94a3b8]"
            >
              Did you mean{" "}
              <button
                className="text-[#2563EB] dark:text-[#60A5FA] font-medium underline underline-offset-2 hover:text-[#1d4ed8] transition-colors"
                onClick={() => {
                  setDidYouMean(null);
                  handleNewSearch(didYouMean);
                }}
              >
                {didYouMean}
              </button>
              ?
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metrics bar */}
        {!isLoading && !error && (
          <div className={`flex items-center gap-3 mb-6 text-xs text-[#64748b] dark:text-[#94a3b8] flex-wrap ${isRTL ? "flex-row-reverse justify-end text-right" : ""}`}>
            <Info className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-mono">P@5: <span className="text-[#3B82F6] font-bold">{metrics.p5.toFixed(2)}</span></span>
            <span className="text-[#e2e8f0] dark:text-[#334155]">|</span>
            <span className="font-mono">Precision: <span className="text-[#3B82F6] font-bold">{metrics.precision.toFixed(2)}</span></span>
            <span className="text-[#e2e8f0] dark:text-[#334155]">|</span>
            <span className="font-mono">Recall: <span className="text-[#3B82F6] font-bold">{metrics.recall.toFixed(2)}</span></span>
            <span className="text-[#e2e8f0] dark:text-[#334155]">|</span>
            <span className="font-mono">F1: <span className="text-[#3B82F6] font-bold">{metrics.f1.toFixed(2)}</span></span>
            <span className="text-[#e2e8f0] dark:text-[#334155]">|</span>
            <span className="italic">{rankerLabel[ranker]}</span>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-[#64748b] dark:text-[#94A3B8]">{t("narrow.ranking")}</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && <div className="text-center py-12 text-[#EF4444]">{error}</div>}

        {/* Translating overlay */}
        {isTranslating && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-[#3B82F6]/20" />
              <div className="absolute inset-0 rounded-full border-4 border-[#3B82F6] border-t-transparent animate-spin" />
            </div>
            <div className={`text-center ${isRTL ? "text-right" : ""}`}>
              <p className="text-base font-semibold text-[#1e293b] dark:text-[#F9FAFB] mb-1">
                {language === "ar" ? "جارٍ الترجمة..." : language === "fr" ? "Traduction en cours..." : "Traduciendo..."}
              </p>
              <p className="text-sm text-[#64748b] dark:text-[#94A3B8]">
                {language === "ar" ? "يرجى الانتظار قليلاً" : language === "fr" ? "Veuillez patienter" : "Por favor espere"}
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && !isTranslating && (
          <div className="space-y-4">
            {paginatedResults.map((r, i) => (
              <motion.div key={`${ranker}-${r.docno}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => navigate("/result", {
                  state: {
                    condition: {
                      id:             r.docno,
                      name:           r.name,
                      description:    r.description,
                      relevanceScore: r.relevanceScore,
                    },
                    query,
                    matchedSymptoms: r.matchedKeywords,
                    bm25Score:       r.bm25Score,
                  }
                })}
                className="bg-white dark:bg-[#111827] rounded-xl border border-[#e2e8f0] dark:border-[#374151] p-5 hover:border-[#3B82F6] hover:shadow-lg cursor-pointer transition-all group">

                {/* Top row: rank + name + score */}
                <div className={`flex items-start justify-between gap-4 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  {isRTL && (
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm font-semibold text-[#3B82F6]">{getLabel(r.relevanceScore)}</div>
                      <div className="text-xs text-[#94a3b8] mt-0.5">
                        {ranker === "tfidf" ? `TF-IDF: ${r.tfidfScore?.toFixed(1)}` :
                         ranker === "bm25"  ? `BM25: ${r.bm25Score?.toFixed(1)}`   :
                                              `Score: ${r.bertScore?.toFixed(3)}`}
                      </div>
                    </div>
                  )}

                  <div className="flex-1">
                    <div className={`flex items-center gap-3 mb-2 ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                      <span className="text-lg font-semibold text-[#64748b] dark:text-[#94A3B8]">
                        #{(currentPage - 1) * RESULTS_PER_PAGE + i + 1}
                      </span>
                      <h3
                        className={`text-xl font-semibold break-words leading-relaxed text-[#1e293b] dark:text-[#F9FAFB] group-hover:text-[#3B82F6] transition-colors ${isRTL ? "text-right" : ""}`}
                        style={{ fontFamily: "var(--font-family-heading)" }}>
                        {getDisplayName(r)}
                      </h3>
                    </div>
                    <p className={`text-sm leading-7 break-words text-[#64748b] dark:text-[#CBD5E1] ${isRTL ? "text-right" : ""}`}>
                      {getDisplayDesc(r)}
                    </p>
                  </div>

                  {!isRTL && (
                    <div className="flex-shrink-0 ml-4 text-right">
                      <div className="text-sm font-semibold text-[#3B82F6]">{getLabel(r.relevanceScore)}</div>
                      <div className="text-xs text-[#94a3b8] mt-0.5">
                        {ranker === "tfidf" ? `TF-IDF: ${r.tfidfScore?.toFixed(1)}` :
                         ranker === "bm25"  ? `BM25: ${r.bm25Score?.toFixed(1)}`   :
                                              `Score: ${r.bertScore?.toFixed(3)}`}
                      </div>
                    </div>
                  )}
                </div>

                {/* Matched keywords */}
                {r.matchedKeywords.length > 0 && (
                  <div className={`border-t border-[#f1f5f9] dark:border-[#1F2937] pt-3 ${isRTL ? "text-right" : ""}`}>
                    <p className="text-xs text-[#64748b] dark:text-[#94A3B8] mb-2">
                      {t("narrow.matched")}
                    </p>
                    <div className={`flex flex-wrap gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                      {r.matchedKeywords.map(kw => (
                        <span key={kw}
                          className="flex items-center gap-1 px-2 py-1 bg-[#DBEAFE] dark:bg-[#1F2937] text-[#2563EB] dark:text-[#60A5FA] rounded-full text-xs">
                          <CheckCircle2 className="w-3 h-3" />{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`flex items-center justify-center gap-2 mt-8 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[#64748b] disabled:opacity-40 hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
                >
                  {isRTL ? "التالي" : "Previous"}
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => goToPage(page)}
                    className={`w-9 h-9 text-sm font-semibold rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-[#3B82F6] text-white shadow-sm"
                        : "border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[#64748b] hover:bg-[#f1f5f9] dark:hover:bg-[#334155]"
                    }`}>
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-semibold rounded-lg border border-[#e2e8f0] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[#64748b] disabled:opacity-40 hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
                >
                  {isRTL ? "السابق" : "Next"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
