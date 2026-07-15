
# Backoffice "Naïma AI" — Prospection immobilière automatisée

Application front-end uniquement (mock data, aucune vraie IA/WhatsApp/Email envoyée). Interface 100% en français, design premium, light mode par défaut avec bascule dark mode, effets de fond soignés (gradients, blobs, grain léger).

## Design & Identité

- **Logo** : monogramme "N" stylisé + wordmark "Naïma AI — Prospection Immobilière"
- **Palette** : bleu nuit + doré/champagne (immobilier premium) + accents émeraude (leads chauds)
- **Fond** : dégradés doux + orbes floutés animés + fine texture grain
- **Typo** : sans-serif moderne (headings display, body lisible)
- **Composants** : shadcn (cards glassmorphism légères, badges de statut, tables denses)
- **Dark mode** : toggle en header, tokens sémantiques via `src/styles.css`
- **Tokens** définis dans `src/styles.css` (oklch), jamais de couleurs hardcodées

## Pages & Routes

```
/login                    Page de connexion (identifiants pré-remplis)
/                         Dashboard
/prospects                Liste des prospects importés
/prospects/$id            Fiche prospect + historique conversation
/import                   Import fichier Excel (mock drag & drop)
/campagnes                Campagnes IA en cours
/leads                    Leads qualifiés (chauds) — livrables
/configuration            Config des relances + plages horaires
/parametres               Compte / préférences
```

Layout avec **sidebar** rétractable + header (logo, recherche, toggle thème, avatar).

### 1. `/login`
- Split-screen : visuel immobilier + formulaire
- Champs **pré-remplis** : `naima@agence.ai` / `demo1234`
- Bouton "Se connecter" → redirige vers `/`

### 2. Dashboard `/`
- KPI cards : Prospects importés, Messages envoyés, Taux de réponse, Leads chauds générés
- Graphique évolution (Recharts) — mock 30 jours
- Feed d'activité IA temps réel simulé (messages envoyés, réponses reçues)
- Répartition canal (WhatsApp vs Email) — donut

### 3. Import `/import`
- Zone drag & drop `.xlsx` (mock, pas de vrai parsing)
- Aperçu tableau des colonnes détectées : Nom, Email, Téléphone, Adresse
- Détection auto du type de numéro (mobile → WhatsApp, fixe → Email) avec badge
- Bouton "Lancer la campagne IA" → toast succès + redirection

### 4. Prospects `/prospects`
- Table filtrable : nom, canal, statut (Nouveau, Contacté, En conversation, Relance, Qualifié, Refusé, Injoignable)
- Filtres : canal, statut, ville, dernière activité
- Clic ligne → fiche détaillée

### 5. Fiche prospect `/prospects/$id`
- Infos coordonnées + carte statuts (bien à vendre ? >10 ans ? <6 mois ? estimation OK ?)
- **Timeline conversation** style chat (bulles IA vs prospect) mockée avec les 4 questions du script
- Badge "Lead qualifié" si les 4 critères = oui
- Bouton "Transmettre à Mme Naïma" / "Programmer RDV"

### 6. Campagnes `/campagnes`
- Liste des campagnes (nom, date import, nb prospects, progression barre, statut)
- Détail : split WhatsApp/Email, courbe d'envoi

### 7. Leads qualifiés `/leads`
- Vue "livrables" — cards premium mise en avant
- Chaque lead : coordonnées, réponses aux 4 critères, canal source, date qualification
- Actions : Valider RDV / Assigner à une agence (mock select agences BE/FR) / Exporter

### 8. Configuration `/configuration` **(cœur du besoin)**

Onglets :

**Onglet "Relances"**
- Délai avant 1ère relance (slider : 1h → 7 jours)
- Nombre max de relances (1 → 10)
- Intervalle entre relances (heures/jours)
- Templates de messages par relance (WhatsApp / Email) — textarea éditable

**Onglet "Plages horaires autorisées"**
- Pour chaque jour (Lun→Dim) :
  - Switch actif/inactif
  - Heure de début / heure de fin (time pickers)
- Fuseau horaire (Europe/Brussels par défaut)
- Aperçu visuel semaine type

**Onglet "Script IA"**
- Édition des 4 questions du script de qualification (readonly par défaut, mode édition)

**Onglet "Canaux"**
- Signature Email, nom expéditeur WhatsApp, disclaimers RGPD

Toutes les valeurs persistées en `localStorage` (mock).

## Mock Data (`src/lib/mock-data.ts`)

- ~40 prospects (mix BE/FR, mobiles + fixes)
- ~15 conversations complètes avec les 4 questions
- 8 leads qualifiés
- 3 campagnes
- Config relances par défaut : 24h avant 1ère, 3 relances max, 48h d'intervalle, Lun-Ven 9h-19h, Sam 10h-17h, Dim off

## Thème light/dark

- `ThemeProvider` custom (localStorage) + toggle Sun/Moon dans header
- Light mode par défaut au premier chargement
- Tous les composants testés dans les deux modes

## Détails techniques

- TanStack Start, routes fichiers dans `src/routes/`
- Sidebar shadcn avec route active mise en évidence
- Recharts pour graphiques
- `date-fns` (déjà installable) avec locale `fr`
- Icônes Lucide
- Aucune backend / aucune vraie IA — tout est mocké
- Login = simple flag `isAuthed` en localStorage, garde côté client
- Head metadata FR : titre "Naïma AI — Prospection Immobilière"

## Livraison

Une fois construit : parcours complet cliquable — login → dashboard → import → campagne → prospects → conversation → lead qualifié → configuration relances/plages, en light et dark mode.
