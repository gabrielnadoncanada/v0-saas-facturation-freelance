// Constantes globales pour l'application
export const APP_NAME = 'Facturation Pro';

// Palette de couleurs
export const COLORS = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  success: {
    light: '#ecfdf5',
    main: '#10b981',
    dark: '#047857',
  },
  warning: {
    light: '#fffbeb',
    main: '#f59e0b',
    dark: '#b45309',
  },
  error: {
    light: '#fef2f2',
    main: '#ef4444',
    dark: '#b91c1c',
  },
  info: {
    light: '#eff6ff',
    main: '#3b82f6',
    dark: '#1d4ed8',
  },
};

// Tailles d'écran pour le responsive design
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Statuts des factures avec leurs couleurs associées
export const INVOICE_STATUSES = [
  { value: 'draft', label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
  { value: 'sent', label: 'Envoyée', color: 'bg-blue-100 text-blue-800' },
  { value: 'paid', label: 'Payée', color: 'bg-green-100 text-green-800' },
  { value: 'overdue', label: 'En retard', color: 'bg-red-100 text-red-800' },
];

// Statuts des projets avec leurs couleurs associées
export const PROJECT_STATUSES = [
  { value: 'active', label: 'Actif', color: 'bg-green-100 text-green-800' },
  { value: 'completed', label: 'Terminé', color: 'bg-blue-100 text-blue-800' },
  { value: 'on_hold', label: 'En pause', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'cancelled', label: 'Annulé', color: 'bg-red-100 text-red-800' },
];

// Priorités des tâches avec leurs couleurs associées
export const TASK_PRIORITIES = [
  { value: 'low', label: 'Basse', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Haute', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-800' },
];

// Statuts des tâches avec leurs couleurs associées
export const TASK_STATUSES = [
  { value: 'pending', label: 'À faire', color: 'bg-gray-100 text-gray-800' },
  { value: 'in_progress', label: 'En cours', color: 'bg-blue-100 text-blue-800' },
  { value: 'review', label: 'En révision', color: 'bg-purple-100 text-purple-800' },
  { value: 'completed', label: 'Terminée', color: 'bg-green-100 text-green-800' },
];

// Méthodes de paiement avec leurs labels
export const PAYMENT_METHODS = [
  { value: 'card', label: 'Carte bancaire' },
  { value: 'transfer', label: 'Virement bancaire' },
  { value: 'cash', label: 'Espèces' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'paypal', label: 'PayPal' },
];
