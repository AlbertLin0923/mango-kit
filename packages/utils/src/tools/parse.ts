import dayjs from 'dayjs'

import type { Dayjs } from 'dayjs'

export function parseDate(
  timestamp: Dayjs | Date | null | string | number,
  format = 'YYYY-MM-DD HH:mm:ss',
): string {
  if (!timestamp) {
    return ''
  }
  return dayjs(timestamp).format(format)
}

export function parseCurrency(currency: number, withCurrency = true): string {
  return withCurrency
    ? new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
      }).format(currency)
    : new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
      })
        .format(currency)
        .slice(1)
}

export const parseText = (text: any): string => {
  if (text === null || text === undefined || text === '') {
    return '--'
  } else {
    return text
  }
}
