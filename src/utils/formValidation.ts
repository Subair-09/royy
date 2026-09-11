/**
 * Comprehensive Form Validation Utilities for Faith Academy Portal
 * Provides robust validation, sanitization, and descriptive feedback across all forms.
 */

// Email regex conforming to standard web formats (rejects consecutive dots, missing local part, missing domain or TLD)
export const EMAIL_REGEX =
  /^[a-zA-Z0-9_%+-]+(?:\.[a-zA-Z0-9_%+-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

// Phone regex requiring exactly 11 digits (Nigerian standard e.g. 08012345678)
export const PHONE_REGEX = /^\d{11}$/;

// Academic session format: e.g. "2024/2025" or "2025/2026"
export const SESSION_REGEX = /^(\d{4})\/(\d{4})$/;

// Student Registration Number regex (numeric 4 to 12 digits, or alphanumeric)
export const STUDENT_ID_REGEX = /^[A-Za-z0-9\-_]{4,15}$/;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates an email address.
 */
export function validateEmail(email: string, required = true, customErrorMessage?: string): ValidationResult {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    return {
      isValid: !required,
      error: required ? (customErrorMessage || 'Email address is required.') : undefined,
    };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error: customErrorMessage || 'Please enter a valid email address (e.g. user@example.com).',
    };
  }
  return { isValid: true };
}

/**
 * Validates an administrator email address.
 * Rejects invalid formats such as john..doe@gmail.com, john@, @gmail.com, and john@gmail.
 */
export function validateAdminEmail(email: string): ValidationResult {
  const trimmed = (email || '').trim();
  if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid administrator email address',
    };
  }
  return { isValid: true };
}

/**
 * Validates a telephone number.
 * Must be exactly 11 digits (e.g. 08012345678) and cannot contain letters or special characters.
 */
export function validatePhone(phone: string, required = false): ValidationResult {
  const trimmed = (phone || '').trim();
  if (!trimmed) {
    return {
      isValid: !required,
      error: required ? 'Phone number is required.' : undefined,
    };
  }

  // Reject any letters or invalid characters
  if (/[a-zA-Z]/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Phone number cannot contain alphabet letters. Numbers only (11 digits).',
    };
  }

  const cleanDigits = trimmed.replace(/[\s-]/g, '');
  if (!/^\d+$/.test(cleanDigits)) {
    return {
      isValid: false,
      error: 'Phone number must contain numbers only.',
    };
  }

  if (cleanDigits.length !== 11) {
    return {
      isValid: false,
      error: `Phone number must be exactly 11 digits (e.g. 08012345678). Currently ${cleanDigits.length} digit${cleanDigits.length === 1 ? '' : 's'}.`,
    };
  }

  return { isValid: true };
}

/**
 * Validates a password input.
 */
