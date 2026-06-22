/** Un pays normalisé pour le jeu (issu de world-countries). */
export interface Country {
  cca2: string; // ISO 3166-1 alpha-2 en minuscules (utilisé par flag-icons)
  name: string; // nom commun en français
  nameEn: string; // nom commun en anglais
  capital: string;
  lat: number; // centroïde du pays
  lng: number;
  capitalLat?: number;
  capitalLng?: number;
  region: string;
  continent: string; // continent en français
  population: number;
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
}

/** Contrat d'un mode de jeu. Ajouter un mode = ajouter un fichier qui exporte un GameMode. */
export interface GameMode {
  id: string;
  label: string;
  description: string;
  icon: string; // emoji
  inputType: InputType;
  /** génère une question aléatoire. */
  generate: () => Question;
}

/** Réponse fournie par le joueur, selon le type d'entrée. */
export type Answer =
  | { kind: 'choice'; choiceId: string }
  | { kind: 'text'; value: string }
  | { kind: 'point'; lat: number; lng: number };
