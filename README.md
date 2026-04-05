# Zafire Smart Search

A reusable Smart Search Web Component built for banking applications.
Designed to work across any framework — React, Angular, Vue, or plain HTML.

---

## Overview

`smart-search` is a Web Component that provides a consistent search
experience across different banking contexts — accounts, customers,
transactions, or any other entity type.

The consuming application is responsible for
fetching results and mapping them into the component's normalised
`SearchResult` interface. This is the **Adapter Pattern** — the component
stays clean and reusable while the consumer owns the domain logic.

---

## Features

- Search input with debouncing and clear button
- Configurable filter tabs
- Full keyboard navigation (Arrow keys, Enter, Escape)
- Search term highlighting in results
- Light and dark theme support via CSS custom properties
- Mobile responsive

---

## Installation
```bash
npm install zafire-smart-search
```

Register the component once in your app entry point:
```js
import { defineCustomElements } from 'zafire-smart-search/loader'
defineCustomElements()
```

---

## Usage

### Plain HTML
```html
<smart-search
  id="search"
  placeholder="Search banking entities..."
  theme="light"
  debounce-ms="300"
  max-results="8"
></smart-search>

<script type="module">
  import { defineCustomElements } from '/loader/index.es2017.js'
  defineCustomElements()

  const search = document.getElementById('search')

  // Set complex props as JS properties — not HTML attributes
  search.filters = [
    { id: 'account', label: 'Accounts', value: 'account' },
    { id: 'customer', label: 'Customers', value: 'customer' },
  ]

  // Listen for events
  search.addEventListener('searchChange', (e) => {
    const { query, filter } = e.detail
    // fetch your data, map it, pass back
    search.results = fetchAndMap(query, filter)
  })

  search.addEventListener('searchSelect', (e) => {
    console.log('Selected:', e.detail.result)
  })
</script>
```

### React
```tsx
import { useRef, useEffect } from 'react'
import { defineCustomElements } from 'zafire-smart-search/loader'

defineCustomElements()

function App() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.filters = [
      { id: 'account', label: 'Accounts', value: 'account' },
      { id: 'customer', label: 'Customers', value: 'customer' },
    ]

    el.addEventListener('searchChange', (e) => {
      el.results = fetchAndMap(e.detail.query, e.detail.filter)
    })
  }, [])

  return (
    <smart-search
      ref={ref}
      placeholder="Search..."
      theme="light"
    />
  )
}
```

> **Note:** In React, pass arrays and objects as JavaScript properties
> via `ref` — not as JSX attributes. React serialises JSX attributes
> to strings, which breaks array and object props.

---

## Data Structure

The component uses a normalised `SearchResult` interface designed to
represent any banking entity:
```ts
interface SearchResult {
  id: string           // unique identifier
  type: string         // entity type — 'account' | 'customer' | 'transaction' | any
  title: string        // main display text — always required
  subtitle?: string    // secondary line — optional
  badge?: string       // status label — optional
  metadata?: Record<string, string>  // any extra fields — optional
}
```

### Adapter Pattern

Your raw domain data will have different shapes. Map it to `SearchResult`
before passing to the component:
```js
// Raw account data from your API
const rawAccount = {
  accountNo: 'ACC-001',
  holderName: 'John Tan',
  status: 'Active',
}

// Map to SearchResult
const mapped = {
  id: rawAccount.accountNo,
  type: 'account',
  title: rawAccount.holderName,
  subtitle: rawAccount.accountNo,
  badge: rawAccount.status,
}

search.results = [mapped]
```

The component never touches your raw data — it only renders `SearchResult`.

---

## API

### Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `string` | `'Search...'` | Input placeholder text |
| `filters` | `FilterOption[]` | `[]` | Filter tab options |
| `results` | `SearchResult[]` | `[]` | Search results to display |
| `theme` | `'light' \| 'dark'` | `'light'` | Component theme |
| `debounce-ms` | `number` | `300` | Debounce delay in milliseconds |
| `max-results` | `number` | `10` | Maximum results to display |

### Events

| Event | Detail | Description |
|---|---|---|
| `searchChange` | `{ query: string, filter: string \| null }` | Fires when user types (debounced) |
| `searchSelect` | `{ result: SearchResult }` | Fires when user selects a result |
| `searchFilter` | `{ filter: FilterOption \| null }` | Fires when filter tab changes |
| `searchClear` | `void` | Fires when input is cleared |

### Filter Option
```ts
interface FilterOption {
  id: string      // unique key
  label: string   // display text shown on tab
  value: string   // value emitted in events
}
```

---

## Theming

The component uses CSS custom properties for theming.
Set these on `smart-search` to customise appearance:
```css
smart-search {
  --search-bg: #ffffff;
  --search-border: #e0e0e0;
  --search-text: #333333;
  --search-placeholder: #aaaaaa;
  --search-icon-color: #999999;
  --search-highlight: #1677ff;
  --search-item-hover: #f5f5f5;
  --search-dropdown-bg: #ffffff;
}
```

Or use the built-in dark theme:
```html
<smart-search theme="dark"></smart-search>
```

---

## Development

### Setup
```bash
git clone https://github.com/ranidu/zafire-smart-search.git
cd zafire-smart-search
npm install
```

### Commands
```bash
# Start dev server with hot reload
npm start

# Production build
npm run build

# Run unit tests
npm run test.unit

# Run unit tests in watch mode
npm run test.watch

# Run browser component tests
npm run test.browser

# Run all tests
npm test

# Scaffold a new component
npm run generate
```

### Project Structure
```
zafire-smart-search/
├── src/
│   ├── components/
│   │   ├── smart-search/       # Parent component — owns all state
│   │   ├── search-input/       # Text input + clear button
│   │   ├── search-dropdown/    # Results list + keyboard nav + positioning
│   │   └── search-filter/      # Filter tabs
│   ├── utils/
│   │   ├── highlight.ts        # Search term highlighting
│   │   └── debounce.ts         # Debounce utility
│   ├── types/
│   │   └── search.types.ts     # All TypeScript interfaces
│   └── index.ts                # Root barrel export
├── demo/
│   ├── index.html              # Demo page
│   ├── demo.css                # Demo page styles
│   └── demo.js                 # Demo wiring + mock data
└── www/                        # Build output (generated)
```

---

## Architecture Decisions

**Why Web Components?**
Framework-agnostic by design. Web Components work everywhere with no
framework dependency.

**Why Shadow DOM?**
Complete style isolation. The component's styles cannot leak out and
affect the host page, and the host page's styles cannot accidentally
break the component. This satisfies the assignment's style isolation
requirement without any extra work.

**Why the Adapter Pattern?**
Making the component accept a normalised `SearchResult` interface means it can be
used across any entity type — accounts, customers, transactions — without
any component changes. The consumer owns the mapping logic.

**Why Floating UI for positioning?**
Reliable dropdown positioning is harder than it looks. Floating UI handles
viewport clipping, scroll repositioning, and flip behaviour
(dropdown appears above when there's no space below) — all edge cases
that would take significant effort to implement correctly from scratch.
The assignment explicitly allows third-party libraries for positioning.

**Why Stencil.js?**
Closest to native Web Component standards while providing a familiar
JSX/TypeScript developer experience. Generates optimised, standards-
compliant custom elements with no runtime dependency.

---