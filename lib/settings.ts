import { prisma } from '@/lib/prisma'

/** Settings Sylvia can change in the admin. Defaults are used until she saves her own. */
export const SETTING_DEFAULTS = {
  whatsappNumber: '254738895395', // shop orders by WhatsApp while online payment is not set up
} as const

export type SettingKey = keyof typeof SETTING_DEFAULTS

export async function getSetting(key: SettingKey): Promise<string> {
  const row = await prisma.siteSetting.findUnique({ where: { key } }).catch(() => null)
  return row?.value || SETTING_DEFAULTS[key]
}

export async function setSetting(key: SettingKey, value: string) {
  await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
}
