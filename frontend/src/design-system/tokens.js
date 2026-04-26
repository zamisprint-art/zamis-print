// ============================================
// ZAMIS PRINT — Design System Tokens (JS)
// Framer Motion variants & animation presets
// ============================================

// --- MOTION VARIANTS ---

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// --- SPRING CONFIGS ---
export const springBounce = { type: 'spring', stiffness: 400, damping: 20 };
export const springSmooth = { type: 'spring', stiffness: 260, damping: 28 };

// --- HOVER / TAP PRESETS ---
export const hoverScale  = { scale: 1.04 };
export const hoverLift   = { y: -4, scale: 1.02 };
export const tapScale    = { scale: 0.97 };

// --- VIEWPORT SETTINGS (for whileInView) ---
export const viewportOnce = { once: true, margin: '-60px' };

// --- PAGE TRANSITIONS ---
export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25 } },
};

// --- COLORS (JS mirror for dynamic use) ---
export const colors = {
  brand: {
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
  },
  accent: {
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
  },
  success: '#22c55e',
  warning: '#f59e0b',
  danger:  '#ef4444',
  info:    '#38bdf8',
};
