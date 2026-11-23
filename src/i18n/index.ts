import { en, type Dict, type Key } from './en';
import { am } from './am';
import { ar } from './ar';
import type { Lang } from '../lib/dates';

export const DICTS: Record<Lang, Dict> = { en, am, ar };

export type TFn = (key: Key, vars?: Record<string, string | number>) => string;

export function translate(d: Dict): TFn {
  return (key, vars) => {
    let s = d[key] ?? en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

export const LANG_NAMES: Record<Lang, string> = { am: 'አማርኛ', ar: 'العربية', en: 'English' };
