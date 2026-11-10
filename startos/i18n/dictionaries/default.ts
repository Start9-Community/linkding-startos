export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Linkding!': 0,
  'Web Interface': 1,
  'The web interface is ready': 2,
  'The web interface is not ready': 3,

  // interfaces.ts
  'Web UI': 4,
  'The Linkding web interface': 5,

  Username: 10,
  Password: 11,

  'Set Owner Password': 13,
  'Generate a password for the owner account.': 14,
  'This replaces the password for ${username} and restores administrator access, including reactivating a disabled account.': 15,
  'Owner Credentials': 18,
  'Save these credentials; the password cannot be displayed again.': 19,
  'Set the owner password before signing in to Linkding.': 20,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
