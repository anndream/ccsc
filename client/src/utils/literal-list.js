/**
 * Returns a concatenated comma-separated string with the specified last separator.
 * @param {string[]} items
 * @param {string} [lastSeparator]
 * @returns {string}
 */
export default (items, lastSeparator = "i") => {
  if (!items) return "";

  const l = items.length;
  if (l <= 2) return items.join(` ${lastSeparator} `);

  items = items.slice();
  items[l - 1] = `${lastSeparator} ${items[l - 1]}`;

  return items.join(", ");
};
