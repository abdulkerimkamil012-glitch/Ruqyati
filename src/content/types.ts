import type { Target } from '../lib/counter';

export type Label = 'sunnah' | 'experience' | 'support';

export type StepKind = 'intention' | 'passage' | 'dua' | 'blowWipe' | 'handOnHead' | 'note' | 'blowWater' | 'useWater';

export type TitleKey = 'step_note' | 'step_waterSalt' | 'step_eyeWash' | 'step_sifted';

export interface Step {
  id: string;
  kind: StepKind;
  ref?: string; // passage id (quran.json) or dua id (duas.ts)
  count: Target;
  label: Label;
  noteKey?: NoteKey;
  titleKey?: TitleKey; // custom title for 'note' steps
  source?: string;
}

export type NoteKey =
  | 'noteIntention' | 'noteFatiha' | 'noteKursi' | 'noteBaqarah' | 'noteQuls'
  | 'noteBlowWipe' | 'notePain' | 'noteExperience' | 'noteForOther' | 'noteBaqarahMore'
  | 'noteComplete' | 'noteFear' | 'noteKarb' | 'noteEyeWash' | 'noteEyeQuls' | 'noteWater' | 'noteWaterSalt'
  | 'noteBlowWater' | 'noteUseWater' | 'noteSihr' | 'noteEyeVerse' | 'noteChild' | 'noteSalawat';

export type RoutineId = 'sunnah' | 'extended' | 'complete' | 'pain' | 'fear' | 'eye' | 'water' | 'other';

export interface Routine {
  id: RoutineId;
  minutes: number;
  label: Label;
  steps: Step[];
}
