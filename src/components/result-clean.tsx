import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search, ArrowLeft, CheckCircle2, Globe, Phone,
  RefreshCw, XCircle, Clock, TrendingUp, Lightbulb,
  AlertTriangle, ChevronDown, ChevronUp, ShieldAlert,
  Stethoscope, HeartPulse, BookOpen, Pill, Scissors, Zap,
  FlaskConical, Dna, Brain, HandHeart, Thermometer, Activity,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "./navbar";
import { MobileCTABar } from "./mobile-cta-bar";
import { conditionDetailsMap } from "../data/condition-details";
import { useLanguage } from "../contexts/language-context";
import { useRegion } from "../contexts/region-context";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConditionDetails {
  name?: string;
  symptoms?: string[];
  subSymptoms?: string[];
  symptomsInChildren?: string[];
  earlySymptoms?: string[];
  laterSymptoms?: string[];
  commonSymptoms?: string[];
  generalSymptoms?: string[];
  mildSymptoms?: string[];
  emergencySymptoms?: string[];
  causes?: string[];
  otherCauses?: string[];
  medicalCauses?: string[];
  physicalCauses?: string[];
  psychologicalCauses?: string[];
  healthLifestyleCauses?: string[];
  riskFactors?: string[];
  otherRiskFactors?: string[];
  lifestyleChoices?: string[];
  limitHormoneTherapy?: string[];
  complications?: string[];
  otherComplications?: string[];
  longTermComplications?: string[];
  eyeComplications?: string[];
  physicalComplications?: string[];
  pregnancyComplications?: string[];
  treatmentSideEffects?: string[];
  call999If?: string[];
  call999OrAEIf?: string[];
  goToAEIf?: string[];
  call999OrAENowIf?: string[];
  call999NowIf?: string[];
  call999ChildIf?: string[];
  call999OrAEChildIf?: string[];
  seeGPIf?: string[];
  seeGPIfYou?: string[];
  seeGPIfHave?: string[];
  seeGPOrChildIf?: string[];
  seePharmacistIf?: string[];
  seeGPOrSexualHealthIf?: string[];
  whenToSeeDoctor?: string;
  whenToSeekCare?: string;
  whenToSeeYourDoctor?: string;
  whenToCallDoctor?: string;
  whenToGetEmergencyHelp?: string;
  whenToSeeDentist?: string;
  whileWaitingDoctor?: string[];
  do?: string[];
  dontDo?: string[];
  howToLookAfterYourself?: string[];
  prevention?: string[];
  medicine?: string[];
  medicines?: string[];
  subMedicines?: string[];
  subMedications?: string[];
  surgery?: string[];
  chemotherapy?: string[];
  radiotherapy?: string[];
  targetedMedicinesAndImmuno?: string[];
  targetedMedicines?: string[];
  targetedTherapies?: string[];
  immunotherapy?: string[];
  hormoneTherapy?: string[];
  talkingTherapies?: string[];
  otherTreatments?: string[];
  yourTreatmentPlan?: string[];
  biologicalTreatments?: string[];
  jakInhibitors?: string[];
  corticosteroids?: string[];
  dmards?: string[];
  complementaryTherapies?: string[];
  physiotherapy?: string[];
  occupationalTherapy?: string[];
  painRelief?: string[];
  cryotherapy?: string[];
  supportAndTherapies?: string[];
  supportiveTreatments?: string[];
  treatment?: { primary?: string[] };
  cancerTreatmentInfo?: string;
  resources?: { name: string; website?: string; helpline?: string }[];
}

interface BackendCondition {
  docno: string;
  name: string;
  fullText: string;
  symptoms: string[];
  commonSymptoms: string[];
  earlySymptoms: string[];
  laterSymptoms: string[];
  causes: string[];
  otherCauses: string[];
  riskFactors: string[];
  complications: string[];
  prevention: string[];
  medicine: string[];
  otherTreatments: string[];
  surgery: string[];
  goToAEIf: string[] | null;
  seeGPIf: string[] | null;
  whenToSeeDoctor: string;
  availableSections: string[];
}

// ─── Collect helpers ──────────────────────────────────────────────────────────

