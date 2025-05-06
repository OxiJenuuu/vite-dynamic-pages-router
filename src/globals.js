if (!window.__globals__) {
  window.__globals__ = {};
}

/**
 * Set or get a global value
 * @param {string} key
 * @param {*} value
 */
export function global(key, value) {
  if (typeof key !== "string") {
    throw new Error("Global key must be a string");
  }

  if (arguments.length === 2) {
    if (value === undefined) {
      delete window.__globals__[key];
    } else {
      window.__globals__[key] = value;
    }
  }

  return window.__globals__[key];
}
