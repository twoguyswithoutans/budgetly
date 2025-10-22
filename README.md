# Budgetly — Personal Finance Tracker (Next.js + TypeScript)

[![CI](https://img.shields.io/github/actions/workflow/status/twoguyswithoutans/budgetly/ci.yml?branch=main)](https://github.com/twoguyswithoutans/budgetly/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Deploy](https://img.shields.io/badge/Deployed-Vercel-black)](https://budgetly-ruby.vercel.app/)

Track income & expenses by category and see **live net worth** updates.  
No login required — just open the app, add your data, and start budgeting.

---

## 🚀 Live Demo
**App:** [https://budgetly-ruby.vercel.app/](https://budgetly-ruby.vercel.app/)

---

## ✨ Features
- Five predefined categories: **Bills**, **Debt**, **Expenses**, **Income**, and **Savings**
- Add, edit, or delete items in any category
- Real-time **net worth updates** based on category type (income adds, others subtract)
- Lightweight dashboard showing totals per category
- Responsive layout (Tailwind) and smooth interactions
- Demo app — no login or persistence required

---

## 🧰 Tech Stack
- **App:** Next.js (App Router) · TypeScript · Tailwind
- **Data:** client-side state & mock data (no backend)
- **Quality:** Jest (unit) · Playwright (E2E) · ESLint · Prettier
- **Infra:** GitHub Actions · Vercel/Cloudflare

**Highlights:** SSR/ISR per route · Responsive & accessible UI · Performance tuning


---

## 🗂️ Project Structure
```
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   ├── components
│   ├── lib
│   └── util
├── tailwind.config.ts
└── tsconfig.json
```


---

## ⚡ Quickstart

### Requirements
Node.js 18+ and one of **npm**, **yarn**, **pnpm**, or **bun**

### Setup
```bash
npm install
# or yarn / pnpm / bun install
npm run dev
# or yarn / pnpm / bun dev
```

---

### Build & Start (Production)
npm run build && npm start


### 🧾 Data Model (conceptual)

Although Budgetly runs fully client-side, the logic is modeled after a simple relational structure:

| Table | Description |
|--------|-------------|
| **categories** | Five static types: Bills, Debt, Expenses, Income, Savings |
| **items** | User-added entries linked to categories |
| **net_worth** | Total balance calculated from items |


This mirrors real-world database logic but all data lives client-side for demo purposes.


### ✅ Testing
npm test         # Jest unit tests
npm run e2e      # Playwright end-to-end tests

Tests cover adding, editing, and deleting items and verifying total balance updates.


### 🤖 CI/CD

Every push or pull request runs lint → build → unit → e2e through GitHub Actions.
Badges above reflect build and deploy status.


### 🌐 Deploy

Deployed on Vercel using static export + SSR where needed.



### 🤝 Contributing

This is a personal portfolio demo.
PRs and suggestions are welcome for educational or feedback purposes.


### 📜 License

MIT © Tuguy Çevik