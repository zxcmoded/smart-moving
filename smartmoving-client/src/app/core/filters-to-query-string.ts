export function filtersToQueryString(filters: any[]) {
  return filters.map((singleFilter, index) => {
    const querystring = Object.keys(singleFilter).map(key => {
      if (Array.isArray(singleFilter[key])) {
        return singleFilter[key].map((innerValue, innerIndex) =>
              `criteria[${index}].${key}[${innerIndex}]=${encodeURIComponent(innerValue)}`).join('&');
      }
      return `criteria[${index}].${key}=${encodeURIComponent(singleFilter[key])}`;
    }).join('&');
    return querystring;
  }).join('&');
}
