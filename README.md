# vite-dynamic-pages-router

**Automatic and flexible file-based routing system for Vite + React.**  
Just drop `.jsx` files inside `pages/` and export a `settings` object — no manual route declarations needed.

---

## 🚀 Features

- 🔄 Auto-imports `.jsx` files from `/pages/**`
- 🧠 Configurable routing with `settings` per page
- 🗂️ Nested file/folder structure maps directly to routes
- 🔐 Route-level access control (supports sync and async functions)
- ⚠️ Custom error pages (404, 500, 401) via `errorType`
- 🧩 Optional tab rendering support
- 🌍 Global variable system usable **anywhere**: React or plain JS
- 🧼 Clean, minimal setup — zero boilerplate
- 🪄 Also available as shortcut: `npm i vdp-router`

---

## 📦 Installation

```bash
npm install vite-dynamic-pages-router
````

or using the shortcut:

```bash
npm install vdp-router
```

---

## 📁 File Structure Example

```
src/
├── App.jsx
├── pages/
│   ├── index.jsx             # Homepage
│   ├── about.jsx             # /about
│   ├── admin/
│   │   └── panel.jsx         # /admin/panel
│   └── errors/
│       ├── Error404.jsx      # 404
│       ├── Error401.jsx      # 401
│       └── Error500.jsx      # 500
```

---

## 🧩 Page Format

Each page exports:

* a **default** React component
* a `settings` object for routing config

```jsx
function Home() {
  return <h1>Welcome Home</h1>;
}
export default Home;

export const settings = {
  access: true,
  label: "/", // optional
};
```

---

## ⚙️ Settings Reference

| Setting     | Type                   | Required | Description                                                              |
| ----------- | ---------------------- | -------- | ------------------------------------------------------------------------ |
| `access`    | `boolean` / `function` | ✅ Yes    | Enables route. Supports logic and async (e.g. `access: async () => {}`). |
| `label`     | string                 | ❌ No     | Route path. Defaults to filename. Use `'/'` for homepage.                |
| `tab`       | boolean                | ❌ No     | Mark page as part of a tab layout.                                       |
| `errorType` | `"404"`, `"401"`, etc. | ❌ No     | Defines the page as fallback for that error type.                        |

---

## 🧪 Basic Usage in App.jsx

```jsx
import { PageRouter } from "vite-dynamic-pages-router";
import { BrowserRouter } from "react-router-dom";

const pages = import.meta.glob("./pages/**/*.jsx", { eager: true });

function App() {
  return (
    <BrowserRouter>
      <PageRouter pages={pages} />
    </BrowserRouter>
  );
}

export default App;
```

---

## ⚠️ Error Pages

Define a 404 page like this:

```jsx
function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}
export default NotFound;

export const settings = {
  access: true,
  errorType: "404",
};
```

This will automatically be used for any unknown route and available at `/__error/404`.

---

## 🌍 Global Variables – One Function to Rule Them All

You can set global values **once**, and reuse them **anywhere** — even in access functions.

### ✅ In React:

```jsx
import { global } from "vite-dynamic-pages-router";

function Home() {
  useEffect(() => {
    global("user", { id: 1, role: "admin" });
  }, []);
}
```

### ✅ In another component:

```jsx
import { global } from "vite-dynamic-pages-router";

function Admin() {
  const user = global("user");
  return <h1>Welcome, {user?.username}</h1>;
}
```

### ✅ In access logic:

```js
export const settings = {
  access: () => global("user")?.role === "admin",
  label: "admin/panel",
};
```

### ✅ From anywhere (non-React):

```js
import { global } from "vite-dynamic-pages-router";

const token = global("authToken");
```

No need for context, useState, Zustand, or Providers.
The `global()` function uses `window.__globals__` internally, so data persists and is available everywhere — as long as it was set.

---

## 🔐 Async Access Example

```js
export const settings = {
  access: async () => {
    await new Promise((res) => setTimeout(res, 100));
    return global("user")?.role === "admin";
  },
  label: "admin/panel",
};
```

---

## 🧩 Tabs (Optional)

To use tabs, mark your page with `tab: true`:

```jsx
export const settings = {
  access: true,
  label: "dashboard",
  tab: true,
};
```

Then fetch all tab pages:

```js
import { getTabPages } from "vite-dynamic-pages-router";

const tabs = getTabPages(pages);
// → [{ key, label, Component }]
```

---

## 🛠️ Best Practices

* Use `label: "/"` or `index.jsx` for homepage
* Place error pages in `pages/errors/`
* Set `global("user", {...})` as early as possible
* Protect routes with `access: () => global("user")?.role === "admin"`

---

Made with 💙 by [OxiJenuuu](https://github.com/OxiJenuuu)
