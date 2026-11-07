const TIME_ZONE = 'America/Guatemala';
const UTC_OFFSET = '-06:00';

const FIRST_HOUR = 7;
const LAST_HOUR = 21;

function pad(value) {
  return String(value).padStart(2, '0');
}

export function todayInGuatemala() {
  const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE });

  return formatter.format(new Date());
}

function buildSlots() {
  const slots = [];

  for (let hour = FIRST_HOUR; hour < LAST_HOUR; hour++) {
    slots.push({
      inicio: `${pad(hour)}:00`,
      fin: `${pad(hour + 1)}:00`,
    });
  }

  return slots;
}

export const SLOTS = buildSlots();

export function isPast(date, time) {
  const start = new Date(`${date}T${time}:00${UTC_OFFSET}`);

  return start.getTime() <= Date.now();
}

export function overlaps(first, second) {
  return first.hora_inicio < second.hora_fin && second.hora_inicio < first.hora_fin;
}

export function formatDate(date) {
  const formatter = new Intl.DateTimeFormat('es-GT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return formatter.format(new Date(`${date}T00:00:00Z`));
}
