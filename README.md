# SymptomIQ 🩺

A multilingual medical symptom search engine powered by a hybrid retrieval pipeline combining classical IR models with transformer-based reranking.

---

## 🌐 Live Demo

- **Frontend:** [symptom-iq.vercel.app](https://symptom-iq.vercel.app)
- **Backend API:** [zeyad-nafea-symptomiq-backend.hf.space](https://zeyad-nafea-symptomiq-backend.hf.space)

---

## 📌 Project Overview

SymptomIQ allows users to describe their symptoms in **English, Arabic, French, Spanish, or German** and retrieves the most relevant medical conditions using a multi-stage retrieval pipeline. Results are ranked by three different IR models and reranked using a biomedical BERT model.

---

## ✨ Features

- 🌍 **Multilingual support** — detects and translates queries in 4 languages
- 🔍 **TF-IDF, BM25, and LM-JM** ranking with switchable views
- 🤖 **PubMedBERT reranking** for semantic relevance
- 📖 **UMLS synonym expansion** for medical terminology
- 🔄 **RM3 pseudo-relevance feedback** for query expansion
- 💊 **Detailed condition pages** with symptoms, causes, treatments, and clinical guidance
- 🌐 **Result translation** into Arabic, French, and Spanish
- 🔤 **TF-IDF autocomplete** for the search bar
- 🌙 **Dark mode** support
- 📱 **Fully responsive** mobile-friendly design

---

## 🏗️ Architecture

```
User Query
    │
    ▼
Language Detection (fastText lid.176.bin)
    │
    ▼
Translation to English (MarianMT)
    │
    ▼
UMLS Synonym Expansion (synonyms_clean.csv)
    │
    ▼
Preprocessing & Stemming (NLTK PorterStemmer)
    │
    ▼
RM3 Pseudo-Relevance Feedback
    │
    ▼
┌─────────────────────────────────────┐
│  BM25  │  TF-IDF  │  LM-JM (λ=0.3) │
└─────────────────────────────────────┘
    │
    ▼
PubMedBERT Reranking (S-PubMedBert-MS-MARCO)
    │
    ▼
Ranked Results → FastAPI → React Frontend
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + TypeScript | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Router | Navigation |
| Vercel | Deployment |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| PyTerrier | IR indexing and retrieval |
| fastText | Language detection |
| MarianMT (Helsinki-NLP) | Neural machine translation |
| S-PubMedBert-MS-MARCO | Semantic reranking |
| NLTK | Text preprocessing |
| UMLS | Medical synonym expansion |
| Hugging Face Spaces | Deployment |

---

## 📂 Project Structure

```
symptomiq-backend/
├── api.py                  # FastAPI routes and endpoints
├── medical_search.py       # Core retrieval pipeline
├── requirements.txt        # Python dependencies
├── Dockerfile              # Container configuration
├── startup.sh              # Data download + server startup
└── data/                   # (private — downloaded at runtime)
    ├── myIndex/            # PyTerrier inverted index
    ├── synonyms_clean.csv  # UMLS synonym dictionary
    ├── lid.176.bin         # fastText language model
    └── document_embeddings.pkl  # Precomputed PubMedBERT vectors

symptomiq-frontend/
├── src/
│   ├── components/
│   │   ├── home.tsx              # Search page with autocomplete
│   │   ├── narrowing-redesign.tsx # Results page with ranker switcher
│   │   ├── result-clean.tsx      # Condition detail page
│   │   ├── navbar.tsx            # Navigation bar
│   │   └── mobile-cta-bar.tsx    # Mobile action bar
│   ├── contexts/
│   │   ├── search-api.ts         # API client
│   │   ├── language-context.tsx  # i18n context
│   │   ├── theme-context.tsx     # Dark mode context
│   │   └── region-context.tsx    # Region/emergency number context
│   ├── data/
│   │   └── condition-details.ts  # Hardcoded condition fallbacks
│   ├── config.ts                 # API base URL
│   └── App.tsx                   # Root component
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/search` | Main search — returns ranked results |
| `GET` | `/autocomplete?q=` | TF-IDF autocomplete suggestions |
| `GET` | `/condition/{docno}` | Full condition details |
| `POST` | `/translate` | Translate condition fields |
| `GET` | `/health` | Health check |

### Example Search Request
```json
POST /search
{
  "query": "chest pain and shortness of breath"
}
```

### Example Search Response
```json
{
  "query": "chest pain and shortness of breath",
  "translatedQuery": "chest pain and shortness of breath",
  "results": [
    {
      "docno": "angina",
      "name": "Angina",
      "description": "Angina is chest pain caused by reduced blood flow to the heart...",
      "bm25Score": 87.5,
      "tfidfScore": 92.1,
      "lmScore": 78.3,
      "bertScore": 0.847,
      "relevanceScore": 0.847,
      "matchedKeywords": ["chest", "pain"],
      "rank": 1
    }
  ],
  "timingMs": 312.4,
  "metrics": {
    "candidatesRetrieved": 50,
    "afterRerank": 20,
    "topBM25Score": 12.3,
    "rankerUsed": "BM25 + PubMedBERT"
  }
}
```

---

## 🚀 Local Development

### Backend

```bash
# Clone the repo
git clone https://github.com/your-username/symptomiq-backend
cd symptomiq-backend

# Install dependencies
pip install -r requirements.txt

# Place your data files in ./data/
# myIndex/, synonyms_clean.csv, lid.176.bin, document_embeddings.pkl

# Run the server
uvicorn api:app --reload --port 8000
```

### Frontend

```bash
# Clone the repo
git clone https://github.com/your-username/symptomiq-frontend
cd symptomiq-frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Make sure `src/config.ts` points to `http://localhost:8000` for local development.

---

## 🌍 Supported Languages

| Language | Detection | Translation | Results Translation |
|---|---|---|---|
| English | ✅ | — | — |
| Arabic | ✅ | ✅ MarianMT | ✅ |
| French | ✅ | ✅ MarianMT | ✅ |
| Spanish | ✅ | ✅ MarianMT | ✅ |

---

## 📊 Retrieval Performance

| Ranker | P@5 | Precision | Recall | F1 |
|---|---|---|---|---|
| BM25 + PubMedBERT | 0.84 | 0.17 | 0.84 | 0.28 |
| BM25 | 0.84 | 0.17 | 0.84 | 0.28 |
| TF-IDF | 0.80 | 0.16 | 0.80 | 0.27 |

---

## ⚠️ Disclaimer

SymptomIQ is for **informational purposes only** and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns.

---

## 📄 License

The medical data used in this project is sourced from publicly available medical resources. UMLS synonym data is used under the UMLS license terms and is not redistributed publicly.
