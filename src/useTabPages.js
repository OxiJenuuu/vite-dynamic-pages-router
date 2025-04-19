// src/useTabPages.js
export function getTabPages(pages) {
    const result = [];
  
    for (const path in pages) {
      const page = pages[path];
      const settings = page.settings || {};
  
      if (settings?.access === true && settings?.tab === true) {
        const Component = page.default;
  
        result.push({
          key: settings.label || path,
          label: settings.label || path,
          Component,
        });
      }
    }
  
    return result;
  }
  