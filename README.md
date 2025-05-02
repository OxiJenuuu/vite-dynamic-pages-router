````markdown
# vite-dynamic-pages-router

**Smart and automatic page-based routing system for React + Vite.**  
Just drop `.jsx` files in your `pages/` folder, export a `settings` object, and you're done.

---

## 🚀 Features

- 🔄 Auto-imports all `.jsx` files inside `/pages/**`
- 🧠 Per-page configuration via `settings`
- 📁 Folder-based routing with auto prefixing
- 🧩 Optional tab rendering support
- 🔐 Route-level access control (supports async functions)
- ⚠️ Custom error pages (404, 500, 401, etc.) via `errorType`
- 🌍 Global variable storage accessible in both React and non-React code
- 🧼 No need for manual `react-router` route setup
- 🔁 Shortcut available: `npm i vdp-router` (alias package)

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

## 🧱 File Structure Example

```
src/
├── App.jsx
├── pages/
│   ├── index.jsx             # Homepage
│   ├── about.jsx             # /about
│   ├── admin/
│   │   └── panel.jsx         # /admin/panel
│   └── errors/
│       ├── Error404.jsx      # 404 page
│       ├── Error401.jsx      # 401 page
│       └── Error500.jsx      # 500 page
└── ...
```

---

## 🧩 Page Format

Each page must export a default component and a `settings` object:

```jsx
function Home() {
  return <h1>Home Page</h1>;
}
export default Home;

export const settings = {
  access: true,
  label: "/", // optional
};
```

---

## ⚙️ Settings Reference

| Setting     | Type                    | Required | Description                                                           |
| ----------- | ----------------------- | -------- | --------------------------------------------------------------------- |
| `access`    | `boolean` \| `function` | ✅ Yes    | Enables the route. Supports async functions and global checks.        |
| `label`     | string                  | ❌ No     | URL path. Defaults to the file name. Use `'/'` for homepage.          |
| `tab`       | boolean                 | ❌ No     | Marks the page as a "tab" for tab rendering                           |
| `errorType` | string                  | ❌ No     | One of `"404"`, `"500"`, `"401"` — used to define custom error pages. |

---

## 🧪 Usage in App.jsx

```jsx
import { PageRouter, PageGlobalsProvider } from "vite-dynamic-pages-router";
import { BrowserRouter } from "react-router-dom";

const pages = import.meta.glob("./pages/**/*.jsx", { eager: true });

function App() {
  return (
    <BrowserRouter>
      <PageGlobalsProvider>
        <PageRouter pages={pages} />
      </PageGlobalsProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

## ⚠️ Error Pages

Example 404 page:

```jsx
function Error404() {
  return <h1>404 - Not Found</h1>;
}
export default Error404;

export const settings = {
  access: true,
  errorType: "404",
};
```

Pages with `errorType` are auto-routed as `/__error/404`, `/__error/401`, etc.
They also work as automatic fallbacks when needed.

---

## 🌍 Global Variables

You can set globals once and use them across all pages and logic.

### ✅ In React:

```jsx
import { useGlobals } from "vite-dynamic-pages-router";

const { setGlobal } = useGlobals();
setGlobal("user", { id: 1, role: "admin" });

const { globals } = useGlobals();
console.log(globals.user?.id);
```

### ✅ Outside React (JS files):

```js
import { globalsStore } from "vite-dynamic-pages-router";

const user = globalsStore.get("user");
console.log(user?.role);
```

### ✅ Or use globalThis directly:

```js
globalThis.user = { id: 1, username: "oxijenuuu" };
console.log(user.username);
```

---

## 🔐 Access with async logic

You can protect a page dynamically using async checks:

```jsx
export const settings = {
  access: async () => {
    await new Promise((res) => setTimeout(res, 100));
    return user?.role === "admin";
  },
  label: "admin/panel",
};
```

---

## 🧩 Tabs Support (Optional)

```jsx
export const settings = {
  access: true,
  label: "dashboard",
  tab: true,
};
```

Fetch all tabs:

```js
import { getTabPages } from "vite-dynamic-pages-router";

const tabPages = getTabPages(pages);
// → [{ label, key, Component }]
```

---

## 🛠️ Best Practices

* Use `label: "/"` or `index.jsx` for homepage
* Use `errorType` pages for better UX (404, 401, 500)
* Set globals early using `globalThis` or `setGlobal()`
* Use `async access` to protect sensitive routes

---

Made with 💙 by [OxiJenuuu](https://github.com/OxiJenuuu)