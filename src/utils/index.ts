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

const ordinal = (number: number): string => {
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

export const capitalizeWords = (value: string): string => {
  return value.replace(/\b\w/g, char => char.toUpperCase());
};

export const capitalizeFirst = (value: string): string => {
  if (!value) return value;

  return value.charAt(0).toUpperCase() + value.slice(1);
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

export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number);

  return `${MONTHS[month - 1]} ${ordinal(day)}, ${String(year)}`;
};

export const formatCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export const getMetalsCalculations = (gold: number, silver: number, platinum: number) => [
  { name: '6K', value: (gold * 0.87 * 0.25) / 20 },
  { name: '8K', value: (gold * 0.87 * 0.31) / 20 },
  { name: '9K', value: (gold * 0.87 * 0.325) / 20 },
  { name: '10K', value: (gold * 0.87 * 0.396) / 20 },
  { name: '12K', value: (gold * 0.87 * 0.48) / 20 },
  { name: '14K', value: (gold * 0.87 * 0.565) / 20 },
  { name: '16K', value: (gold * 0.87 * 0.642) / 20 },
  { name: '18K', value: (gold * 0.87 * 0.73) / 20 + 0.1 },
  { name: '20K', value: (gold * 0.87 * 0.794) / 20 },
  { name: '21K', value: (gold * 0.87 * 0.854) / 20 },
  { name: '22K', value: (gold * 0.9 * 0.87) / 20 },
  { name: '24K', value: (gold * 0.99 * 0.87) / 20 },
  { name: 'American Coins | 1838 - 1933 (per coin)', value: gold * 0.96 * 0.95 - 50 },
  { name: 'American Coins | 1986 - present', value: gold * 0.99 * 0.95 - 50 },
  { name: 'Sterling', value: silver * 0.8 },
  { name: 'Pure Silver', value: silver * 0.87 },
  { name: 'Coin Silver', value: silver * 0.675 },
  { name: '800 Silver', value: silver * 0.61 },
  { name: 'Silver Dollar', value: silver * 0.77 },
  { name: 'Silver Change ($1 face)', value: silver * 0.717 },
  { name: 'Platinum', value: (platinum * 0.68) / 20 }
];
