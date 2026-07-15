import { useEffect, useState } from "react";

export type JourConfig = {
  actif: boolean;
  debut: string; // "09:00"
  fin: string;   // "19:00"
};

export type AppConfig = {
  relance: {
    delaiPremiereHeures: number;
    nombreMax: number;
    intervalleHeures: number;
    templateWhatsapp: string;
    templateEmail: string;
  };
  plages: {
    fuseau: string;
    jours: Record<"lun" | "mar" | "mer" | "jeu" | "ven" | "sam" | "dim", JourConfig>;
  };
  script: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
  };
  canaux: {
    expediteurEmail: string;
    signatureEmail: string;
    nomWhatsapp: string;
    disclaimer: string;
  };
};

export const defaultConfig: AppConfig = {
  relance: {
    delaiPremiereHeures: 24,
    nombreMax: 3,
    intervalleHeures: 48,
    templateWhatsapp:
      "Bonjour {{prenom}}, je me permets de revenir vers vous concernant votre bien immobilier. Auriez-vous un instant pour échanger ? 🏡",
    templateEmail:
      "Bonjour {{prenom}},\n\nJe reviens vers vous suite à mon précédent message concernant l'estimation gratuite de votre bien.\nSeriez-vous disponible pour un rapide échange ?\n\nBien cordialement,\nL'équipe Naïma AI",
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
    q1: "Êtes-vous propriétaire d'un bien immobilier que vous envisagez de vendre ?",
    q2: "Vivez-vous dans ce bien depuis plus de 10 ans ?",
    q3: "Votre projet de vente est-il prévu dans moins de 6 mois ?",
    q4: "Seriez-vous d'accord pour qu'une agence réalise une estimation gratuite de votre bien ?",
  },
  canaux: {
    expediteurEmail: "naima@agence.ai",
    signatureEmail: "L'équipe Naïma AI — Prospection Immobilière",
    nomWhatsapp: "Naïma AI",
    disclaimer:
      "Conformément au RGPD, vous pouvez à tout moment demander la suppression de vos données en répondant STOP.",
  },
};

const KEY = "naima-config-v1";

export function loadConfig(): AppConfig {
  if (typeof window === "undefined") return defaultConfig;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultConfig;
    return { ...defaultConfig, ...JSON.parse(raw) };
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
