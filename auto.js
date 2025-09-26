import React, { useEffect } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";

const files = import.meta.glob("/src/pages/**/*.{jsx,tsx}");

const toPath = (p) => {
  let x = p
    .replace(/^\/src\/pages\//, "")
    .replace(/\.(jsx|tsx)$/, "")
    .replace(/\/index$/, "");
  x = x.replace(/\[(\.{3})?([^\]]+)\]/g, (_, dots, name) => (dots ? "*" : `:${name}`));
  return "/" + x;
};

function buildRoutes() {
  const entries = Object.entries(files)
    .filter(([k]) => !k.match(/\/_(404|layout)\.(jsx|tsx)$/)); // exclude speciale
  const layouts = Object.keys(files).filter((k) => /\/_layout\.(jsx|tsx)$/.test(k));
  const NotFound = Object.keys(files).find((k) => /\/_404\.(jsx|tsx)$/.test(k));

  const globalLayout = layouts.find((k) => k === "/src/pages/_layout.jsx" || k === "/src/pages/_layout.tsx");

  const baseChildren = entries.map(([file, loader]) => {
    const path = toPath(file);
    const Cmp = React.lazy(loader);
    return {
      path,
      element: (
        <React.Suspense fallback={null}>
          <PageGuard file={file}>
            <Cmp />
          </PageGuard>
        </React.Suspense>
      ),
    };
  });

  const notFoundEl = NotFound
    ? {
        path: "*",
        element: (
          <React.Suspense fallback={null}>
            {React.createElement(React.lazy(files[NotFound]))}
          </React.Suspense>
        ),
      }
    : { path: "*", element: <div style={{ padding: 24 }}>404 — Not Found</div> };

  if (globalLayout) {
    const Layout = React.lazy(files[globalLayout]);
    return [
      {
        path: "/",
        element: (
          <React.Suspense fallback={null}>
            <Layout />
          </React.Suspense>
        ),
        children: [...baseChildren, notFoundEl],
      },
    ];
  }

  return [...baseChildren, notFoundEl];
}

const modCache = {};
async function getMeta(file) {
  if (!modCache[file]) modCache[file] = files[file]().then((m) => m);
  const m = await modCache[file];
  return {
    access: m.access,
    title: m.title,
    tab: m.tab,
  };
}

const _g = window.__vdp__ ?? (window.__vdp__ = {});
export function global(key, val) {
  if (arguments.length === 1) return _g[key];
  _g[key] = val;
  return val;
}

function PageGuard({ file, children }) {
  useEffect(() => {
    getMeta(file).then((meta) => {
      if (meta?.title) document.title = meta.title;
    });
  }, [file]);

  const [ok, setOk] = React.useState(true);
  useEffect(() => {
    let mounted = true;
    getMeta(file).then((meta) => {
      const pass = typeof meta?.access === "function" ? !!meta.access(global) : true;
      if (mounted) setOk(pass);
    });
    return () => (mounted = false);
  }, [file]);

  if (!ok) return <div style={{ padding: 24 }}>Acces interzis</div>;
  return children;
}

function Routes() {
  const routes = React.useMemo(buildRoutes, []);
  return useRoutes(routes);
}

export function AutoRouter() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}
