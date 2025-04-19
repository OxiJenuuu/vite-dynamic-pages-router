import { Routes, Route, Navigate } from "react-router-dom";

export function PageRouter({ pages }) {
  const routes = [];
  let notFoundElement = null;
  let hasRoot = false;

  for (const path in pages) {
    const page = pages[path];
    const Component = page.default;
    const settings = page.settings || {};

    if (settings?.access !== true) continue;

    const rawPath = path
      .replace("./", "")
      .replace(/\.jsx$/, "")
      .replace(/\/index$/, "");

    const label = settings.label || rawPath;

    // Verificăm dacă e pagina principală
    const isRoot = label === "/" || rawPath === "index";

    const routePath = isRoot || settings.tab ? "/" : `/${label}`;
    if (isRoot) hasRoot = true;

    const element = <Component />;

    if (settings.notFound) {
      notFoundElement = element;
    } else {
      routes.push(<Route path={routePath} element={element} key={routePath} />);
    }
  }

  return (
    <Routes>
      {routes}

      {notFoundElement ? (
        <Route path="*" element={notFoundElement} key="not-found" />
      ) : hasRoot ? (
        <Route path="*" element={<Navigate to="/" />} />
      ) : null}
    </Routes>
  );
}
