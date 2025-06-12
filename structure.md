# phono project structure

## overview

this is a next.js e-commerce application for selling phones and accessories.

## directory structure

```
new-phono/
  api/
    types/              # api type definitions
      index.ts          # main type definitions for the api (UPDATED with expanded HomepageData)
    api.ts              # api functions for fetching and submitting data (UPDATED with product management API functions and improved error handling)
  app/                  # next.js app router components
    auth/               # authentication related pages
    favorites/          # redirects to profile page with favorites tab active
      page.tsx          # favorites redirect component
    layout.tsx          # root layout component (UPDATED with StyledComponentsRegistry)
    profile/            # user profile pages and components
      components/       # profile page components
        AdsTab/
          index.tsx     # displays user ads with product management functionality (UPDATED)
          AdCard.tsx    # displays individual ad with product management dropdown menu (UPDATED with conditional rendering)
          AdsSearchFilter.tsx # search and filter for ads
        FavoritesTab/   # favorites tab components
          index.tsx     # displays favorite ads with heart button (FIXED to show hearts instead of management buttons)
        MessagesTab/
        SettingsTab/
          modals/
        ui/
      hooks/            # profile-related custom hooks
        useProfileData.ts # hook for managing profile data and ads
      types/            # profile-related type definitions
        index.ts        # contains Ad interface used throughout the profile section
    product/            # product pages
      [id]/             # dynamic route for product page by id
        page.tsx        # product page component (UPDATED with status indicators and conditional phone display)
      components/       # shared product components
        ProductForm.tsx # reusable product form component (requires auth)
      create/           # create product page
        page.tsx        # create product page component (requires auth)
      edit/             # edit product pages
        [id]/           # dynamic route for editing product by id
          page.tsx      # edit product page component (UPDATED to use useParams instead of router.query for App Router compatibility)
    search-results/     # search results page (added)
    settings/           # settings pages
      product/
        [id]/           # dynamic route for product settings
      settings/         # general settings
  components/           # shared components
    Card/               # product card component
      ProductCard.tsx   # product card component (FIXED favorite functionality with custom events)
      ProductCard.scss  # styles for product card
    Categories/         # category selection components (UPDATED to enable brand filtering)
      Categories.tsx    # functional component for category/brand filtering
      Categories.scss   # enhanced styling for category display
    FilterModal/        # filters for product search (FIXED to persist user entered filter data, UPDATED to use cached data)
      components/
        ColorPicker/    # color filter component
      types.ts          # types for filter components and state (UPDATED with homepageData prop)
      index.tsx         # main FilterModal component (FIXED to persist user entered data, UPDATED to use homepageData)
      FilterModal.style.ts # styled components for the filter modal
    Footer/             # site footer
    Header/             # site header
    ProductListing/     # product listing component (UPDATED to handle search results and favorites)
      ProductListing.tsx # main product listing component (FIXED to properly sync favorites with custom events)
      ProductListing.scss # styles for product listing
    Search/             # search component (FIXED to prevent infinite search API calls, UPDATED to persist filter data)
      Search.tsx        # main search component with search logic (UPDATED to use homepageData)
      Search.scss       # search component styles
  context/              # react context providers
    UserContext.tsx     # user authentication context provider
  lib/                  # utility libraries and helpers (NEW)
    registry.tsx        # styled-components registry for Next.js SSR (NEW)
  pages/                # page components (legacy pages router)
    Auth/               # authentication pages
    favorites.tsx       # redirects to profile page with favorites tab active
    Home/               # home page components (FIXED to prevent infinite search API calls, UPDATED to fetch and cache data)
      Home.tsx          # main home page component (UPDATED to load and cache data from /web endpoint, FIXED favorites sync)
      Home.scss         # home page styles
      Components/
        Components/
          Card/         # FIXED to use proper API methods and sync favorites state
          ProductListing/ # UPDATED to handle favorites state correctly
    product/            # product detail pages
  public/               # static assets
  styles/               # global styles
  next.config.ts        # next.js configuration
  package.json          # project dependencies
  README.md             # project documentation
  tsconfig.json         # typescript configuration
```

## Search Functionality

The search functionality has been implemented with the following components:

1. `api.ts` - Added `search` method to query products with various filters
2. `Search.tsx` - Updated to handle search queries and filter parameters (FIXED to prevent infinite search API calls)
3. `FilterModal/index.tsx` - Updated to use real data from the API (FIXED to persist user entered filter data)
4. `Home.tsx` - Updated to display search results and handle URL parameters (FIXED to prevent infinite search API calls)
5. `ProductListing.tsx` - Updated to properly display search results
6. `Categories.tsx` - Updated to enable brand filtering when clicking on a category/brand

The search feature allows users to:

- Search by text query
- Filter by region, brand, model, memory, color, and price range
- Filter for new or used products
- Filter for top ads only
- Browse products by brand categories
- All search parameters are reflected in the URL

## Recent Fixes

Fixed an issue where the search functionality was causing infinite API requests and client-side exceptions by:

1. Adding a `searchKey` state variable in `Home.tsx` to track and prevent duplicate searches
2. Using multiple `useRef` flags to track search state:
   - `initialDataLoaded` to ensure data is only loaded once
   - `isSearching` to prevent concurrent search requests
3. Implementing debouncing (300ms) for searchParams changes
4. Adding query caching with `lastSearchQuery` in the Search component
5. Improving error handling throughout both components
6. Separating initial data loading from search parameter handling
7. Adding robust checks to prevent unnecessary API calls when parameters haven't changed
8. Fixed product management buttons appearing in favorites section
   - Added conditional rendering to AdCard component based on isOwnProduct prop
   - Updated FavoritesTab to pass isOwnProduct=false to AdCards
   - Restored heart icon for favorite toggle in favorites section
