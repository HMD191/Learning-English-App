export function capitalizeFirstLetter(str: string): string {
  str = str.trim();

  if (!str) return '';

  return str.charAt(0).toUpperCase() + str.slice(1);
}
