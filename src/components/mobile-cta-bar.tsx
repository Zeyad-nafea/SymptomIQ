import { Home, Download, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/language-context";

interface MobileCTABarProps {
  showDownload?: boolean;
  showTalkToDoctor?: boolean;
}

export function MobileCTABar({ showDownload = true, showTalkToDoctor = false }: MobileCTABarProps) {
  const navigate = useNavigate();
  const { isRTL } = useLanguage();

  const handleDownload = () => {
    // Future: Generate and download symptom summary PDF
    alert(isRTL ? "ميزة قريباً" : "Coming soon");
  };

  const handleTalkToDoctor = () => {
    // Future: Connect to telemedicine
    alert(isRTL ? "ميزة قريباً" : "Coming soon");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-t-2 border-[#e2e8f0] dark:border-[#374151] shadow-2xl md:hidden">
      <div
        className={`flex items-center justify-around py-3 px-4 ${isRTL ? 'flex-row-reverse' : ''}`}
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-[#f8fafc] dark:hover:bg-[#1F2937] rounded-lg transition-colors active:scale-95"
        >
          <Home className="w-5 h-5 text-[#2563EB] dark:text-[#60A5FA]" />
          <span className="text-xs text-[#64748b] dark:text-[#94A3B8]">
            {isRTL ? "بحث جديد" : "New Search"}
          </span>
        </button>

        {showDownload && (
          <button
            onClick={handleDownload}
            className="flex flex-col items-center gap-1 px-4 py-2 hover:bg-[#f8fafc] dark:hover:bg-[#1F2937] rounded-lg transition-colors active:scale-95"
          >
            <Download className="w-5 h-5 text-[#14B8A6]" />
            <span className="text-xs text-[#64748b] dark:text-[#94A3B8]">
              {isRTL ? "حفظ الملخص" : "Save Summary"}
            </span>
          </button>
        )}

        {showTalkToDoctor && (
          <button
            onClick={handleTalkToDoctor}
            className="flex flex-col items-center gap-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg transition-all active:scale-95 shadow-lg"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-semibold">
              {isRTL ? "تحدث إلى طبيب" : "Talk to Doctor"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
