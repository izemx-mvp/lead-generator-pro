import { useEffect, useState } from "react";

export type JourConfig = {
  actif: boolean;
  debut: string;
  fin: string;
};

export type AppConfig = {
  relance: {
    delaiPremiereHeures: number;
    nombreMax: number;
    intervalleHeures: number;
  };
  plages: {
    fuseau: string;
    jours: Record<"lun" | "mar" | "mer" | "jeu" | "ven" | "sam" | "dim", JourConfig>;
  };
  script: {
    questions: string[];
  };
};

export const defaultConfig: AppConfig = {
  relance: {
    delaiPremiereHeures: 24,
    nombreMax: 3,
    intervalleHeures: 48,
  },
  plages: {
    fuseau: "Europe/Brussels",
    jours: {
      lun: { actif: true, debut: "09:00", fin: "19:00" },
      mar: { actif: true, debut: "09:00", fin: "19:00" },
      mer: { actif: true, debut: "09:00", fin: "19:00" },
      jeu: { actif: true, debut: "09:00", fin: "19:00" },
      ven: { actif: true, debut: "09:00", fin: "19:00" },
      sam: { actif: true, debut: "10:00", fin: "17:00" },
      dim: { actif: false, debut: "10:00", fin: "17:00" },
    },
  },
  script: {
    questions: [
      "Êtes-vous propriétaire d'un bien immobilier que vous envisagez de vendre ?",
      "Vivez-vous dans ce bien depuis plus de 10 ans ?",
      "Votre projet de vente est-il prévu dans moins de 6 mois ?",
      "Seriez-vous d'accord pour qu'une agence réalise une estimation gratuite de votre bien ?",
    ],
  },
};

const KEY = "naima-config-v2";

export function loadConfig(): AppConfig {
  if (typeof window === "undefined") return defaultConfig;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultConfig;
    const parsed = JSON.parse(raw);
    return {
      ...defaultConfig,
      ...parsed,
      script: { questions: parsed?.script?.questions ?? defaultConfig.script.questions },
    };
  } catch {
    return defaultConfig;
  }
}

export function saveConfig(c: AppConfig) {
  localStorage.setItem(KEY, JSON.stringify(c));
}

export function useConfig() {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);
  useEffect(() => {
    setConfig(loadConfig());
  }, []);
  const update = (updater: (c: AppConfig) => AppConfig) => {
    setConfig((prev) => {
      const next = updater(prev);
      saveConfig(next);
      return next;
    });
  };
  return { config, update };
}

export const joursLabels: Record<keyof AppConfig["plages"]["jours"], string> = {
  lun: "Lundi",
  mar: "Mardi",
  mer: "Mercredi",
  jeu: "Jeudi",
  ven: "Vendredi",
  sam: "Samedi",
  dim: "Dimanche",
};
