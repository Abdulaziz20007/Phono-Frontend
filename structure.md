# phono-frontend project structure

```
phono-frontend/
├── public/
│   └── images/
├── src/
│   ├── api/
│   │   └── types/
│   │   └── api.ts          # updated email endpoints: /email for add, /email/:id for delete, /email/:id for edit
│   ├── app/
│   │   ├── auth/
│   │   ├── product/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx            # product detail page component with API integration
│   │   │   │   └── page.module.scss    # product detail page styles with seller section
│   │   │   ├── layout.tsx              # product section layout
│   │   │   └── layout.module.scss      # product section layout styles
│   │   ├── profile/
│   │   │   ├── components/
│   │   │   │   ├── adstab/
│   │   │   │   ├── favoritestab/
│   │   │   │   ├── messagestab/
│   │   │   │   ├── settingstab/
│   │   │   │   │   └── EmailSection.tsx    # updated to handle email verification via link and email editing
│   │   │   │   │   └── index.tsx           # updated to pass editEmail function
│   │   │   │   │   └── modals/
│   │   │   │   └── ui/
│   │   │   ├── hooks/
│   │   │   │   └── useProfileData.ts       # updated to handle email operations with proper id fields and added editEmail function
│   │   │   └── types/
│   │   │   │   └── index.ts                # updated UserRegisteredEmail to include id field
│   │   │   ├── layout.tsx  # now includes Header component
│   │   │   └── page.tsx    # updated to pass editEmail function to SettingsTab
│   │   ├── settings/
│   │   │   └── page.tsx  # route interceptor for profile settings
│   │   ├── globals.scss
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/        # moved from src/pages/Home/Components
│   │   ├── Card/
│   │   │   ├── ProductCard.scss
│   │   │   └── ProductCard.tsx        # updated to use Next.js Link for navigation to product/:id
│   │   ├── Categories/
│   │   ├── FilterModal/
│   │   │   ├── components/
│   │   │   │   └── ColorPicker/
│   │   │   ├── constants.ts
│   │   │   ├── FilterModal.style.ts
│   │   │   ├── index.tsx
│   │   │   └── types.ts
│   │   ├── Footer/
│   │   ├── Header/
│   │   ├── ProductListing/
│   │   └── Search/
│   │       ├── Search.scss
│   │       └── Search.tsx
│   ├── context/
│   ├── pages/
│   │   ├── auth/
│   │   ├── home/
│   │   │   └── Home.tsx            # main home page component
│   │   ├── _app.tsx
│   │   └── _document.tsx
│   └── utils/
├── next.config.js
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

this structure represents the main files and directories in the phono-frontend project, excluding build directories, node_modules, and other files/directories that might be in .gitignore.
