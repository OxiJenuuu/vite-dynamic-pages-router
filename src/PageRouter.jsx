import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

// 🔒 Evaluare acces doar la accesare, nu la mount
function AccessWrapper({ settings, Component, errorRoutes }) {
  let isAccessible = false;

  try {
    const access = settings.access;
    isAccessible = typeof access === "function" ? access() : access === true;
  } catch {
    isAccessible = false;
  }

  if (!isAccessible) {
    return errorRoutes["401"] || <div>Unauthorized</div>;
  }

  return <Component />;
}

export function PageRouter({ pages }) {
  const [routes, setRoutes] = useState([]);
  const [errorRoutes, setErrorRoutes] = useState({});
  const [hasRoot, setHasRoot] = useState(false);

  useEffect(() => {
    const loadRoutes = () => {
      const dynamicRoutes = [];
      const errors = {};
      let rootExists = false;

      for (const path in pages) {
        const page = pages[path];
        const Component = page.default;
        const settings = page.settings || {};

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

        const element =
          settings.errorType
            ? <Component />
            : <AccessWrapper settings={settings} Component={Component} errorRoutes={errors} />;

        if (settings.errorType) {
          errors[settings.errorType] = element;

          dynamicRoutes.push(
            <Route
              path={`/__error/${settings.errorType}`}
              element={element}
              key={`__error-${settings.errorType}`}
            />
          );
        } else {
          if (label === "/" && !settings.errorType) rootExists = true;

          dynamicRoutes.push(
            <Route path={routePath} element={element} key={routePath} />
          );
        }
      }

      setRoutes(dynamicRoutes);
      setErrorRoutes(errors);
      setHasRoot(rootExists);
    };

    loadRoutes();
  }, [pages]);

  return (
    <Routes>
      {routes}

      {/* fallback 404 */}
      {errorRoutes["404"] ? (
        <Route path="*" element={errorRoutes["404"]} />
      ) : hasRoot ? (
        <Route path="*" element={<div>Not found</div>} />
      ) : null}
    </Routes>
  );
}
