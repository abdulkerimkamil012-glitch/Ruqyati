import Dexie, { type Table } from 'dexie';
import type { Lang } from './dates';
import type { RoutineId } from '../content/types';

export type Theme = 'auto' | 'light' | 'night';
export type Meaning = 'am' | 'en' | 'none';

export interface Settings {
  id: 'app';
  lang: Lang;
  meaning: Meaning;
  translit: boolean;
  amPron: boolean; // duʿāʾ pronunciation in Amharic letters (never for Quran)
  fontScale: number;
  theme: Theme;
  autoNext: boolean;
  onboarded: boolean;
  reminderTime: string;
}

export interface Session {
  id: string;
  routineId: RoutineId;
  dayKey: string;
  startedAt: string; // UTC ISO
  completedAt?: string;
  stepIndex: number;
}

export const DEFAULT_SETTINGS: Settings = {
  id: 'app', lang: 'am', meaning: 'am', translit: true, amPron: true, fontScale: 1, theme: 'auto',
  autoNext: true, onboarded: false, reminderTime: '06:30',
};

class RuqyatiDB extends Dexie {
  settings!: Table<Settings, string>;
  sessions!: Table<Session, string>;
  constructor() {
    super('ruqyati');
    this.version(1).stores({ settings: 'id', sessions: 'id, dayKey, routineId' });
  }
}

export const db = new RuqyatiDB();

export function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
