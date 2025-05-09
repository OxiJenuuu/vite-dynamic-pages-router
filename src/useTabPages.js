export async function getTabPages(pages) {
  const result = [];

  for (const path in pages) {
    const page = pages[path];
    const settings = page.settings || {};

    if (!settings.tab) continue;

    let isAccessible = false;
    try {
      const access = settings.access;
      const result = typeof access === "function" ? access() : access;
      isAccessible = result instanceof Promise ? await result : result;
    } catch {
      isAccessible = false;
    }

    if (isAccessible) {
      result.push({
        key: settings.label || path,
        label: settings.label || path,
        Component: page.default,
      });
    }
  }

  return result;
}
