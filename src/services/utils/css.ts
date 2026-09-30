import classNames from 'classnames';

// Enhanced classNames wrapper.
// Normalizes whitespace and allows for future extensions.
export const cx = (...args: Parameters<typeof classNames>): string =>
  classNames(...args)
    .replace(/\s+/g, ' ') // collapse all whitespace
    .trim(); // remove leading/trailing space
