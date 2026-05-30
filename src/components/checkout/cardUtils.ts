export const CARD_BRANDS: Record<string, string> = {
  '4': 'visa',
  '51': 'master', '52': 'master', '53': 'master', '54': 'master', '55': 'master',
  '34': 'amex', '37': 'amex',
  '300': 'diners', '301': 'diners', '302': 'diners', '303': 'diners', '304': 'diners', '305': 'diners', '36': 'diners', '38': 'diners', '39': 'diners',
  '6011': 'discover', '622': 'discover', '64': 'discover', '65': 'discover',
};

export function detectCardBrand(number: string): string {
  const clean = number.replace(/\s/g, '');
  for (const [prefix, brand] of Object.entries(CARD_BRANDS)) {
    if (clean.startsWith(prefix)) return brand;
  }
  return 'master';
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

export function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0; let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    const d = parseInt(digits[i], 10);
    if (alt) { const dd = d * 2; sum += dd > 9 ? dd - 9 : dd; } else { sum += d; }
    alt = !alt;
  }
  return sum % 10 === 0;
}

export function validExpiry(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 4) return false;
  const mm = parseInt(digits.slice(0, 2), 10);
  const yy = parseInt(digits.slice(2, 4), 10) + 2000;
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const expiry = new Date(yy, mm);
  return expiry > now;
}

export function validCvv(value: string, brand: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (brand === 'amex') return digits.length === 4;
  return digits.length >= 3 && digits.length <= 4;
}

export const SANITIZE = (s: string) => s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] || c));
