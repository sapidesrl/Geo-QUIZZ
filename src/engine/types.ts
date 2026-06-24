/** Un pays normalisé pour le jeu (issu de world-countries). */
export interface Country {
  cca2: string; // ISO 3166-1 alpha-2 en minuscules (utilisé par flag-icons)
  ccn3: string; // ISO 3166-1 numérique (ex. "250") — clé des polygones world-atlas
  name: string; // nom commun en français
  nameEn: string; // nom commun en anglais
  capital: string;
  lat: number; // centroïde du pays
  lng: number;
  capitalLat?: number;
  capitalLng?: number;
  region: string;
  continent: string; // continent en français
  area: number; // superficie en km²
  population: number; // nombre d'habitants
  borders: string[]; // pays frontaliers (codes ISO alpha-2 minuscules)
  currencyCode: string; // code ISO 4217 (ex. EUR, USD) — clé de traduction
  currency: string; // monnaie principale (nom localisé)
  languageCode: string; // code ISO 639-3 (ex. fra, eng) — clé de traduction
  language: string; // langue principale (nom localisé)
}

/** Une ville (pour le mode « situer les villes »). */
export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export type InputType = 'multiple-choice' | 'free-text' | 'map-pin';

export interface Choice {
  id: string;
  label: string;
  /** code pays ISO alpha-2 (minuscules) si le choix est un drapeau. */
  flag?: string;
}

export interface MapTarget {
  lat: number;
  lng: number;
  toleranceKm: number;
  label: string;
  /** En mode « sélection de polygone » : code cca2 du pays à désigner.
   * Présent ⇒ la carte attend un clic sur le bon pays (pas de distance). */
  code?: string;
}

/** Une question prête à afficher, indépendante du mode qui l'a produite. */
export interface Question {
  inputType: InputType;
  /** énoncé textuel. */
  prompt: string;
  /** drapeau à afficher dans l'énoncé (code ISO alpha-2 minuscules). */
  flag?: string;
  /** choix pour les QCM. */
  choices?: Choice[];
  /** id du choix correct (QCM). */
  correctChoiceId?: string;
  /** réponses acceptées (saisie libre). */
  acceptedAnswers?: string[];
  /** cible géographique (placement sur carte). */
  target?: MapTarget;
  /** libellé de la bonne réponse, pour l'affichage après validation. */
  answerLabel: string;
  /** pays « sujet » de la question (cca2) — alimente la révision espacée. */
  subjectCode?: string;
}

/** Sous-ensemble de données dans lequel un mode tire ses questions (filtres UX). */
export interface GenerateOptions {
  countries: Country[];
  cities: City[];
}

/** Contrat d'un mode de jeu. Ajouter un mode = ajouter un fichier qui exporte un GameMode. */
export interface GameMode {
  id: string;
  label: string;
  description: string;
  icon: string; // emoji
  inputType: InputType;
  /** Mode « variadique » : ses questions peuvent mélanger plusieurs inputType
   * (ex. mode mixte, défi du jour). `inputType` n'est alors qu'indicatif. */
  variadic?: boolean;
  /** génère une question aléatoire dans le sous-ensemble fourni. */
  generate: (options?: GenerateOptions) => Question;
}

/** Récapitulatif d'une question pour l'écran de résultats. */
export interface QuestionRecap {
  prompt: string;
  answerLabel: string;
  correct: boolean;
  flag?: string;
  distanceKm?: number;
}

/** Réponse fournie par le joueur, selon le type d'entrée. */
export type Answer =
  | { kind: 'choice'; choiceId: string }
  | { kind: 'text'; value: string }
  | { kind: 'point'; lat: number; lng: number }
  | { kind: 'region'; code: string };
