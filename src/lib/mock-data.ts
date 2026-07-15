export type Canal = "whatsapp" | "email";
export type Statut =
  | "nouveau"
  | "contacte"
  | "conversation"
  | "relance"
  | "qualifie"
  | "refuse"
  | "injoignable";

export type Prospect = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  telephoneType: "mobile" | "fixe";
  adresse: string;
  ville: string;
  pays: "BE" | "FR";
  canal: Canal;
  statut: Statut;
  derniereActivite: string;
  campagneId: string;
  criteres: {
    bienAVendre: boolean | null;
    plusDeDixAns: boolean | null;
    moinsSixMois: boolean | null;
    accordEstimation: boolean | null;
  };
  conversation: Message[];
};

export type Message = {
  from: "ia" | "prospect";
  text: string;
  time: string;
};

export type Campagne = {
  id: string;
  nom: string;
  dateImport: string;
  nbProspects: number;
  envoyes: number;
  reponses: number;
  qualifies: number;
  statut: "active" | "terminee" | "pause";
};

const villesBE = ["Bruxelles", "Anvers", "Liège", "Namur", "Gand", "Charleroi", "Louvain"];
const villesFR = ["Paris", "Lyon", "Marseille", "Lille", "Bordeaux", "Nantes", "Toulouse", "Nice"];
const prenoms = ["Marie", "Julien", "Sophie", "Karim", "Aïcha", "Pierre", "Élodie", "Mehdi", "Camille", "Laurent", "Fatima", "Antoine", "Sarah", "David", "Claire", "Youssef", "Isabelle", "Nicolas", "Amina", "Vincent"];
const noms = ["Dubois", "Lambert", "Martin", "Benali", "Dupont", "Renard", "El Amrani", "Peeters", "Janssens", "Bernard", "Hamdi", "Leroy", "Moreau", "Van Damme", "Rossi", "Ouali", "Petit", "Girard", "Sanchez", "Boulanger"];

function pad(n: number) { return n.toString().padStart(2, "0"); }
function daysAgo(d: number, hoursOffset = 0) {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  dt.setHours(9 + hoursOffset, 30, 0, 0);
  return dt.toISOString();
}

function makeConversation(criteres: Prospect["criteres"], canal: Canal): Message[] {
  const salut = canal === "whatsapp" ? "Bonjour ! 👋" : "Bonjour,";
  const msgs: Message[] = [
    { from: "ia", text: `${salut} Je suis l'assistante virtuelle d'un réseau d'agences immobilières partenaires. Je me permets de vous contacter rapidement : êtes-vous propriétaire d'un bien que vous envisageriez de vendre ?`, time: daysAgo(2, 0) },
  ];
  if (criteres.bienAVendre === null) return msgs;
  msgs.push({ from: "prospect", text: criteres.bienAVendre ? "Bonjour, oui effectivement j'y réfléchis." : "Non, pas du tout merci.", time: daysAgo(2, 1) });
  if (!criteres.bienAVendre) return msgs;

  msgs.push({ from: "ia", text: "Merci pour votre retour. Vivez-vous dans ce bien depuis plus de 10 ans ?", time: daysAgo(2, 2) });
  if (criteres.plusDeDixAns === null) return msgs;
  msgs.push({ from: "prospect", text: criteres.plusDeDixAns ? "Oui, cela fera 14 ans cette année." : "Non, environ 5 ans.", time: daysAgo(1, 0) });

  msgs.push({ from: "ia", text: "Parfait. Votre projet de vente est-il prévu dans moins de 6 mois ?", time: daysAgo(1, 1) });
  if (criteres.moinsSixMois === null) return msgs;
  msgs.push({ from: "prospect", text: criteres.moinsSixMois ? "Oui, on aimerait vendre d'ici l'été." : "Plutôt d'ici un an ou deux.", time: daysAgo(1, 2) });

  msgs.push({ from: "ia", text: "Excellent. Seriez-vous d'accord pour qu'une agence partenaire réalise une estimation gratuite et sans engagement de votre bien ?", time: daysAgo(0, 0) });
  if (criteres.accordEstimation === null) return msgs;
  msgs.push({ from: "prospect", text: criteres.accordEstimation ? "Oui avec plaisir, ce serait très utile." : "Non merci, je préfère m'en occuper seul.", time: daysAgo(0, 1) });
  if (criteres.accordEstimation) {
    msgs.push({ from: "ia", text: "Parfait ! Un conseiller vous contactera sous 48h pour convenir d'un rendez-vous. Excellente journée à vous. 🏡", time: daysAgo(0, 2) });
  }
  return msgs;
}

function rand<T>(arr: T[], seed: number): T { return arr[seed % arr.length]; }

