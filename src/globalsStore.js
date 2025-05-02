const _globals = {};

export const globalsStore = {
  get: (key) => _globals[key],
  set: (key, value) => {
    _globals[key] = value;
    globalThis[key] = value;
  },
  all: () => ({ ..._globals }),
  clear: () => {
    for (const key in _globals) {
      delete _globals[key];
      delete globalThis[key];
    }
  },
};
