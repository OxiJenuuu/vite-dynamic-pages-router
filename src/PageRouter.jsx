import { Routes, Route, Navigate } from "react-router-dom";

export function PageRouter({ pages }) {
  const routes = [];
  const errorRoutes = {};
  let hasRoot = false;

  for (const path in pages) {
    const page = pages[path];
    const Component = page.default;
    const settings = page.settings || {};

    if (settings?.access !== true) continue;

    const rawPath = path
      .replace("./", "")
      .replace(/\.jsx$/, "")
      .replace(/^pages\//, "")
      .replace(/\/index$/, "");

    const folderPath = rawPath.split("/").slice(0, -1).join("/");
    const fileName = rawPath.split("/").pop();

    const label = settings.label || fileName;

    const routePath =
      label === "/" || rawPath === "index"
        ? "/"
        : `/${[folderPath, label].filter(Boolean).join("/")}`;

    const element = <Component />;

    if (settings.errorType) {
      errorRoutes[settings.errorType] = element;
      routes.push(
        <Route
          path={`/__error/${settings.errorType}`}
          element={element}
          key={`__error-${settings.errorType}`}
        />
      );
    } else {
      if (label === "/" && !settings.errorType) hasRoot = true;
      routes.push(<Route path={routePath} element={element} key={routePath} />);
    }
  }

  return (
    <Routes>
      {routes}
      {errorRoutes["404"] ? (
        <Route path="*" element={errorRoutes["404"]} />
      ) : hasRoot ? (
        <Route path="*" element={<Navigate to="/" />} />
      ) : null}
    </Routes>
  );
}
