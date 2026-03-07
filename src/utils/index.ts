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

export const ordinal = (n: number): string => {
  const remainder = n % 100;

  if (remainder >= 11 && remainder <= 13) {
    return `${String(n)}th`;
  }

  switch (n % 10) {
    case 1:
      return `${String(n)}st`;
    case 2:
      return `${String(n)}nd`;
    case 3:
      return `${String(n)}rd`;
    default:
      return `${String(n)}th`;
  }
};

export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number);

  return `${MONTHS[month - 1]} ${ordinal(day)}, ${String(year)}`;
};
