import type { Target } from '../lib/counter';

export type Label = 'sunnah' | 'experience' | 'support';

export type StepKind = 'intention' | 'passage' | 'dua' | 'blowWipe' | 'handOnHead' | 'note';

export interface Step {
  id: string;
  kind: StepKind;
  ref?: string; // passage id (quran.json) or dua id (duas.ts)
  count: Target;
  label: Label;
  noteKey?: NoteKey;
  source?: string;
}

export type NoteKey =
  | 'noteIntention' | 'noteFatiha' | 'noteKursi' | 'noteBaqarah' | 'noteQuls'
  | 'noteBlowWipe' | 'notePain' | 'noteExperience' | 'noteForOther' | 'noteBaqarahMore';

export type RoutineId = 'sunnah' | 'extended' | 'other' | 'pain';

export interface Routine {
  id: RoutineId;
  minutes: number;
  label: Label;
  steps: Step[];
}
