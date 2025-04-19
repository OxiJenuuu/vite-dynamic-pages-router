# vite-dynamic-pages-router

**Automatic and modular page routing for Vite + React.**  
Forget about manual route declarations – just drop `.jsx` files in your `pages/` folder and you're done.

---

## 🚀 Features

- Auto-detects and imports pages from `src/pages/` and its subfolders
- Per-page config via `export const settings = { ... }`
- Dynamic route generation with support for:
  - Access control (`access`)
  - Custom URL paths (`label`)
  - Tab rendering (`tab`)
  - Custom 404 pages (`notFound`)
- Subfolder support (`/admin/dashboard` from `pages/admin/dashboard.jsx`)
- Clean and simple to integrate

---

## 📦 Installation

```bash
npm install vite-dynamic-pages-router
```

---

## 🧱 Folder structure

Example folder structure:

```
src/
├── App.jsx
└── pages/
    ├── Home.jsx
    ├── About.jsx
    ├── NotFound.jsx
    └── admin/
        └── Dashboard.jsx
```

---

## 🔧 Page format

Every page should export a `default` component and a `settings` object.

```jsx
// src/pages/Home.jsx
function Home() {
  return <h1>Welcome to the home page</h1>;
}
export default Home;

export const settings = {
  access: true,
  label: "/",       // optional, will be root path
};
```

---

## 🔁 Usage in App.jsx

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

## ⚙️ Available Settings

Each page can define routing behavior via a `settings` object.

| Setting    | Type    | Required | Description                                                                 |
|------------|---------|----------|-----------------------------------------------------------------------------|
| `access`   | boolean | ✅ Yes    | Enables the route. Must be `true` to make the page accessible.              |
| `label`    | string  | ❌ No     | Sets the URL path. Defaults to the file name. Use `'/'` for homepage.       |
| `tab`      | boolean | ❌ No     | Marks the page as a "tab" for tab rendering (used with `getTabPages`).      |
| `notFound` | boolean | ❌ No     | If true, this page will be used as the fallback for all unmatched routes.   |

---

## ❌ 404 Page Example

```jsx
// src/pages/NotFound.jsx
function NotFound() {
  return <h1>404 - Page not found</h1>;
}
export default NotFound;

export const settings = {
  access: true,
  notFound: true,
};
```

If no `notFound: true` page is found, it will redirect to `/` by default.

---

## 🧪 Tab Pages (Optional)

Use `tab: true` in any page to mark it as part of a "tab system".  
You can fetch all tab pages using the built-in helper:

```js
import { getTabPages } from "vite-dynamic-pages-router";

const pages = import.meta.glob("./pages/**/*.jsx", { eager: true });
const tabPages = getTabPages(pages);

/*
tabPages = [
  {
    key: "label",
    label: "label",
    Component: YourComponent
  },
  ...
]
*/
```

You can use this list to render tabs manually with state or Zustand.

---

## 🧠 Best Practices

- Use `label: "/"` or name a file `index.jsx` for the homepage.
- Avoid using `tab: true` unless you're rendering custom tab components.
- Always include a `404` page using `notFound: true` to improve UX.

---

## 🛠️ Example use case

```jsx
// src/pages/Dashboard.jsx
function Dashboard() {
  return <h1>Dashboard Page</h1>;
}
export default Dashboard;

export const settings = {
  access: true,
  label: "admin/dashboard",
};
```

Will be available at:  
**`/admin/dashboard`**

---

## ❓ FAQ

### Do I need to define routes manually?
No. All routing is generated automatically via `import.meta.glob`.

### Can I use subfolders?
Yes. Nested folder paths will reflect in the route automatically.

### What happens if no `label` is defined?
The route will be based on the file name and folder structure.

### What if no 404 is defined?
The router falls back to `/` with a redirect.

Perfect! Uite `README.md`-ul tău completat cu o secțiune nouă **🧩 Tabs Example** exact după cum ai cerut – clar, scurt și ușor de înțeles pentru oricine vrea să folosească `tab: true` cu logica ta customizată.

---

## 🧩 Tabs Example

You can use pages with `tab: true` to build internal tab-based UIs, without affecting the URL.

### 1. Define tab pages

```jsx
// src/pages/Tab1.jsx
function Tab1() {
  return <h1>Tab 1 content</h1>;
}
export default Tab1;

export const settings = {
  access: true,
  label: "tab1",
  tab: true,
};
```

```jsx
// src/pages/Tab2.jsx
function Tab2() {
  return <h1>Tab 2 content</h1>;
}
export default Tab2;

export const settings = {
  access: true,
  label: "tab2",
  tab: true,
};
```

### 2. Use the tabs in your component

```jsx
import { useState } from "react";
import { getTabPages } from "vite-dynamic-pages-router";

const pages = import.meta.glob("./pages/**/*.jsx", { eager: true });
const tabPages = getTabPages(pages);

function Tabs() {
  const [activeTab, setActiveTab] = useState(tabPages[0]?.label);
  const ActiveComponent = tabPages.find((t) => t.label === activeTab)?.Component;

  return (
    <div>
      <div>
        {tabPages.map(({ label }) => (
          <button key={label} onClick={() => setActiveTab(label)}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        {ActiveComponent ? <ActiveComponent /> : <p>No tab selected</p>}
      </div>
    </div>
  );
}
```

Tabs will render **on the same URL (`/`)**, without query strings or route changes.