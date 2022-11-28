export const spliceOutOfArray = <T>(array: T[], target: T) => {

  const index = array.indexOf(target);

  if (index >= 0) {
    array.splice(index, 1);
  }
};
