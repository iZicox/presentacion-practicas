crm/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── app.ts
│   │   │
│   │   ├── types/
│   │   │   ├── env.ts
│   │   │   └── auth.ts
│   │   │
│   │   ├── models/
│   │   │   ├── company.model.ts
│   │   │   ├── contact.model.ts
│   │   │   ├── interaction.model.ts
│   │   │   ├── purchase.model.ts
│   │   │   ├── segment.model.ts
│   │   │   ├── status.model.ts
│   │   │   └── client-type.model.ts
│   │   │
│   │   ├── dtos/
│   │   │   ├── company.dto.ts
│   │   │   ├── contact.dto.ts
│   │   │   ├── interaction.dto.ts
│   │   │   ├── purchase.dto.ts
│   │   │   └── catalog.dto.ts
│   │   │
│   │   ├── validators/
│   │   │   ├── company.validator.ts
│   │   │   ├── contact.validator.ts
│   │   │   ├── interaction.validator.ts
│   │   │   ├── purchase.validator.ts
│   │   │   ├── catalog.validator.ts
│   │   │   └── pagination.validator.ts
│   │   │
│   │   ├── repositories/
│   │   │   ├── company.repository.ts
│   │   │   ├── contact.repository.ts
│   │   │   ├── interaction.repository.ts
│   │   │   ├── purchase.repository.ts
│   │   │   ├── segment.repository.ts
│   │   │   ├── status.repository.ts
│   │   │   └── client-type.repository.ts
│   │   │
│   │   ├── services/
│   │   │   ├── company.service.ts
│   │   │   ├── contact.service.ts
│   │   │   ├── interaction.service.ts
│   │   │   ├── purchase.service.ts
│   │   │   ├── segment.service.ts
│   │   │   ├── status.service.ts
│   │   │   └── client-type.service.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── company.controller.ts
│   │   │   ├── contact.controller.ts
│   │   │   ├── interaction.controller.ts
│   │   │   ├── purchase.controller.ts
│   │   │   ├── segment.controller.ts
│   │   │   ├── status.controller.ts
│   │   │   ├── client-type.controller.ts
│   │   │   └── auth.controller.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── index.ts
│   │   │   ├── company.routes.ts
│   │   │   ├── contact.routes.ts
│   │   │   ├── interaction.routes.ts
│   │   │   ├── purchase.routes.ts
│   │   │   ├── segment.routes.ts
│   │   │   ├── status.routes.ts
│   │   │   ├── client-type.routes.ts
│   │   │   └── auth.routes.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   └── permissions.middleware.ts
│   │   │
│   │   ├── security/
│   │   │   └── access-token.ts
│   │   │
│   │   └── errors/
│   │       ├── app-error.ts
│   │       └── error-handler.ts
│   │
│   ├── tests/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── routes/
│   │
│   ├── migrations/
│   ├── schema.sql
│   ├── worker-configuration.d.ts
│   ├── wrangler.jsonc
│   ├── tsconfig.json
│   └── package.json
│
└── frontend/
    └── ...