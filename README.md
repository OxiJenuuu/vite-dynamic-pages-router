# vite-dynamic-pages-router

**Smart and automatic page-based routing system for React + Vite.**  
Just drop `.jsx` files in your `pages/` folder, export a `settings` object, and you're done.

---

## 🚀 Features

- 🔄 Auto-imports all `.jsx` files inside `/pages/**`
- 🧠 Per-page configuration via `settings`
- 📁 Folder-based routing (with auto prefixing)
- 🧩 Optional tab rendering support
- 🔐 Route-level access control
- ⚠️ Custom error pages (404, 500, 401, etc.) via `errorType`
- 🌍 Global variable storage across all components (`globals`)
- 🧼 No need for manual `react-router` routes

---

## 📦 Installation

```bash
npm install vite-dynamic-pages-router
```

---

## 🧱 File Structure Example

```
src/
├── App.jsx
├── pages/
│   ├── index.jsx             # Homepage
│   ├── about.jsx             # /about
│   ├── auth/
│   │   └── login.jsx         # /auth/login
│   └── errors/
│       ├── Error404.jsx      # 404 page
│       ├── Error500.jsx      # 500 page
└── ...
```

---

## 🧩 Page Format

Each page must export a default component and a `settings` object.

```jsx
function Home() {
  return <h1>Home Page</h1>;
}
export default Home;

export const settings = {
  access: true,
  label: "/",      // Optional: default is filename
};
```

---

## ⚙️ Available `settings`

| Setting      | Type    | Required | Description                                                                 |
|--------------|---------|----------|-----------------------------------------------------------------------------|
| `access`     | boolean | ✅ Yes    | Makes the page routable                                                     |
| `label`      | string  | ❌ No     | URL path segment (defaults to file name)                                   |
| `tab`        | boolean | ❌ No     | Marks the page as a tab (used with `getTabPages()`)                        |
| `errorType`  | string  | ❌ No     | `"404"`, `"500"`, `"401"` — used to define custom error pages              |

---

## 🧪 Usage in App.jsx

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

To define a custom 404, 500, or 401 page, just add:

```jsx
// src/pages/errors/Error404.jsx
function Error404() {
  return <h1>404 - Page Not Found</h1>;
}
export default Error404;

export const settings = {
  access: true,
  errorType: "404",
};
```

You can now also navigate programmatically to:

```jsx
navigate("/__error/500");
navigate("/__error/401");
```

---

## 🧠 Global Variables (`globals`)

Define global state/instances/objects once and access anywhere.

### ✅ Setup in App.jsx:

```jsx
import { PageGlobalsProvider } from "vite-dynamic-pages-router";

<PageGlobalsProvider>
  <PageRouter pages={pages} />
</PageGlobalsProvider>
```

### ✅ In any component:

```jsx
import { useGlobals } from "vite-dynamic-pages-router";

// Set a global variable
const { setGlobal } = useGlobals();
setGlobal("user", new User(...));

// Get a global variable
const { globals } = useGlobals();
console.log(globals.user?.id);
```

---

## 🧩 Tabs (Optional)

Mark pages with `tab: true` and use them as internal tab components.

```jsx
export const settings = {
  access: true,
  label: "dashboard",
  tab: true,
};
```

Get tab pages:

```jsx
import { getTabPages } from "vite-dynamic-pages-router";

const tabPages = getTabPages(pages);
// → [{ label, key, Component }]
```

---

## 🛠️ Best Practices

- Use `index.jsx` or `label: "/"` for homepage
- Always set `access: true` for routable pages
- Use `errorType` for consistent error handling
- Keep `globals` clean and structured

---

Made with 💙 by [OxiJenuuu](https://github.com/OxiJenuuu)