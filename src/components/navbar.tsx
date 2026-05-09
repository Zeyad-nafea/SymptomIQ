import { useLanguage, Language } from "../contexts/language-context";
import { useTheme } from "../contexts/theme-context";
import { Moon, Sun, Pill  } from "lucide-react";

const LANGS: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ar", label: "ع" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
];

export function Navbar() {
  const { language, setLanguage, isRTL, t } = useLanguage();
  const { toggleTheme, isDark } = useTheme();

  return (
    <nav
      dir={isRTL ? "rtl" : "ltr"}
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-[#e2e8f0] dark:border-[#374151] shadow-sm ${isRTL ? "text-right" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-16 ${isRTL ? "flex-row-reverse text-right" : ""}`}>

          {/* Brand */}
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="p-2 bg-[#3B82F6] rounded-full shadow-sm">
              <Pill  className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#1e293b] dark:text-[#F9FAFB]"
              style={{ fontFamily: "var(--font-family-heading)" }}>
              SymptomIQ
            </h1>
          </div>

          {/* Center nav */}
          <div className={`hidden md:flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button className={`px-4 py-2 text-sm font-medium text-[#64748b] dark:text-[#CBD5E1] hover:text-[#3B82F6] dark:hover:text-[#60A5FA] hover:bg-[#f8fafc] dark:hover:bg-[#1F2937] rounded-lg transition-all ${isRTL ? "text-right" : ""}`}
              style={{ fontFamily: "var(--font-family-heading)" }}>
              {t("nav.about")}
            </button>
          </div>

          {/* Right controls */}
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button onClick={toggleTheme}
              className="p-2.5 bg-white dark:bg-[#1F2937] rounded-lg border border-[#e2e8f0] dark:border-[#374151] hover:bg-[#f8fafc] dark:hover:bg-[#111827] transition-all active:scale-95"
              aria-label={isDark ? "Light mode" : "Dark mode"}>
              {isDark ? <Sun className="w-4 h-4 text-[#F59E0B]" /> : <Moon className="w-4 h-4 text-[#2563EB]" />}
            </button>

            {/* 4-language switcher */}
            <div className={`flex items-center gap-0.5 bg-white dark:bg-[#1F2937] rounded-lg px-1 py-1 border border-[#e2e8f0] dark:border-[#374151] ${isRTL ? "flex-row-reverse" : ""}`}>
              {LANGS.map(({ code, label }) => (
                <button key={code} onClick={() => setLanguage(code)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    language === code
                      ? "bg-[#3B82F6] text-white shadow-sm"
                      : "text-[#64748b] dark:text-[#CBD5E1] hover:bg-[#f1f5f9] dark:hover:bg-[#111827]"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}