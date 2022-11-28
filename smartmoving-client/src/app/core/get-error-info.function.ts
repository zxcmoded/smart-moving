// Extracts an error message from a web response
export function getErrorInfo(error, defaultMsg: string = 'An error occurred'): string {
  let errorMessage = '';
  if (error?.error?.message) {
    errorMessage = error.error.message;
  } else if (error?.error?.errors) {
    const errorObj = error.error.errors as object;
    // the errorObj is in fact an obj coming out of aspnet, each prop represents a collection of validation errors
    // the prop = the field, and the value of that prop is the collection of errors
    for (const prop in errorObj) {
      if (errorObj.hasOwnProperty(prop) && errorObj[prop]) {
        (errorObj[prop] as string[]).forEach(x => errorMessage += x + '. ');
      }
    }
  } else {
    errorMessage = defaultMsg;
  }
  return errorMessage;
}
