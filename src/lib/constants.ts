// Drops platform constants

// Commission rates (percentage)
export const COMMISSION_SOLO = 0.2;
export const COMMISSION_SOCIAL = 0.3;
export const COMMISSION_FULL = 0.5;
export const DEFAULT_COMMISSION = COMMISSION_SOLO;

// Limits
export const MIN_WITHDRAWAL_AMOUNT = 50;

// Exchange rate fallback (ARS per 1 USD)
export const DEFAULT_ARS_RATE = 1200;

// Time windows (ms)
export const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
export const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

// Signed URLs
export const SIGNED_URL_EXPIRY_SECONDS = 3600;

// Upload limits
export const CONTENT_FILE_MAX_SIZE = 50 * 1024 * 1024; // 50MB
export const PHOTO_MAX_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Rate limits (max requests, window ms)
export const RATE_LIMIT = {
  PAYMENT: { max: 10, window: 60000 },
  UPLOAD: { max: 20, window: 60000 },
  APPLY: { max: 5, window: 3600000 },
  REGISTER: { max: 10, window: 3600000 },
};

// Admin pagination
export const ADMIN_PAGE_SIZE = 20;