function collectEmergencyItems(d: ConditionDetails): string[] {
  return [
    ...(d.call999If ?? []),
    ...(d.call999OrAEIf ?? []),
    ...(d.goToAEIf ?? []),
    ...(d.call999OrAENowIf ?? []),
    ...(d.call999NowIf ?? []),
    ...(d.call999ChildIf ?? []),
    ...(d.call999OrAEChildIf ?? []),
  ];
}

function collectGPItems(d: ConditionDetails): string[] {
  return [
    ...(d.seeGPIf ?? []),
    ...(d.seeGPIfYou ?? []),
    ...(d.seeGPIfHave ?? []),
    ...(d.seeGPOrChildIf ?? []),
    ...(d.seeGPOrSexualHealthIf ?? []),
  ];
}

type SymptomGroup = { label: string; items: string[] };

function collectSymptomGroups(d: ConditionDetails, t: (k: string) => string): SymptomGroup[] {
  const groups: SymptomGroup[] = [];
  const add = (label: string, items?: string[]) => { if (items?.length) groups.push({ label, items }); };
  add(t("detail.symptoms"),          d.symptoms);
  add(t("detail.commonSymptoms"),    d.commonSymptoms);
  add(t("detail.generalSymptoms"),   d.generalSymptoms);
  add(t("detail.earlySymptoms"),     d.earlySymptoms);
  add(t("detail.laterSymptoms"),     d.laterSymptoms);
  add(t("detail.mildSymptoms"),      d.mildSymptoms);
  add(t("detail.emergencySymptoms"), d.emergencySymptoms);
  add(t("detail.childrenSymptoms"),  d.symptomsInChildren);
  add(t("detail.otherSymptoms"),     d.subSymptoms);
  return groups;
}

function collectCauseGroups(d: ConditionDetails, t: (k: string) => string): SymptomGroup[] {
  const groups: SymptomGroup[] = [];
  const add = (label: string, items?: string[]) => { if (items?.length) groups.push({ label, items }); };
  add(t("detail.causes"),          d.causes);
  add(t("detail.medicalCauses"),   d.medicalCauses);
  add(t("detail.physicalCauses"),  d.physicalCauses);
  add(t("detail.psychoCauses"),    d.psychologicalCauses);
  add(t("detail.lifestyleCauses"), d.healthLifestyleCauses);
  add(t("detail.otherCauses"),     d.otherCauses);
  return groups;
}

function collectComplicationGroups(d: ConditionDetails, t: (k: string) => string): SymptomGroup[] {
  const groups: SymptomGroup[] = [];
  const add = (label: string, items?: string[]) => { if (items?.length) groups.push({ label, items }); };
  add(t("detail.complications"),   d.complications);
  add(t("detail.longTermComp"),    d.longTermComplications);
  add(t("detail.eyeComp"),         d.eyeComplications);
  add(t("detail.physicalComp"),    d.physicalComplications);
  add(t("detail.pregnancyComp"),   d.pregnancyComplications);
  add(t("detail.treatmentSideEff"),d.treatmentSideEffects);
  add(t("detail.otherComp"),       d.otherComplications);
  return groups;
}

type TreatmentGroup = { label: string; items: string[]; icon: React.ElementType; color: string };

