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
│   ├── context/
│   ├── pages/
│   │   ├── auth/
│   │   ├── home/
│   │   │   └── components/
│   │   │       ├── card/
│   │   │       ├── categories/
│   │   │       ├── footer/
│   │   │       ├── header/  # Header component used in profile layout
│   │   │       ├── productlisting/
│   │   │       └── search/
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
