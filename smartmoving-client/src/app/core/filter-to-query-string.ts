export function filterToQueryString(filter: any, skipFalsy = false) {
  return  Object.keys(filter).map(key => {

    if (!filter[key] && skipFalsy) {
      return null;
    }

    if (Array.isArray(filter[key])) {
      return filter[key].map((value, index) => value || !skipFalsy ? `${key}[${index}]=${value}` : null).filter(x => !!x).join('&');
    }

    return `${key}=${filter[key]}`;
  }).filter(x => !!x).join('&');
}
