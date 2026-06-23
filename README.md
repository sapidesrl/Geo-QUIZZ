# Geo-QUIZZ

Application de quizz géographique (PWA) jouable au navigateur et sur smartphone,
**hors-ligne**, avec données embarquées.

## Modes de jeu

- **Capitale — QCM** : choisir la capitale parmi 4 propositions.
- **Capitale — Saisie** : écrire la capitale (tolérance aux accents / fautes mineures).
- **Capitale → Pays — QCM** : retrouver le pays à partir de sa capitale.
- **Drapeau — QCM** : reconnaître le drapeau d'un pays parmi 4.
- **Drapeau — Saisie** : nommer le pays à partir de son drapeau.
- **Continent — QCM** : trouver le continent d'un pays.
- **Pays frontalier — QCM** : parmi 4 pays, lequel partage une frontière avec le pays donné.
- **Monnaie — QCM** : retrouver la monnaie d'un pays.
- **Langue — QCM** : retrouver la langue principale d'un pays.
- **Le plus grand — QCM** : parmi 4 pays, désigner le plus vaste.
- **Le plus peuplé — QCM** : parmi 4 pays, désigner le plus peuplé.
- **Le moins peuplé — QCM** : parmi 4 pays, désigner le moins peuplé.
- **Situer un pays** : placer un pays sur la carte du monde.
- **Situer une ville** : placer une ville sur la carte du monde.
- **Coupe du monde 2026** : situer les villes hôtes du Mondial (USA, Canada, Mexique).
- **Mode mixte — révision** : un mélange de toutes les questions, tous modes confondus.
- **Défi du jour** : un quiz quotidien déterministe, identique pour tous (rejouable à l'identique).

Les données de population sont embarquées (`src/data/populations.ts`, généré par
`scripts/generate-populations.mjs` à partir du jeu de données ouvert `country-json`).
Les frontières, monnaies et langues proviennent de `world-countries` (embarqué).
Les noms de monnaies et de langues (fournis en anglais par la source) sont traduits
en français via `src/i18n/fr.ts` (clés sur les codes ISO 4217 / ISO 639-3), première
brique d'un futur multi-langue (voir « Internationalisation »).

D'autres modes s'ajoutent facilement (voir « Ajouter un mode »).

## Progression & gamification

- **Défi du jour** : tirage rendu déterministe par un générateur seedé sur la date
  (`src/lib/rng.ts` ; `withSeed` enveloppe la génération de la partie). Même quiz pour
  tout le monde un jour donné.
- **Succès / trophées** : catalogue dans `src/lib/achievements.ts`, évalué à la fin de
  chaque partie ; les succès débloqués s'affichent sur l'écran de résultats et la page
  **Trophées** (`/stats`) qui récapitule aussi parties jouées, précision, modes essayés.
- **Sons de feedback** : synthétisés via l'API Web Audio (`src/lib/sound.ts`, aucun
  fichier audio → hors-ligne), activables/désactivables depuis l'accueil.
- **Retour haptique** : vibration légère sur réponse (API Vibration web, surtout Android).

## Confort de jeu

- **Clavier** : en QCM, touches **1–4** pour répondre (badges affichés) ; **Entrée / Espace / →**
  pour passer à la question suivante. Focus visible au clavier.
- **Carte** : zoom (molette / contrôles), placement précis du repère, cadrage automatique
  sur la cible à la révélation.
- **~140 villes** embarquées pour « situer une ville » (couverture mondiale, compatible
  filtre par continent).

## Stack technique

| Domaine | Choix |
| --- | --- |
| Langage / UI | TypeScript + React 18 |
| Build / dev | Vite |
| PWA (offline, installable) | vite-plugin-pwa (Workbox) |
| Style | Tailwind CSS |
| Navigation | React Router (HashRouter) |
| État / scores | Zustand (persisté en localStorage) |
| Cartes | MapLibre GL JS (fond vectoriel hors-ligne) |
| Données pays / drapeaux / géométrie | `world-countries` + `flag-icons` + `world-atlas` (embarqués) |
| Tests | Vitest + Testing Library |

L'app web pourra être empaquetée en application native iOS/Android via **Capacitor**
sans réécriture (étape ultérieure).

## Démarrage

```bash
npm install
npm run dev        # serveur de développement
npm run build      # vérification TypeScript + build de production
npm run preview    # prévisualiser le build (test PWA / offline)
npm run test       # tests unitaires
npm run lint       # ESLint
```

## Déploiement (GitHub Pages)

Le workflow `.github/workflows/deploy.yml` build et publie l'app sur GitHub Pages à
chaque `push` sur `main` (et manuellement via *workflow_dispatch*).

