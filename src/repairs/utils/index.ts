const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const ordinal = (number: number): string => {
  const remainder = number % 100;

  if (remainder >= 11 && remainder <= 13) {
    return `${String(number)}th`;
  }

  switch (number % 10) {
    case 1:
      return `${String(number)}st`;
    case 2:
      return `${String(number)}nd`;
    case 3:
      return `${String(number)}rd`;
    default:
      return `${String(number)}th`;
  }
};

export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number);

  return `${MONTHS[month - 1]} ${ordinal(day)}, ${String(year)}`;
};

export const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 10);

  if (digits.length === 0) {
    return '';
  }

  if (digits.length <= 3) {
    return `(${digits}`;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};
