export function getInitials(name: string) {
  if (!name) {
    return '';
  }

  if (typeof name !== 'string') {
    return '';
  }

  return name.split(' ')
    .map(x => x.length ? x[0] : '')
    .filter(x => !!x)
    .join('');
}
