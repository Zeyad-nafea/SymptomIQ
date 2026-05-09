import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Region = "us" | "eg" | "uk" | "global";

interface RegionContextType {
  region: Region;
  setRegion: (region: Region) => void;
  emergencyNumber: string;
  emergencyLabel: string;
  emergencyLabelAr: string;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const regionConfig: Record<Region, { emergencyNumber: string; emergencyLabel: string; emergencyLabelAr: string }> = {
  us: {
    emergencyNumber: "911",
    emergencyLabel: "Call 911",
    emergencyLabelAr: "اتصل بـ 911",
  },
  eg: {
    emergencyNumber: "123",
    emergencyLabel: "Call 123",
    emergencyLabelAr: "اتصل بـ 123",
  },
  uk: {
    emergencyNumber: "999",
    emergencyLabel: "Call 999",
    emergencyLabelAr: "اتصل بـ 999",
  },
  global: {
    emergencyNumber: "112",
    emergencyLabel: "Call 112",
    emergencyLabelAr: "اتصل بـ 112",
  },
};

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<Region>("us");

  useEffect(() => {
    // Load saved region preference
    const saved = localStorage.getItem("symptomiq-region") as Region;
    if (saved && regionConfig[saved]) {
      setRegionState(saved);
    } else {
      // Try to detect region from browser
      const locale = navigator.language.toLowerCase();
      if (locale.includes("eg") || locale.includes("ar-eg")) {
        setRegionState("eg");
      } else if (locale.includes("gb") || locale.includes("en-gb")) {
        setRegionState("uk");
      } else if (locale.includes("us") || locale.includes("en-us")) {
        setRegionState("us");
      }
    }
  }, []);

  const setRegion = (newRegion: Region) => {
    setRegionState(newRegion);
    localStorage.setItem("symptomiq-region", newRegion);
  };

  const config = regionConfig[region];

  return (
    <RegionContext.Provider
      value={{
        region,
        setRegion,
        emergencyNumber: config.emergencyNumber,
        emergencyLabel: config.emergencyLabel,
        emergencyLabelAr: config.emergencyLabelAr,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
}