function collectTreatmentGroups(d: ConditionDetails, t: (k: string) => string): TreatmentGroup[] {
  const groups: TreatmentGroup[] = [];
  const add = (label: string, items: string[] | undefined, icon: React.ElementType, color: string) => {
    if (items?.length) groups.push({ label, items, icon, color });
  };
  const meds = [
    ...(d.medicine ?? []), ...(d.medicines ?? []),
    ...(d.subMedicines ?? []), ...(d.subMedications ?? []),
  ].filter(Boolean);
  add(t("treat.medicines"),     meds.length ? meds : undefined,                                Pill,        "#6366f1");
  add(t("treat.surgery"),       d.surgery,                                                      Scissors,    "#ef4444");
  add(t("treat.chemo"),         d.chemotherapy,                                                 FlaskConical,"#8b5cf6");
  add(t("treat.radio"),         d.radiotherapy,                                                 Zap,         "#f59e0b");
  const targeted = [
    ...(d.targetedMedicinesAndImmuno ?? []), ...(d.targetedMedicines ?? []),
    ...(d.targetedTherapies ?? []), ...(d.immunotherapy ?? []),
  ].filter(Boolean);
  add(t("treat.targeted"),      targeted.length ? targeted : undefined,                         Dna,         "#0ea5e9");
  add(t("treat.hormone"),       d.hormoneTherapy,                                               Activity,    "#ec4899");
  const biological = [
    ...(d.biologicalTreatments ?? []), ...(d.jakInhibitors ?? []),
    ...(d.dmards ?? []), ...(d.corticosteroids ?? []),
  ].filter(Boolean);
  add(t("treat.biological"),    biological.length ? biological : undefined,                     Brain,       "#14b8a6");
  add(t("treat.talking"),       d.talkingTherapies,                                             Brain,       "#a855f7");
  const physio = [...(d.physiotherapy ?? []), ...(d.occupationalTherapy ?? [])].filter(Boolean);
  add(t("treat.physio"),        physio.length ? physio : undefined,                             HandHeart,   "#22c55e");
  add(t("treat.painRelief"),    d.painRelief,                                                   Thermometer, "#f97316");
  const complementary = [...(d.complementaryTherapies ?? []), ...(d.cryotherapy ?? [])].filter(Boolean);
  add(t("treat.complementary"), complementary.length ? complementary : undefined,               HeartPulse,  "#06b6d4");
  const other = [
    ...(d.otherTreatments ?? []), ...(d.supportAndTherapies ?? []),
    ...(d.supportiveTreatments ?? []), ...(d.treatment?.primary ?? []),
  ].filter(Boolean);
  add(t("treat.other"),         other.length ? other : undefined,                               Pill,        "#64748b");
  return groups;
}

// ─── Score → confidence % ─────────────────────────────────────────────────────

function scoreToConfidence(score: number | null | undefined): number {
  if (score == null) return 0;
  const pct = ((score - 3) / (50 - 3)) * 45 + 50;
  return Math.min(95, Math.max(10, Math.round(pct)));
}

// ─── UI sub-components ────────────────────────────────────────────────────────

function BulletList({
  items,
  accent = "#3b82f6",
}: {
  items: string[];
  accent?: string;
}) {
  const { isRTL } = useLanguage();

  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: accent, marginTop: "10px" }}
          />
          <span
            className={`flex-1 leading-7 break-words text-[#475569] dark:text-[#94a3b8] ${isRTL ? "font-ar text-right" : "text-left"}`}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function GroupedList({
  groups,
  accent,
}: {
  groups: SymptomGroup[];
  accent?: string;
}) {
  const { isRTL } = useLanguage();

  if (!groups.length) return null;

  if (groups.length === 1) {
    return <BulletList items={groups[0].items} accent={accent} />;
  }

  return (
    <div className="space-y-4">
      {groups.map((g, i) => (
        <div key={i}>
          <p
            className={`text-xs font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wide mb-3 ${isRTL ? "font-ar" : ""}`}
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {g.label}
          </p>
          <BulletList items={g.items} accent={accent} />
        </div>
      ))}
    </div>
  );
}

