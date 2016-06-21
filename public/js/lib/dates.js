import 'datejs';
import moment from 'moment';

export function dateFormatFull(date, locale = 'en-US') {
  return moment(date).locale(locale).format('llll').toString();
}

export function dateFormatShort(date, locale = 'en-US') {
  return moment(date).locale(locale).format('LLL').toString();
}

export function isDateBefore(date, before) {
  return moment(date).isBefore(before);
}

export function isDateAfter(date, after) {
  return moment(date).isAfter(after);
}

export function dateParse(text) {
  return Date.parse(text);
}
