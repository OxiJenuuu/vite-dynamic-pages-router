import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

export function PageRouter({ pages }) {
  const [routes, setRoutes] = useState([]);
  const [errorRoutes, setErrorRoutes] = useState({});
  const [hasRoot, setHasRoot] = useState(false);

  useEffect(() => {
    const loadRoutes = async () => {
      const dynamicRoutes = [];
      const errors = {};
      let rootExists = false;

      // 1. Error pages
      for (const path in pages) {
        const page = pages[path];
        const Component = page.default;
        const settings = page.settings || {};

        if (settings.errorType) {
          const rawPath = path
            .replace("./", "")
            .replace(/\.jsx$/, "")
            .replace(/^pages\//, "")
            .replace(/\/index$/, "");

          const element = <Component />;
          errors[settings.errorType] = element;

          dynamicRoutes.push(
            <Route
              path={`/__error/${settings.errorType}`}
              element={element}
              key={`__error-${settings.errorType}`}
            />
          );
        }
      }

      // 2. Normal pages
      for (const path in pages) {
        const page = pages[path];
        const Component = page.default;
        const settings = page.settings || {};

        if (settings.errorType) continue;

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

        let isAccessible = false;
        if (typeof settings.access === "function") {
          try {
            isAccessible = await settings.access();
          } catch {
            isAccessible = false;
          }
        } else {
          isAccessible = settings.access === true;
        }

        if (label === "/" && !settings.errorType) rootExists = true;

        const element = isAccessible
          ? <Component />
          : errors["401"]
            ? errors["401"]
            : <div>Unauthorized</div>;

        dynamicRoutes.push(
          <Route path={routePath} element={element} key={routePath} />
        );
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
      {errorRoutes["404"] ? (
        <Route path="*" element={errorRoutes["404"]} />
      ) : hasRoot ? (
        <Route path="*" element={<div>Not found</div>} />
      ) : null}
    </Routes>
  );
}