export function validatePassword(password: string, fieldName = 'Password', minLength = 6): ValidationResult {
  const trimmed = (password || '').trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: `${fieldName} is required.`,
    };
  }
  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters long.`,
    };
  }
  return { isValid: true };
}

/**
 * Validates full name or personal name fields.
 * Field that is supposed to take alphabet must ONLY take alphabet, spaces, hyphens, and apostrophes.
 * Field that is not supposed to take numbers MUST NOT take numbers.
 */
export function validateName(name: string, fieldName = 'Name', minLength = 2, maxLength = 80): ValidationResult {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: `${fieldName} is required.`,
    };
  }
  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters long.`,
    };
  }
  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${maxLength} characters.`,
    };
  }
  // Must NOT take numbers
  if (/\d/.test(trimmed)) {
    return {
      isValid: false,
      error: `${fieldName} cannot contain numbers. Please use alphabet letters only.`,
    };
  }
  // Must only take alphabet letters, spaces, hyphens, periods, or apostrophes
  if (!/^[a-zA-Z\s'.-]+$/.test(trimmed)) {
    return {
      isValid: false,
      error: `${fieldName} can only contain alphabet letters, spaces, hyphens, and apostrophes.`,
    };
  }
  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(trimmed)) {
    return {
      isValid: false,
      error: `${fieldName} must contain alphabetical letters.`,
    };
  }
  return { isValid: true };
}

/**
 * Validates fields that must strictly contain alphabet letters (no numbers).
 */
export function validateAlphabetOnly(
  value: string,
  fieldName: string,
  required = true,
  minLength = 1,
  maxLength = 80
): ValidationResult {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return {
      isValid: !required,
      error: required ? `${fieldName} is required.` : undefined,
    };
  }
  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters.`,
    };
  }
  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${maxLength} characters.`,
    };
  }
  if (/\d/.test(trimmed)) {
    return {
      isValid: false,
      error: `${fieldName} cannot contain numbers. Alphabet letters only.`,
    };
  }
  if (!/^[a-zA-Z\s'.-]+$/.test(trimmed)) {
    return {
      isValid: false,
      error: `${fieldName} can only contain alphabet characters.`,
    };
  }
  return { isValid: true };
}

/**
 * Validates fields that must strictly contain numeric digits (no letters).
 */
export function validateNumbersOnly(
  value: string,
  fieldName: string,
  required = true,
  exactDigits?: number,
  minLength?: number,
  maxLength?: number
): ValidationResult {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return {
      isValid: !required,
      error: required ? `${fieldName} is required.` : undefined,
    };
  }
  if (/[a-zA-Z]/.test(trimmed)) {
    return {
      isValid: false,
      error: `${fieldName} cannot contain alphabet letters. Numbers only.`,
    };
  }
  if (!/^\d+$/.test(trimmed)) {
    return {
      isValid: false,
      error: `${fieldName} must contain numbers only.`,
    };
  }
  if (exactDigits && trimmed.length !== exactDigits) {
    return {
      isValid: false,
      error: `${fieldName} must be exactly ${exactDigits} digits.`,
    };
  }
  if (minLength && trimmed.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} digits.`,
    };
  }
  if (maxLength && trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${maxLength} digits.`,
    };
  }
  return { isValid: true };
}

/**
 * Validates a Student Registration ID.
 */
export function validateStudentId(studentId: string, required = true): ValidationResult {
  const trimmed = (studentId || '').trim();
  if (!trimmed) {
    return {
      isValid: !required,
      error: required ? 'Registration ID is required.' : undefined,
    };
  }
  if (/[a-zA-Z]/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Registration ID cannot contain alphabet letters. Numbers only.',
    };
  }
  if (!/^\d+$/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Registration ID must contain numbers only.',
    };
  }
  if (trimmed.length < 4 || trimmed.length > 15) {
    return {
      isValid: false,
      error: 'Registration ID must be between 4 and 15 digits.',
    };
  }
  return { isValid: true };
}

/**
 * Validates general required text inputs with min and max bounds.
 */
export function validateRequiredText(
  value: string,
  fieldName: string,
  minLength = 1,
  maxLength = 500
): ValidationResult {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    return {
      isValid: false,
      error: `${fieldName} is required.`,
    };
  }
  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} character${minLength === 1 ? '' : 's'}.`,
    };
  }
  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${maxLength} characters.`,
    };
  }
  return { isValid: true };
}

/**
 * Validates an academic session year (e.g. "2024/2025").
 */
export function validateSessionYear(sessionYear: string): ValidationResult {
  const trimmed = (sessionYear || '').trim().replace(/\s/g, '');
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Academic session year is required (e.g. 2024/2025).',
    };
  }
  if (/[a-zA-Z]/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Academic session year cannot contain alphabet letters. Numbers only in format YYYY/YYYY (e.g. 2024/2025).',
    };
  }
  const match = trimmed.match(SESSION_REGEX);
  if (!match) {
    return {
      isValid: false,
      error: 'Session must follow format YYYY/YYYY (e.g. 2024/2025).',
    };
  }
  const start = parseInt(match[1], 10);
  const end = parseInt(match[2], 10);
  if (end !== start + 1) {
    return {
      isValid: false,
      error: `Invalid session span: ${start}/${end}. Academic session must span consecutive years (e.g. ${start}/${start + 1}).`,
    };
  }
  return { isValid: true };
}

/**
 * Validates a subject title (e.g. "Mathematics", "English Language", "Further Mathematics").
 * Must NOT contain numbers.
 */
export function validateSubjectName(name: string): ValidationResult {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Subject title is required.' };
  }
  if (/\d/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Subject title cannot contain numbers. Alphabet letters only (e.g. Further Mathematics).',
    };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Subject title must be at least 2 characters.' };
  }
  if (trimmed.length > 80) {
    return { isValid: false, error: 'Subject title cannot exceed 80 characters.' };
  }
  if (!/^[a-zA-Z\s'.-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Subject title can only contain letters, spaces, and hyphens.' };
  }
  return { isValid: true };
}

/**
 * Validates an academic term name (e.g. "First Term", "Second Term", "Third Term").
 * Must NOT contain numbers (must be written in words).
 */
export function validateTermName(name: string): ValidationResult {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Academic term name is required (e.g. First Term, Second Term).' };
  }
  if (/\d/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Term name cannot contain numbers. Please write in words (e.g. First Term, Second Term, Third Term).',
    };
  }
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Term name must be at least 3 characters.' };
  }
  if (trimmed.length > 50) {
    return { isValid: false, error: 'Term name cannot exceed 50 characters.' };
  }
  if (!/^[a-zA-Z\s'.-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Term name can only contain letters, spaces, and hyphens.' };
  }
  return { isValid: true };
}

/**
 * Validates an arm stream identifier (e.g. "Emerald", "Gold", "Diamond", "A", "Blue").
 * Must NOT contain numbers.
 */
export function validateClassArm(arm: string): ValidationResult {
  const trimmed = (arm || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Arm stream identifier is required (e.g. Emerald, Gold, A).' };
  }
  if (/\d/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Arm stream cannot contain numbers. Alphabet letters only (e.g. Emerald, Gold, A).',
    };
  }
  if (trimmed.length < 1) {
    return { isValid: false, error: 'Arm stream must have at least 1 character.' };
  }
  if (trimmed.length > 30) {
    return { isValid: false, error: 'Arm stream cannot exceed 30 characters.' };
  }
  if (!/^[a-zA-Z\s'.-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Arm stream can only contain alphabet letters.' };
  }
  return { isValid: true };
}

/**
 * Validates a subject code (e.g. "MTH", "ENG", "BIO101").
 */
export function validateSubjectCode(code: string): ValidationResult {
  const trimmed = (code || '').trim().toUpperCase();
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Subject code is required.',
    };
  }
  if (trimmed.length < 2 || trimmed.length > 10) {
    return {
      isValid: false,
      error: 'Subject code must be between 2 and 10 characters (e.g. MTH, ENG).',
    };
  }
  if (!/^[A-Z0-9\-_]+$/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Subject code can only contain letters, numbers, and hyphens.',
    };
  }
  return { isValid: true };
}

/**
 * Validates numeric scores with lower and upper bounds.
 */
export function validateScore(
  val: any,
  maxScore = 100,
  minScore = 0,
  fieldName = 'Score'
): { isValid: boolean; error?: string; numericValue: number } {
  if (val === '' || val === null || val === undefined) {
    return { isValid: true, numericValue: 0 };
  }
  const num = Number(val);
  if (isNaN(num)) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid number.`,
      numericValue: 0,
    };
  }
  if (num < minScore) {
    return {
      isValid: false,
      error: `${fieldName} cannot be less than ${minScore}.`,
      numericValue: minScore,
    };
  }
  if (num > maxScore) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${maxScore}.`,
      numericValue: maxScore,
    };
  }
  return { isValid: true, numericValue: num };
}

/**
 * Validates attendance days opened, present, and absent.
 */
export function validateAttendance(present: number, opened: number): ValidationResult {
  if (opened < 0) {
    return { isValid: false, error: 'Times school opened cannot be negative.' };
  }
  if (present < 0) {
    return { isValid: false, error: 'Times present cannot be negative.' };
  }
  if (present > opened && opened > 0) {
    return {
      isValid: false,
      error: `Times present (${present}) cannot exceed total days school opened (${opened}).`,
    };
  }
  return { isValid: true };
}