9. Fixed edit product page loading issues
   - Improved API error handling in getProductById function
   - Added proper dependency array for useEffect hooks
   - Implemented retry mechanism for failed API calls
   - Added cleanup function to prevent state updates after unmount
10. Fixed router.query.id undefined error

- Replaced router.query.id with useParams().id to match Next.js 13+ App Router requirements
- Added type safety checks for image IDs when setting main product image

## Categories Functionality

Enhanced the Categories section to allow filtering products by brand:

1. Updated `Categories.tsx` to make brand icons clickable
2. Added URL parameter handling to filter products by brand ID
3. Enhanced styling with hover effects, responsive design, and accessibility features
4. Ensured proper handling of brand filtering in the Home component

## Filter Modal Functionality

Fixed issues with the filter modal to properly persist user entered data:

1. Updated `FilterModal` component to accept initial filter values via props
2. Added proper data persistence between filter modal opens/closes
3. Ensured selected brand models are properly loaded when the modal reopens
4. Fixed type errors in the filter handling code
5. Improved the modal's state management to maintain user selections

## Homepage Data Loading

Optimized data loading for the homepage by fetching all required data from the `/web` endpoint:

1. Enhanced the `HomepageData` interface to include colors and regions data
2. Updated the `Home` component to fetch and cache all data from the `/web` endpoint on initial page load
3. Modified the `Search` and `FilterModal` components to accept and utilize the cached homepage data
4. Eliminated redundant API calls by sharing the data between components
5. Added conditional logic to only fetch data when necessary
6. Improved error handling and loading states for a better user experience

## Product Detail Page

Enhanced the product detail page to match the design shown in the screenshots:

1. Updated layout to use a two-column design with image gallery on the left and product info on the right
2. Added image carousel with thumbnails below and navigation buttons
3. Improved the product specifications display with a cleaner layout
4. Added "Write message" and "Show number" action buttons
5. Implemented favorite toggle functionality
6. Added breadcrumb navigation
7. Enhanced the visual styling to match the provided design
8. Added product status indicators (sold, archived, waiting for approval)
9. Disabled phone number display for products that are not active

## Favorites Functionality

Fixed issues with the favorites functionality:

1. Updated ProductCard component to use consistent API endpoints for adding/removing favorites
2. Fixed how favorite items are retrieved from the user profile - now correctly extracting product_id from favourite_items
3. Improved synchronization of favorites state across different components using custom events
4. Ensured favorites persist after page refresh by correctly loading data from the user profile
5. Updated both the components/Card and pages/Home/Components/Card versions to maintain consistency
6. Added proper user authentication checks before allowing favorite actions
7. Implemented error handling with appropriate user feedback for favorite operations
8. Fixed the data structure mismatches between API endpoints and UI components
9. Added redirect from `/favorites` to `/profile` with the favorites tab active for better user experience
10. Fixed product management buttons appearing for other users' products in favorites section

## Product Management Functionality

Added product management functionality to the profile page:

1. Enhanced AdCard component with a three dots menu instead of the heart button for user's own products
2. Implemented product management actions:
   - Edit product - redirects to edit page
   - Archive product - removes product from public listings
   - Mark product as sold - archives and marks as sold
   - Unarchive product - makes product visible again
   - Upgrade to TOP - promotes product to top listings for 7 days
3. Added API methods for product management in api.ts:
   - updateProduct - updates product details
   - archiveProduct - archives a product with optional sold status
   - unarchiveProduct - makes a product visible again
   - upgradeProduct - promotes product to top listings
4. Enhanced AdsTab component to listen for product updates and refresh the list when changes occur
5. Integrated proper error handling for each action
6. Added visual indicators for product status (active, waiting approval, deactivated, sold)
7. Implemented conditional menu options based on product status

## Styled-Components SSR Setup

Added proper server-side rendering support for styled-components to fix hydration issues:

1. Created a StyledComponentsRegistry component in lib/registry.tsx
2. Updated the root layout to wrap the app with this registry
3. Fixed hydration issues in ProductEditPage by:
   - Using client-side only authentication checks
   - Ensuring consistent rendering between server and client
   - Adding proper cleanup in useEffect hooks
   - Using a cleaner approach for loading states

These changes ensure that styled-components class names are consistent between server and client rendering, preventing the "Hydration failed because the server rendered HTML didn't match the client" error.

## Edit Product Page Fixes

Fixed issues with the edit product page:

1. Fixed router.query.id undefined error:

   - Replaced router.query.id with useParams().id to work with Next.js 13+ App Router
   - Added null check for params to prevent type errors
   - Fixed type checking for image IDs when setting main product image

2. Improved error handling in the API:

   - Enhanced the getProductById function with better error messages and logging
   - Direct use of axiosInstance instead of indirect API calls for more reliable error handling

3. Fixed React hooks in the edit page component:

   - Added proper dependencies to useEffect hooks to ensure data is fetched correctly
   - Implemented cleanup function to prevent state updates after component unmount
   - Added component mount tracking to avoid memory leaks

4. Added a retry mechanism for product fetching:

   - Implemented up to 3 retries with 1-second delay between attempts
   - Added detailed logging to help diagnose issues during development

5. Enhanced loading state management:
   - Better conditional rendering based on authentication and loading states
   - Improved status messages for different loading phases
   - Added proper error handling with user-friendly messages