function CollapseCard({
  title,
  icon: Icon,
  iconColor,
  children,
  defaultOpen = false,
  badge,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { isRTL } = useLanguage();

  return (
    <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#f8fafc] dark:hover:bg-[#1e293b] transition-colors"
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: iconColor + "18" }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} />
        </div>

        <div className="flex flex-1 items-center gap-2.5 overflow-hidden">
          <span className={`font-semibold text-sm text-[#0f172a] dark:text-[#f1f5f9] truncate ${isRTL ? "font-ar" : ""}`}>
            {title}
          </span>
          {badge !== undefined && (
            <span className="px-1.5 py-0.5 bg-[#f1f5f9] dark:bg-[#1e293b] text-[#64748b] text-xs rounded-md font-mono flex-shrink-0">
              {badge}
            </span>
          )}
        </div>

        {open ? (
          <ChevronUp className="w-4 h-4 text-[#94a3b8] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#94a3b8] flex-shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-[#f1f5f9] dark:border-[#1e293b]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  const { isRTL } = useLanguage();
  return (
    <h2
      className={`text-xl font-bold text-[#0f172a] dark:text-[#f1f5f9] mb-4 tracking-tight w-full ${isRTL ? "font-ar" : ""}`}
      style={{ textAlign: isRTL ? "right" : "left" }}
    >
      {children}
    </h2>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ResultClean() {
  const location = useLocation();
  const navigate = useNavigate();

  const { isRTL, t, language } = useLanguage();
  const { emergencyNumber } = useRegion();

  const { condition, query, matchedSymptoms: passedSymptoms, bm25Score } = location.state || {};

  const [searchQuery,           setSearchQuery]           = useState(query || "");
  const [activeSection,         setActiveSection]         = useState("overview");
  const [fetchedDetails,        setFetchedDetails]        = useState<ConditionDetails | null>(null);
  const [detailsLoading,        setDetailsLoading]        = useState(true);
  const [isTranslating,         setIsTranslating]         = useState(false);
  const [translatedDescription, setTranslatedDescription] = useState<string | null>(null);

  useEffect(() => { if (!condition) navigate("/"); }, [condition, navigate]);

  useEffect(() => {
    const ids = ["overview", "actions", "risk", "clinical", "details"];
    const onScroll = () => {
      const found = ids.find(id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top <= 160 && r.bottom >= 160;
      });
      if (found) setActiveSection(found);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!condition?.id) return;
    const hardcoded = conditionDetailsMap[condition.id];

    // Reset translated description when language changes
    if (language === "en") {
      setTranslatedDescription(null);
      if (hardcoded) {
        setDetailsLoading(false);
        return;
      }
    }

    setDetailsLoading(true);
    fetch(`http://localhost:8000/condition/${condition.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(async (data: BackendCondition | null) => {
        if (!data) return;

        let source = data;
        if (language !== "en") {
          setIsTranslating(true);
          try {
            const tr = await fetch("http://localhost:8000/translate", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({
                fields: { ...data, description: condition.description },
                targetLanguage: language,
              }),
            });
            if (tr.ok) {
              const translated = await tr.json();
              setTranslatedDescription(translated.description ?? null);
              source = translated;
            }
          } catch {
            // translation failed — silently use English original
          } finally {
            setIsTranslating(false);
          }
        }

        setFetchedDetails({
          name:            source.name,
          symptoms:        source.symptoms?.length        ? source.symptoms        : undefined,
          commonSymptoms:  source.commonSymptoms?.length  ? source.commonSymptoms  : undefined,
          earlySymptoms:   source.earlySymptoms?.length   ? source.earlySymptoms   : undefined,
          laterSymptoms:   source.laterSymptoms?.length   ? source.laterSymptoms   : undefined,
          causes:          source.causes?.length          ? source.causes          : undefined,
          otherCauses:     source.otherCauses?.length     ? source.otherCauses     : undefined,
          riskFactors:     source.riskFactors?.length     ? source.riskFactors     : undefined,
          complications:   source.complications?.length   ? source.complications   : undefined,
          prevention:      source.prevention?.length      ? source.prevention      : undefined,
          medicine:        source.medicine?.length        ? source.medicine        : undefined,
          otherTreatments: source.otherTreatments?.length ? source.otherTreatments : undefined,
          surgery:         source.surgery?.length         ? source.surgery         : undefined,
          goToAEIf:        source.goToAEIf?.length        ? source.goToAEIf        : undefined,
          seeGPIf:         source.seeGPIf?.length         ? source.seeGPIf         : undefined,
          whenToSeeDoctor: source.whenToSeeDoctor || undefined,
        });
      })
      .catch(() => {/* backend unreachable */})
      .finally(() => setDetailsLoading(false));
  }, [condition?.id, language, condition.description]);

  if (!condition) return null;

  const details: ConditionDetails | undefined =
    language === "en"
      ? (conditionDetailsMap[condition.id] ?? fetchedDetails ?? undefined)
      : (fetchedDetails ?? conditionDetailsMap[condition.id] ?? undefined);

  const matchedSymptoms    = (passedSymptoms ?? []) as string[];
  const confidencePct      = scoreToConfidence(bm25Score ?? condition.relevanceScore);
  const emergencyItems     = collectEmergencyItems(details ?? {});
  const gpItems            = collectGPItems(details ?? {});
  const symptomGroups      = collectSymptomGroups(details ?? {}, t);
  const causeGroups        = collectCauseGroups(details ?? {}, t);
  const complicationGroups = collectComplicationGroups(details ?? {}, t);
  const treatmentGroups    = collectTreatmentGroups(details ?? {}, t);

  const hasClinicalSection =
    emergencyItems.length > 0 || gpItems.length > 0 ||
    (details?.seePharmacistIf?.length ?? 0) > 0 ||
    details?.whenToSeeDoctor || details?.whenToSeekCare ||
    details?.whenToSeeYourDoctor || details?.whenToCallDoctor ||
    details?.whenToGetEmergencyHelp || details?.whenToSeeDentist ||
    (details?.whileWaitingDoctor?.length ?? 0) > 0;

  const coverage = [
    { label: t("result.symptoms"),         has: symptomGroups.length > 0 },
    { label: t("result.causes"),           has: causeGroups.length > 0 },
    { label: t("result.riskFactors"),      has: (details?.riskFactors?.length ?? 0) > 0 },
    { label: t("result.complications"),    has: complicationGroups.length > 0 },
    { label: t("result.treatment"),        has: treatmentGroups.length > 0 },
    { label: t("result.prevention"),       has: (details?.prevention?.length ?? 0) > 0 },
    { label: t("result.clinicalGuidance"), has: hasClinicalSection },
  ];

  const whenToSeekBlocks = [
    { text: details?.whenToSeeDoctor,        label: t("when.seeDoctor")     },
    { text: details?.whenToSeekCare,         label: t("when.seekCare")      },
    { text: details?.whenToSeeYourDoctor,    label: t("when.seeYourDoctor") },
    { text: details?.whenToCallDoctor,       label: t("when.callDoctor")    },
    { text: details?.whenToGetEmergencyHelp, label: t("when.emergency")     },
    { text: details?.whenToSeeDentist,       label: t("when.seeDentist")    },
  ].filter(x => x.text);

  const handleNewSearch = () => navigate("/narrowing", { state: { query: searchQuery } });

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 148, behavior: "smooth" });
  };

  const navItems = [
    { id: "overview", label: t("result.overview")    },
    { id: "actions",  label: t("result.whatToDo")    },
    { id: "risk",     label: t("result.risk_section") },
    ...(hasClinicalSection ? [{ id: "clinical", label: t("result.clinical") }] : []),
    { id: "details",  label: t("result.details")     },
  ];

  return (
    <div
      className={`min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-16 ${isRTL ? "font-ar" : "font-en"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Navbar />

      {/* ── Sticky top bar ── */}
      <div className="sticky top-16 z-40 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur border-b border-[#e2e8f0] dark:border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4">
          <div className={`py-3 flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b] transition-colors"
            >
              <ArrowLeft className={`w-5 h-5 text-[#64748b] ${isRTL ? "rotate-180" : ""}`} />
            </button>
            <div className="flex-1 relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleNewSearch()}
                dir={isRTL ? "rtl" : "ltr"}
                placeholder={t("home.placeholder")}
                className="w-full py-2.5 bg-[#f1f5f9] dark:bg-[#1e293b] border border-transparent focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 rounded-xl text-sm text-[#0f172a] dark:text-[#f1f5f9] placeholder:text-[#94a3b8] ps-10 pe-4"
              />
            </div>
            <button
              onClick={handleNewSearch}
              className="px-4 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {t("narrow.searchBtn")}
            </button>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
            {navItems.map(n => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  activeSection === n.id
                    ? "bg-[#3b82f6] text-white shadow-sm"
                    : "text-[#64748b] dark:text-[#94a3b8] hover:bg-[#f1f5f9] dark:hover:bg-[#1e293b]"
                } ${isRTL ? "font-ar" : ""}`}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── INITIAL LOAD STATE ── */}
      {detailsLoading && !fetchedDetails && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mb-3" />
            <p className={`text-sm text-[#64748b] dark:text-[#94A3B8] ${isRTL ? "font-ar" : ""}`}>
              {language === "ar" ? "جارٍ تحميل التفاصيل..." : language === "fr" ? "Chargement..." : "Loading details..."}
            </p>
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div className={`max-w-7xl mx-auto px-4 py-8 pb-28 md:pb-8 ${detailsLoading && !fetchedDetails ? "hidden" : "block"}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* OVERVIEW */}
            <section id="overview" className="scroll-mt-36">
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] overflow-hidden"
              >
                <div className="p-6">
                  <div className={`flex items-start gap-3 mb-5 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h1
                          className={`text-3xl font-bold text-[#0f172a] dark:text-[#f1f5f9] tracking-tight break-words w-full ${isRTL ? "font-ar leading-[1.6] text-right" : "leading-relaxed text-left"}`}
                        >
                          {details?.name || condition.name}
                        </h1>
                      </div>

                      {(translatedDescription || condition.description) && (
                        <p className={`mt-2 text-[#64748b] dark:text-[#94a3b8] leading-7 ${isRTL ? "font-ar text-right" : "text-left"}`}>
                          {translatedDescription || condition.description}
                        </p>
                      )}

                      {/* Subtle Progressive Translation Loader */}
                      {isTranslating && (
                        <div className={`flex items-center gap-2 mt-3 text-sm text-[#3b82f6] ${isRTL ? "flex-row-reverse justify-end" : ""}`}>
                          <div className="w-4 h-4 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin flex-shrink-0" />
                          <span className={isRTL ? "font-ar" : ""}>
                            {language === "ar" ? "جارٍ الترجمة..." : language === "fr" ? "Traduction..." : "Translating..."}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                    {/* Confidence meter */}
                    {confidencePct > 0 && (
                      <div className="p-4 bg-[#f8fafc] dark:bg-[#1e293b] rounded-xl mb-5">
                        <div className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <span className="text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9] uppercase tracking-wide">
                            {t("result.matchScore")}
                          </span>
                          <span className="text-sm font-black text-[#3b82f6] force-ltr">{confidencePct}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#e2e8f0] dark:bg-[#334155] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${confidencePct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#6366f1]"
                          />
                        </div>
                        <p className="text-xs text-[#94a3b8] mt-2">{t("result.matchDesc")}</p>
                      </div>
                    )}

                    {/* Matched symptoms */}
                    {matchedSymptoms.length > 0 && (
                      <div>
                        <p className={`text-xs font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wide mb-2 w-full ${isRTL ? "font-ar text-right" : "text-left"}`}>
                          {t("result.matched")}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2" style={{ flexDirection: isRTL ? "row-reverse" : "row" }}>
                          {matchedSymptoms.map(s => (
                            <span
                              key={s}
                              className={`flex items-center gap-1.5 px-3 py-1.5 bg-[#dbeafe] dark:bg-[#1e3a5f] text-[#2563eb] dark:text-[#93c5fd] rounded-full text-xs font-semibold ${isRTL ? "flex-row-reverse font-ar" : ""}`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />{s}
                            </span>
                          ))}
                        </div>
                        <p className={`text-[11px] text-[#94a3b8] ${isRTL ? "text-right" : ""}`}>⚠️ {t("result.notDiagnosis")}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
            </section>

            {/* WHAT TO DO */}
            <section id="actions" className="scroll-mt-36">
              <SectionHeading>{t("result.whatToDo")}</SectionHeading>
              <div className="space-y-3">
                {emergencyItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: isRTL ? 16 : -16 }} animate={{ opacity: 1, x: 0 }}
                    className="bg-[#fff5f5] dark:bg-[#1a0a0a] border border-[#fca5a5] dark:border-[#7f1d1d] rounded-2xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#ef4444]/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-[#ef4444]/70" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-semibold text-[#ef4444]/80 uppercase tracking-widest mb-1 ${isRTL ? "font-ar" : ""}`}>
                          {t("result.emergency", { n: emergencyNumber })}
                        </p>
                        <p className={`text-sm text-[#475569] dark:text-[#94a3b8] ${isRTL ? "font-ar" : ""}`}>
                          {t("result.emergencyDesc")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-[#3b82f6]" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-bold text-[#3b82f6] uppercase tracking-widest mb-1 ${isRTL ? "font-ar" : ""}`}>{t("result.monitor")}</p>
                        <p className={`text-sm text-[#475569] dark:text-[#94a3b8] leading-7 ${isRTL ? "font-ar" : ""}`}>{t("result.monitorDesc")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1e293b] rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f59e0b]/10 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-5 h-5 text-[#f59e0b]" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-bold text-[#f59e0b] uppercase tracking-widest mb-1 ${isRTL ? "font-ar" : ""}`}>{t("result.avoid")}</p>
                        <p className={`text-sm text-[#475569] dark:text-[#94a3b8] leading-7 ${isRTL ? "font-ar" : ""}`}>{t("result.avoidDesc")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {((details?.do?.length ?? 0) + (details?.howToLookAfterYourself?.length ?? 0)) > 0 && (
                <div className="mt-4">
                  <CollapseCard
                    title={t("result.selfCare")} icon={HeartPulse} iconColor="#22c55e" defaultOpen
                    badge={(details?.do?.length ?? 0) + (details?.howToLookAfterYourself?.length ?? 0)}
                  >
                    {details?.do && <BulletList items={details.do} accent="#22c55e" />}
                    {details?.howToLookAfterYourself && (
                      <div className="mt-3">
                        <BulletList items={details.howToLookAfterYourself} accent="#22c55e" />
                      </div>
                    )}
                  </CollapseCard>
                </div>
              )}

              {treatmentGroups.length > 0 && (
                <div className="mt-3 space-y-3">
                  {treatmentGroups.map((g, i) => (
                    <CollapseCard key={i} title={g.label} icon={g.icon} iconColor={g.color} badge={g.items.length}>
                      <BulletList items={g.items} accent={g.color} />
                    </CollapseCard>
                  ))}
                </div>
              )}
            </section>

            {/* RISK */}
            <section id="risk" className="scroll-mt-36">
              <SectionHeading>{t("result.understanding")}</SectionHeading>
              <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] p-6 space-y-5">
                {((details?.riskFactors?.length ?? 0) + (details?.otherRiskFactors?.length ?? 0)) > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wide mb-2">
                      {t("result.riskFactors")}
                    </p>
                    {details?.riskFactors && <BulletList items={details.riskFactors} accent="#3b82f6" />}
                    {details?.otherRiskFactors && (
                      <div className="mt-2">
                        <BulletList items={details.otherRiskFactors} accent="#3b82f6" />
                      </div>
                    )}
                  </div>
                )}

                {complicationGroups.length > 0 && (
                  <div className="p-4 bg-[#fff7ed] dark:bg-[#1c1008] border border-[#fed7aa] rounded-xl">
                    <p className="text-xs font-bold text-[#ea580c] uppercase tracking-wide mb-2">
                      {t("result.possibleComp")}
                    </p>
                    <GroupedList groups={complicationGroups} accent="#ea580c" />
                  </div>
                )}
              </div>
            </section>

            {/* CLINICAL GUIDANCE */}
            {hasClinicalSection && (
              <section id="clinical" className="scroll-mt-36">
                <SectionHeading>{t("result.clinicalGuidance")}</SectionHeading>
                <div className="space-y-4">
                  {emergencyItems.length > 0 && (
                    <div className="bg-[#fff5f5] dark:bg-[#1a0a0a] border border-[#fca5a5] dark:border-[#7f1d1d] rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldAlert className="w-5 h-5 text-[#ef4444]/70" />
                        <p className={`font-semibold text-[#ef4444]/80 text-sm ${isRTL ? "font-ar" : ""}`}>
                          {t("result.emergency", { n: emergencyNumber })} {t("result.orAE")}
                        </p>
                      </div>
                      <BulletList items={emergencyItems} accent="#ef4444" />
                    </div>
                  )}

                  {gpItems.length > 0 && (
                    <div className="bg-[#fffbeb] dark:bg-[#1a1200] border-2 border-[#f59e0b] rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Stethoscope className="w-5 h-5 text-[#f59e0b]" />
                        <p className={`font-bold text-[#f59e0b] text-sm ${isRTL ? "font-ar" : ""}`}>
                          {t("result.seeDoctor")}
                        </p>
                      </div>
                      <BulletList items={gpItems} accent="#f59e0b" />
                    </div>
                  )}

                  {whenToSeekBlocks.map((x, i) => (
                    <div key={i} className="bg-[#fffbeb] dark:bg-[#1a1200] border border-[#f59e0b]/50 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Stethoscope className="w-4 h-4 text-[#f59e0b]" />
                        <p className={`font-bold text-[#f59e0b] text-sm ${isRTL ? "font-ar" : ""}`}>{x.label}</p>
                      </div>
                      <p className={`text-sm text-[#475569] dark:text-[#94a3b8] leading-7 ${isRTL ? "font-ar" : ""}`}>
                        {x.text}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* DETAILS */}
            <section id="details" className="scroll-mt-36">
              <SectionHeading>{t("result.additionalDetails")}</SectionHeading>
              <div className="space-y-3">
                {symptomGroups.length > 0 && (
                  <CollapseCard
                    title={t("result.fullSymptoms")} icon={Activity} iconColor="#3b82f6" defaultOpen
                    badge={symptomGroups.reduce((a, g) => a + g.items.length, 0)}
                  >
                    <GroupedList groups={symptomGroups} accent="#3b82f6" />
                  </CollapseCard>
                )}
                {causeGroups.length > 0 && (
                  <CollapseCard
                    title={t("result.causes")} icon={Lightbulb} iconColor="#f59e0b"
                    badge={causeGroups.reduce((a, g) => a + g.items.length, 0)}
                  >
                    <GroupedList groups={causeGroups} accent="#f59e0b" />
                  </CollapseCard>
                )}
              </div>
            </section>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 bg-[#fffbeb] dark:bg-[#1a1200] border-2 border-[#f59e0b] rounded-2xl p-5">
              <AlertTriangle className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
              <div>
                <p className={`text-sm font-bold text-[#f59e0b] mb-1 ${isRTL ? "font-ar" : ""}`}>
                  {t("result.disclaimer_title")}
                </p>
                <p className={`text-sm text-[#0f172a] dark:text-[#cbd5e1] leading-7 ${isRTL ? "font-ar" : ""}`}>
                  {t("result.disclaimer_body")}
                </p>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-40 space-y-4">
              <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] p-5">
                <h3 className="text-xs font-bold text-[#64748b] uppercase tracking-wide mb-3">
                  {t("result.actions")}
                </h3>
                <button
                  onClick={() => navigate("/narrowing", { state: { query } })}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#f8fafc] dark:bg-[#1e293b] hover:bg-[#f1f5f9] dark:hover:bg-[#334155] text-[#0f172a] dark:text-[#f1f5f9] rounded-xl transition-all text-sm font-medium"
                >
                  <span className={isRTL ? "font-ar" : ""}>{t("result.refine")}</span>
                  <RefreshCw className="w-4 h-4 text-[#64748b]" />
                </button>
              </div>

              <div className="bg-[#f8fafc] dark:bg-[#0f172a] rounded-2xl border border-[#e2e8f0] dark:border-[#1e293b] p-4">
                <p className={`text-xs font-bold text-[#64748b] uppercase tracking-wide mb-3 ${isRTL ? "text-right font-ar" : ""}`}>
                  {t("result.coverage")}
                </p>
                <div className="space-y-1.5">
                  {coverage.map((row, i) => (
                    <div key={i} className="flex items-center gap-2" style={{ flexDirection: isRTL ? "row-reverse" : "row" }}>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${row.has ? "bg-[#22c55e]" : "bg-[#e2e8f0] dark:bg-[#334155]"}`} />
                      <span className={`text-xs ${row.has ? "text-[#0f172a] dark:text-[#f1f5f9]" : "text-[#94a3b8]"} ${isRTL ? "font-ar" : ""}`}>
                        {row.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileCTABar showDownload={true} showTalkToDoctor={false} />
    </div>
  );
}