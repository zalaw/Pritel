/**
 * Simulates a loading time between a specified minimum and maximum duration. (Default between 1000ms and 3000ms)
 *
 * @param {number} [min=1000] - The minimum duration of the loading time in milliseconds.
 * @param {number} [max=3000] - The maximum duration of the loading time in milliseconds.
 * @returns {Promise<void>} A Promise that resolves after the loading time has elapsed.
 */
export const simulateLoading = (min = 1000, max = 3000): Promise<void> => {
  return new Promise(res => {
    const loadingDuration = Math.random() * (max - min) + min;

    setTimeout(() => {
      res();
    }, loadingDuration);
  });
};
