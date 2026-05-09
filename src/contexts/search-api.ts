// src/contexts/search-api.ts — full replacement
const MOCK_MODE = false;
const BASE_URL  = "http://localhost:8000";

export interface SearchResult {
  docno:           string;
  name:            string;
  description:     string;
  bm25Score:       number;
  tfidfScore:      number;
  lmScore:         number;
  bertScore:       number;
  relevanceScore:  number;
  matchedKeywords: string[];
  rank:            number;
}

export interface SearchResponse {
  query:           string;
  translatedQuery: string;
  results:         SearchResult[];   // BERT reranked — default
  bm25Results?:    SearchResult[];   // pure BM25 order
  tfidfResults?:   SearchResult[];   // pure TF-IDF order
  timingMs:        number;
  metrics:         Record<string, number | string>;
}

// limit is optional — defaults to 20 (backend default) if not passed
export async function searchConditions(query: string, limit?: number): Promise<SearchResponse> {
  if (MOCK_MODE) {
    await new Promise(r => setTimeout(r, 700));
    return {
      query,
      translatedQuery: query,
      results: [],
      timingMs: 712,
      metrics: {},
    };
  }

  const res = await fetch(`${BASE_URL}/search`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ query, ...(limit !== undefined && { limit }) }),
  });

  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}