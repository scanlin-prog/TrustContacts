const months = [
  'Января',
  'Февраля',
  'Марта',
  'Апреля',
  'Мая',
  'Июня',
  'Июля',
  'Августа',
  'Сентября',
  'Октября',
  'Ноября',
  'Декабря',
];

const monthsNominative = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export function getMonthByNumber(month: number) {
  return months[month - 1];
}

export function getMonthNominativeByNumber(month: number) {
  return monthsNominative[month - 1];
}

export function formatUnderstandableDateWithYear(dateObj: Date | string) {
  dateObj = dateByString(dateObj);

  const date = dateObj.getDate();
  const month = dateObj.getMonth();
  const year = dateObj.getFullYear();

  return date + ' ' + months[month] + ' ' + year + 'г';
}

export function dateByString(dateObj: Date | string) {
  return convertTZ(dateObj);
}

export function convertTZ(date: Date | string) {
  return new Date(typeof date === 'string' ? new Date(date) : date);
}
