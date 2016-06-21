export function getLocale() {
  try {
    if (navigator.languages != undefined)
      return navigator.languages[0];
    else
      return navigator.language;
  } catch (e) {
    return 'en-US';
  }
}
