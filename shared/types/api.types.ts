// Résultat standard d'une action (mutation)
export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };

// Résultat d'une récupération de données (GET)
export type FetchResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; data: null };

// Résultat d'un formulaire validé avec Zod
export type FormResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Partial<Record<keyof T, string>> };
