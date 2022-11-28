export const delayAsync = (timeInMs: number) => new Promise<void>(resolve => setTimeout(() => resolve(), timeInMs));
