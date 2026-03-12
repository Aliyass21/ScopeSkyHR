# CoreHR Design System — SKILL.md

## Aesthetic Direction
**Formal-Vibrant Enterprise** — the energy of ClickUp's colorful productivity tool applied
to the structure of an enterprise HR product. Clean information hierarchy, generous whitespace,
and purposeful color accents that make the product feel alive without being unprofessional.

Think: sidebar in deep indigo, content in near-white, accents in teal, status in amber/green/red.
Arabic calligraphic friendliness — rounded, readable, dignified.

---

## Color Palette (CSS Variables in `globals.css`)

```css
:root {
  /* Brand */
  --brand-primary:    #4F46E5;   /* indigo-600 — sidebar, primary buttons */
  --brand-secondary:  #0EA5E9;   /* sky-500 — accents, links, highlights */
  --brand-soft:       #EEF2FF;   /* indigo-50 — sidebar hover, selected bg */

  /* Surface */
  --surface-base:     #F8FAFC;   /* slate-50 — page background */
  --surface-card:     #FFFFFF;   /* card / panel background */
  --surface-border:   #E2E8F0;   /* slate-200 — dividers, table borders */
  --surface-muted:    #F1F5F9;   /* slate-100 — muted inputs, disabled */

  /* Text */
  --text-primary:     #0F172A;   /* slate-900 */
  --text-secondary:   #475569;   /* slate-600 */
  --text-muted:       #94A3B8;   /* slate-400 */
  --text-inverse:     #FFFFFF;

  /* Semantic */
  --success:          #10B981;   /* emerald-500 */
  --warning:          #F59E0B;   /* amber-500 */
  --danger:           #EF4444;   /* red-500 */
  --info:             #3B82F6;   /* blue-500 */

  /* Sidebar */
  --sidebar-bg:       #312E81;   /* indigo-900 */
  --sidebar-text:     #C7D2FE;   /* indigo-200 */
  --sidebar-active:   #4F46E5;   /* indigo-600 */
  --sidebar-hover:    #3730A3;   /* indigo-800 */
}
```

---

## Typography

| Context        | Arabic Font  | English Font | Size  | Weight |
|----------------|-------------|--------------|-------|--------|
| Page title     | Cairo        | Plus Jakarta Sans | 1.5rem | 700 |
| Section header | Cairo        | Plus Jakarta Sans | 1.1rem | 600 |
| Body           | Cairo        | Plus Jakarta Sans | 0.875rem | 400 |
| Caption/label  | Cairo        | Plus Jakarta Sans | 0.75rem | 500 |
| Stat number    | Cairo        | Syne           | 2rem  | 800 |

Import in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@800&display=swap" rel="stylesheet">
```

---

## Layout

### Shell
```
┌─────────────────────────────────────────────────┐
│  HEADER  (h-16, full width, white, border-b)    │
├────────────┬────────────────────────────────────┤
│            │                                    │
│  SIDEBAR   │         MAIN CONTENT               │
│  (w-64)    │         (flex-1, overflow-y-auto)  │
│            │                                    │
│            │                                    │
└────────────┴────────────────────────────────────┘
```

- Sidebar collapses to icon-only (`w-16`) on toggle
- In RTL: sidebar is on the RIGHT
- Header: logo (left/right per dir), search center, avatar + lang toggle (opposite side)
- Main content has `max-w-7xl mx-auto px-6 py-6`

### Page Template
```tsx
<PageWrapper title="..." breadcrumbs={[...]} action={<Button>...</Button>}>
  {/* page content */}
</PageWrapper>
```

---

## Component Specs

### Stat Card
```
┌──────────────────────────────────┐
│  Icon bg  │  Label               │
│  (40x40)  │  Big Number          │
│  colored  │  ↑ +12% vs last month│
└──────────────────────────────────┘
```
- Icon background: 10% opacity of semantic color, icon at full color
- Number: `font-syne text-3xl font-extrabold`
- Trend: green/red with arrow icon

### Data Table
- shadcn `<DataTable>` with `@tanstack/react-table`
- Sticky header
- Row hover: `bg-indigo-50/40`
- Pagination at bottom
- Column sort indicators
- Search input above table (right-aligned in LTR, left-aligned in RTL)
- Action column: ellipsis menu via shadcn `<DropdownMenu>`

### Status Badge
```tsx
// Variants: active | inactive | pending | approved | rejected | onleave
<Badge variant="success">نشط</Badge>
```
Colors map: active→emerald, inactive→slate, pending→amber, approved→emerald, rejected→red, onleave→sky

### Avatar
- Circular, 40px default
- Shows employee face photo if available
- Falls back to initials on colored background
- Ring on currently-authenticated user

### Sidebar Nav Item
```
┌────────────────────────────────────────┐
│  [Icon]  Label                    [Badge]│
└────────────────────────────────────────┘
```
- Active state: `bg-sidebar-active text-white rounded-lg`
- Hover: `bg-sidebar-hover`
- Section labels: uppercase, 0.65rem, `text-indigo-300` separator

---

## Spacing Scale
Follow Tailwind's default 4px base grid.
- Page padding: `px-6 py-6`
- Card padding: `p-6`
- Section gap: `gap-6`
- Form field gap: `gap-4`
- Inline gap: `gap-2`

---

## Animation
- Page transitions: fade-in + slight translateY (20px → 0) over 200ms
- Skeleton loaders: `animate-pulse` in slate-200
- Modal/Sheet: shadcn built-in transitions (keep them)
- Stat number counter: count-up animation on mount (use `react-countup`)
- Face recognition scan line: CSS animation on verification screen

---

## RTL-Specific Rules
1. `dir="rtl"` on `<html>` — Tailwind handles most logical properties automatically
2. Use `ms-` / `me-` (margin-start/end) instead of `ml-` / `mr-`
3. Flex rows naturally reverse in RTL with `flex-row-reverse` only if needed
4. Icons that imply direction (arrows, chevrons): wrap in `<span className="rtl:rotate-180 inline-block">`
5. Number formatting: use `toLocaleString('ar-SA')` for Arabic numerals if desired, or keep Western digits (client preference — default Western)
6. Tables: column order stays logical (name first), direction flips naturally

---

## Empty States
Every list/table needs an empty state:
```
     [Ghost icon, 64px, text-slate-300]
     لا يوجد موظفون بعد
     No employees yet

     [Add Employee Button]
```

## Error States
Network/mock errors:
```
     [AlertCircle icon, red]
     حدث خطأ في تحميل البيانات
     [Retry Button]
```