- **Activation (une fois)** : dans *Settings → Pages*, choisir **Source = GitHub Actions**.
- Le build est produit avec `BASE_PATH=./` (base relatif), puis publié via les actions
  officielles `upload-pages-artifact` / `deploy-pages`.
- URL : **https://sapidesrl.github.io/Geo-QUIZZ/**

Le `base` est paramétrable par la variable d'environnement `BASE_PATH` (défaut `/`). Le
workflow utilise un **base relatif** (`./`) pour que les assets se résolvent par rapport à
l'URL réelle de la page : insensible au sous-chemin et à la casse du nom de dépôt (le site
est servi sous `/Geo-QUIZZ/`). Les builds locaux et **Capacitor** restent en racine sans
changement. Le routage `HashRouter` reste compatible (pas de fallback 404 requis).

## Internationalisation (en cours)

Toutes les **réponses** sont en français : noms de pays (`world-countries`, champ
`translations.fra`), capitales, continents, et désormais monnaies et langues
(traduites dans `src/i18n/fr.ts`, en clé sur les codes ISO portés par `Country`
— `currencyCode`, `languageCode`).

Cette séparation **code ISO ↔ libellé localisé** prépare le multi-langue :
ajouter une langue d'interface reviendra à fournir un fichier `src/i18n/<locale>.ts`
du même format, puis à résoudre les libellés selon la locale courante. L'i18n des
textes d'interface (titres, libellés de modes, énoncés) reste à faire dans un second
temps.

## Structure

```
src/
  data/        countries.ts (depuis world-countries), cities.ts
  engine/      types.ts (GameMode, Question…), generate.ts, check.ts
  modes/       un fichier par mode + index.ts (registre)
  components/  MultipleChoice, FreeTextInput, MapPicker, FlagImage, ScoreBar
  pages/       Home, ModeSelect, Game, Results, Stats
  store/       useGameStore (Zustand)
  lib/         normalize, levenshtein, shuffle, geo (haversine), rng, sound, achievements
  i18n/        fr.ts (noms de monnaies/langues en français, clés sur codes ISO)
```

## Ajouter un mode

1. Créer `src/modes/mon-mode.ts` qui exporte un objet `GameMode`
   (`id`, `label`, `description`, `icon`, `inputType`, `generate()`).
2. L'ajouter au tableau `baseModes` dans `src/modes/base.ts` (il est alors
   automatiquement inclus dans le catalogue, le mode mixte et le défi du jour).

L'écran de sélection et le moteur de partie le prennent en compte automatiquement.
La validation des réponses est générique (`engine/check.ts`) selon `inputType`
(`multiple-choice`, `free-text`, `map-pin`).

## Hors-ligne

- Le fond de carte est **vectoriel et embarqué** (géométrie Natural Earth 110m via
  `world-atlas`, rendue par MapLibre) : aucune connexion ni serveur de tuiles requis.
- MapLibre et la géométrie monde sont **chargés à la demande** (lazy-load) : ils
  ne pèsent sur le téléchargement que lorsqu'on lance un mode carte.
- Toutes les données (pays, capitales, drapeaux, villes) sont locales et précachées
  par le service worker.

## Applications natives (Capacitor)

Les projets natifs `android/` et `ios/` sont versionnés ; le code web buildé (`dist/`)
y est injecté par Capacitor. Pré-requis : Android Studio (Android) et Xcode + CocoaPods
sur macOS (iOS).

```bash
# Après une modification du code web :
npm run cap:sync            # build web + copie dans les projets natifs

# Ouvrir le projet natif dans l'IDE pour compiler / lancer / publier :
npm run cap:android         # build + sync + ouvre Android Studio
npm run cap:ios             # build + sync + ouvre Xcode (macOS)
```

App id : `com.geoquizz.app` (voir `capacitor.config.ts`). Le routage utilise
`HashRouter`, compatible avec le service de fichiers natif de Capacitor.

### Icônes et écran de démarrage

Les images sources (logo globe) sont générées par script, puis déclinées pour
chaque plateforme par `@capacitor/assets` :

```bash
node scripts/generate-source-assets.mjs   # (re)génère assets/*.png et public/pwa-*.png
npx capacitor-assets generate --ios --android   # décline icônes + splash natifs
```

- `scripts/generate-source-assets.mjs` produit les sources (icône, avant-plan/
  arrière-plan adaptatifs Android, splash clair/sombre) et les icônes PWA.
- Le splash natif est masqué à la fin du chargement (`@capacitor/splash-screen`,
  `launchAutoHide: false` + `SplashScreen.hide()` dans `src/main.tsx`).
- Modifier le logo = éditer le script puis relancer ces deux commandes.

## Pistes

- Frontières plus détaillées (50m) pour un placement plus précis.
- Icônes / écran de démarrage natifs (`@capacitor/assets`).
