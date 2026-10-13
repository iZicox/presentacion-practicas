crm-internal/
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── CompaniesPage.tsx
│   │   │   ├── CompanyDetailPage.tsx
│   │   │   ├── ContactsPage.tsx
│   │   │   ├── InteractionsPage.tsx
│   │   │   ├── PurchasesPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── styles/
│   │   │   └── global.css
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── companies.ts
│   │   │   ├── contacts.ts
│   │   │   ├── interactions.ts
│   │   │   ├── purchases.ts
│   │   │   └── catalogs.ts
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── responses.ts
│   │   │   └── validation.ts
│   │   │
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── migrations/
│   │   └── 0001_initial_schema.sql
│   │
│   ├── test/
│   │   └── companies.test.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── wrangler.jsonc
│
├── .gitignore
└── README.md