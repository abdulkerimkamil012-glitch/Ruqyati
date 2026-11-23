// Calendar reminders: a daily repeating event, no server needed.

const pad = (n: number) => String(n).padStart(2, '0');

export interface ReminderInput {
  time: string; // HH:mm local
  title: string;
  details: string;
  url: string;
  start: Date; // first day
}

function stamp(d: Date, time: string): string {
  const [h, m] = time.split(':').map(Number);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(h)}${pad(m)}00`;
}

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number);
  const t = (h * 60 + m + mins) % (24 * 60);
  return `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** iCalendar text with a daily repeat and an alarm at the event time. Floating local time. */
export function buildIcs(r: ReminderInput): string {
  const start = stamp(r.start, r.time);
  const end = stamp(r.start, addMinutes(r.time, 10));
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ruqyati//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:ruqyati-${start}@ruqyati.app`,
    `DTSTAMP:${stamp(new Date(), '00:00')}`,
    `DTSTART:${start}`, `DTEND:${end}`,
    'RRULE:FREQ=DAILY',
    `SUMMARY:${esc(r.title)}`, `DESCRIPTION:${esc(`${r.details}\n${r.url}`)}`, `URL:${r.url}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(r.title)}`, 'TRIGGER:PT0M', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ];
  return lines.join('\r\n') + '\r\n';
}

/** Google Calendar "create event" link with a daily repeat. */
export function googleCalendarUrl(r: ReminderInput): string {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: r.title,
    details: `${r.details}\n${r.url}`,
    dates: `${stamp(r.start, r.time)}/${stamp(r.start, addMinutes(r.time, 10))}`,
    recur: 'RRULE:FREQ=DAILY',
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function isValidTime(t: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(t);
}
