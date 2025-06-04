# phono-frontend project structure

```
phono-frontend/
├── public/
│   └── images/
├── src/
│   ├── api/
│   │   └── types/
│   │   │   └── index.ts          # includes Comment interface for product comments
│   │   └── api.ts                # includes comment API functions but product responses already contain comments
│   ├── app/
│   │   ├── auth/
│   │   ├── product/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx            # product detail page with comments section that uses product.comments
│   │   │   │   └── page.module.scss    # product detail page styles with comment section styles
│   │   │   ├── layout.tsx              # product section layout
│   │   │   └── layout.module.scss      # product section layout styles
│   │   ├── profile/
│   │   │   ├── components/
│   │   │   │   ├── adstab/
│   │   │   │   │   ├── index.tsx       # ads tab component with active/waiting/deactive product sections
│   │   │   │   │   ├── adcard.tsx      # updated card component showing product status
│   │   │   │   │   └── adssearchfilter.tsx
│   │   │   │   ├── favoritestab/
│   │   │   │   │   └── index.tsx       # favorites tab component that displays favorite products from the API
│   │   │   │   ├── messagestab/
│   │   │   │   └── settingstab/
│   │   │   │       ├── modals/
│   │   │   │       └── ui/
│   │   │   ├── hooks/
│   │   │   │   └── useProfileData.ts   # hook for fetching and managing profile data, including favorites
│   │   │   ├── types/
│   │   │   │   └── index.ts            # updated with ProductStatusTab type and Ad interface with status
│   │   │   └── page.tsx                # profile page component that uses the useProfileData hook
│   │   └── settings/
│   │       └── page.tsx                # settings redirect page that sets session storage and redirects to profile
│   ├── components/
│   │   ├── card/
│   │   │   └── productcard.tsx         # product card component with favorite toggle functionality
│   │   ├── categories/
│   │   ├── filtermodal/
│   │   │   └── components/
│   │   │       └── colorpicker/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── productlisting/
│   │   │   └── productlisting.tsx      # product listing with favorites support
│   │   └── search/
│   ├── context/
│   ├── pages/
│   │   ├── auth/
│   │   ├── product/
│   │   │   └── [id].tsx                # placeholder file to redirect to app router implementation
│   │   ├── settings.tsx                # placeholder file to redirect to app router implementation
│   │   └── home/
│   │       ├── Home.tsx                # home page with favorites integration
│   │       └── components/
│   │           └── components/
│   │               ├── card/
│   │               └── productlisting/
│   └── utils/
├── next.config.js                      # updated with pageExtensions and experimental.appDir settings
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

this structure represents the main files and directories in the phono-frontend project, excluding build directories, node_modules, and other files/directories that might be in .gitignore.

Key observations:

1. The product response already includes the comments array in the API response
2. The product detail page (`/app/product/[id]/page.tsx`) still makes separate API calls to fetch comments, but this is redundant
3. The Comment interface in `api/types/index.ts` matches the structure of comments in the product response
4. The API includes separate comment endpoints for adding, updating, and deleting comments, but fetching comments can use the data already in the product response
5. Placeholder files added in the Pages Router to support the App Router implementation

According to the user's note, there's no need to fetch comments separately when clicking on the comments tab - they can use the comments already included in the product response.