function makeProspects(): Prospect[] {
  const list: Prospect[] = [];
  const statuts: Statut[] = ["nouveau", "contacte", "conversation", "relance", "qualifie", "refuse", "injoignable"];
  for (let i = 0; i < 42; i++) {
    const pays: "BE" | "FR" = i % 3 === 0 ? "BE" : "FR";
    const ville = pays === "BE" ? rand(villesBE, i) : rand(villesFR, i * 3);
    const prenom = rand(prenoms, i);
    const nom = rand(noms, i * 7);
    const mobile = i % 4 !== 0;
    const telephoneType: "mobile" | "fixe" = mobile ? "mobile" : "fixe";
    const canal: Canal = mobile ? "whatsapp" : "email";
    const statut = statuts[i % statuts.length];
    const criteres: Prospect["criteres"] =
      statut === "nouveau"
        ? { bienAVendre: null, plusDeDixAns: null, moinsSixMois: null, accordEstimation: null }
        : statut === "contacte"
        ? { bienAVendre: null, plusDeDixAns: null, moinsSixMois: null, accordEstimation: null }
        : statut === "refuse"
        ? { bienAVendre: false, plusDeDixAns: null, moinsSixMois: null, accordEstimation: null }
        : statut === "conversation"
        ? { bienAVendre: true, plusDeDixAns: true, moinsSixMois: null, accordEstimation: null }
        : statut === "relance"
        ? { bienAVendre: true, plusDeDixAns: null, moinsSixMois: null, accordEstimation: null }
        : statut === "qualifie"
        ? { bienAVendre: true, plusDeDixAns: true, moinsSixMois: true, accordEstimation: true }
        : { bienAVendre: null, plusDeDixAns: null, moinsSixMois: null, accordEstimation: null };

    const tel = mobile
      ? pays === "BE"
        ? `+32 4${pad((i * 13) % 100)} ${pad((i * 17) % 100)} ${pad((i * 23) % 100)}`
        : `+33 6 ${pad((i * 11) % 100)} ${pad((i * 19) % 100)} ${pad((i * 29) % 100)} ${pad((i * 31) % 100)}`
      : pays === "BE"
      ? `+32 2 ${pad((i * 7) % 1000).slice(0, 3)} ${pad((i * 5) % 100)} ${pad((i * 3) % 100)}`
      : `+33 1 ${pad((i * 7) % 100)} ${pad((i * 5) % 100)} ${pad((i * 3) % 100)} ${pad((i * 9) % 100)}`;

    list.push({
      id: `p-${i + 1}`,
      nom,
      prenom,
      email: `${prenom.toLowerCase().replace(/[^a-z]/g, "")}.${nom.toLowerCase().replace(/[^a-z]/g, "")}@mail.com`,
      telephone: tel,
      telephoneType,
      adresse: `${(i * 7) % 200 + 1} ${["rue", "avenue", "boulevard"][i % 3]} ${["des Fleurs", "de la Paix", "Louise", "Victor Hugo", "de Namur", "du Commerce"][i % 6]}`,
      ville,
      pays,
      canal,
      statut,
      derniereActivite: daysAgo(i % 14),
      campagneId: `c-${(i % 3) + 1}`,
      criteres,
      conversation: makeConversation(criteres, canal),
    });
  }
  return list;
}

export const prospects: Prospect[] = makeProspects();

export const campagnes: Campagne[] = [
  { id: "c-1", nom: "Bruxelles Centre — Q3 2026", dateImport: daysAgo(12), nbProspects: 14, envoyes: 14, reponses: 9, qualifies: 3, statut: "active" },
  { id: "c-2", nom: "Paris 15e & 16e — Été 2026", dateImport: daysAgo(6), nbProspects: 16, envoyes: 15, reponses: 7, qualifies: 2, statut: "active" },
  { id: "c-3", nom: "Lyon métropole — Test", dateImport: daysAgo(2), nbProspects: 12, envoyes: 8, reponses: 3, qualifies: 1, statut: "pause" },
];

export const leadsQualifies = prospects.filter((p) => p.statut === "qualifie");

export const agencesPartenaires = [
  { id: "a-1", nom: "Immo Prestige Bruxelles", pays: "BE" },
  { id: "a-2", nom: "Namur Habitat", pays: "BE" },
  { id: "a-3", nom: "Century Anvers", pays: "BE" },
  { id: "a-4", nom: "Paris Rive Gauche Immobilier", pays: "FR" },
  { id: "a-5", nom: "Lyon Presqu'île Immo", pays: "FR" },
  { id: "a-6", nom: "Côte d'Azur Properties", pays: "FR" },
];

// Séries pour graphique 30 jours
export const serieActivite = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const base = 20 + Math.round(15 * Math.sin(i / 3));
  return {
    date: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`,
    envoyes: base + ((i * 7) % 25),
    reponses: Math.round((base + ((i * 5) % 15)) * 0.55),
    qualifies: Math.max(0, Math.round(((i * 3) % 8) - 1)),
  };
});

export const statutLabels: Record<Statut, string> = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  conversation: "En conversation",
  relance: "En relance",
  qualifie: "Qualifié",
  refuse: "Refusé",
  injoignable: "Injoignable",
};

export const statutColors: Record<Statut, string> = {
  nouveau: "bg-muted text-muted-foreground",
  contacte: "bg-chart-1/15 text-chart-1",
  conversation: "bg-chart-2/20 text-chart-2",
  relance: "bg-warning/20 text-warning-foreground",
  qualifie: "bg-success/20 text-success",
  refuse: "bg-destructive/15 text-destructive",
  injoignable: "bg-muted text-muted-foreground",
};
