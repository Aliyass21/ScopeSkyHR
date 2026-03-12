# CoreHR — Claude Code Project Guide

## Project Overview
CoreHR is a **frontend-only HR system demo** built to showcase capabilities to a client.
It uses a **mockup API** (local JSON / in-memory data) — there is NO real backend.
The goal is a polished, functional-looking HR product the client can navigate and evaluate.

## Stack
- **React + TypeScript** (Vite)
- **Tailwind CSS** (utility-first styling)
- **shadcn/ui** (2026 components — use the latest API)
- **react-router-dom** (routing)
- **i18next + react-i18next** (Arabic primary / English secondary)
- **face-api.js or similar** (face recognition mockup — client-side only)
- **Zustand** (lightweight global state)
- **date-fns** (date utilities)

## Languages
- **Arabic (ar) is the primary language** — RTL layout mandatory
- English (en) is fully supported via language toggle
- All UI text must use i18n keys — never hardcode strings
- RTL/LTR is driven by `dir` attribute on `<html>` element
- Use `font-family: 'Cairo', sans-serif` for Arabic; `'Inter'` for English

## Design System
See `DESIGN.md` for full details. Short version:
- Formal yet vibrant — think ClickUp's energy applied to enterprise HR
- Primary brand: deep indigo `#4F46E5` with teal accent `#0EA5E9`
- shadcn/ui theming via CSS variables in `globals.css`
- Sidebar navigation (collapsible), top header with user avatar + lang toggle
- Cards, data tables, stat widgets as core layout primitives

## Mockup API
See `MOCKUP_API.md` for full details. Short version:
- All data lives in `src/data/*.json` files
- API layer in `src/api/*.ts` — async functions with artificial 300–600 ms delay
- Simulates loading/error states
- Face recognition: compare uploaded photo base64 against stored employee pfp hash (mock match logic)

## Modules
1. **Dashboard** — KPI widgets, recent activity, headcount chart
2. **Employees** — list, profile, create/edit (with face photo upload)
3. **Attendance** — clock-in/out, face recognition check-in, monthly grid
4. **Leave Management** — request, approve, balance tracker
5. **Payroll** — salary slips, mock payroll run
6. **Recruitment** — job postings, applicant pipeline (Kanban)
7. **Org Chart** — interactive tree view
8. **Settings** — company profile, users & roles, language

## Face Recognition (Mockup)
- Each employee has a `faceDescriptor` field (mock float array stored in JSON)
- On attendance check-in: webcam snapshot → mock descriptor comparison → match/no-match
- Use `face-api.js` with a lightweight model loaded from `/public/models/`
- If no camera available, fall back to graceful "Camera unavailable" UI

## Key Conventions
- **No backend calls** — all imports from `src/api/` which read local JSON
- Components in `src/components/<module>/`
- Shared UI atoms in `src/components/ui/` (shadcn-generated)
- Types in `src/types/`
- i18n files in `src/locales/ar.json` and `src/locales/en.json`
- Always use `useTranslation()` hook for text
- Prefer `React.FC` with explicit prop types

## Commands
```bash
npm install          # install deps
npm run dev          # start dev server
npm run build        # production build
npm run lint         # eslint check
```

## File Structure (abbreviated)
```
src/
  api/           # mockup API functions
  components/
    ui/          # shadcn primitives
    layout/      # Sidebar, Header, PageWrapper
    dashboard/
    employees/
    attendance/
    leave/
    payroll/
    recruitment/
    orgchart/
    settings/
  data/          # JSON mock data files
  hooks/         # custom hooks
  i18n/          # i18next setup
  locales/       # ar.json, en.json
  pages/         # route-level page components
  store/         # zustand stores
  types/         # TypeScript interfaces
  utils/         # helpers
```