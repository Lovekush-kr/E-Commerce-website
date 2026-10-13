# Technology Stack and Architecture

## Required stack
- React with Vite.
- JavaScript and JSX; TypeScript is not required.
- CSS for styling.
- React Router for page navigation.
- React Context API for shared cart and wishlist state.
- `useState`, `useEffect`, and `useContext`.
- LocalStorage for non-sensitive persistence.
- Native `fetch()` with `async/await` for product API requests.

Inspect the existing `package.json` before assuming any package or version is installed. Add only dependencies needed by the requirements.

## React complexity level
Beginner-to-intermediate only. Use functional components, props, state, events, conditional rendering, array methods, controlled inputs, basic effects, Context API, and React Router. Avoid Redux, complex state libraries, advanced memoization, elaborate custom-hook systems, state machines, higher-order components, and premature optimization.

## Suggested project organization
Adapt this to the existing project rather than forcing a complete restructure.

```text
src/
  components/       # Shared UI: Navbar, Footer, ProductCard, etc.
  pages/            # Home, Products, ProductDetails, Cart, Checkout, Confirmation
  context/          # CartContext and WishlistContext, if needed
  services/         # Product API requests
  utils/            # Small reusable helpers, if needed
  assets/           # Local images and other assets
  App.jsx
  main.jsx
  index.css
```

Keep the structure shallow and understandable. Do not create a file for every tiny function.

## Routing
Use React Router for page routes. Confirm whether it is already installed before adding it. Use clear routes for the home page, product listing, product details, cart, checkout, and order confirmation. Use URL parameters for product IDs. Handle unknown routes gracefully if practical.

## Product API
Preferred initial source: DummyJSON Products API, `https://dummyjson.com/products`.

Potential endpoints:
- `/products`
- `/products/categories`
- `/products/search?q=...`
- `/products/category/{category}`
- `/products/{id}`

Verify endpoint paths and response structures against current documentation/API responses before relying on them. Centralize requests in a service module. Handle `response.ok`, errors, loading, and empty data. Avoid fetching separately inside every product card. Fetch a useful product collection once and filter/sort locally when reasonable; use search/category endpoints when they provide a clear benefit.

Normalize fields in one place only if necessary. Product APIs may provide fields such as `id`, `title`, `description`, `category`, `price`, `discountPercentage`, `rating`, `stock`, `thumbnail`, and `images`; verify the actual fields. Do not pretend the API provides a reliable creation date or customer-review text if it does not.

## Search, filtering, and sorting
- Search by product name without case sensitivity.
- Combine category, price, and minimum-rating filters.
- Apply sorting to the filtered results.
- Use `filter`, `sort`, and other straightforward array methods.
- Avoid maintaining duplicate state for values that can be derived from the current product list and selected controls.
- If sorting the original array, copy it first to avoid mutating shared API data.

## Cart and wishlist
Use Context API for shared cart/wishlist state so unrelated pages can access it without long prop chains. Keep the implementation simple and document the context value/actions.

- Cart items should use stable product IDs.
- Store quantity per cart item.
- Calculate item count and totals from cart contents.
- Persist cart and wishlist data with LocalStorage.
- Initialize safely and handle missing or invalid stored JSON.
- Do not store sensitive information in LocalStorage.
- Keep checkout/order logic appropriate for a mock frontend.

## Checkout and confirmation
Use controlled form fields and basic validation. Do not process real payments. On a valid mock order, generate a non-sensitive mock order ID and show a summary. Clear the cart only after the mock order is accepted by the app flow. Avoid claiming a real order was placed with a merchant.

## Styling
Use plain CSS and the design tokens in `design-tokens.md`. Reuse shared layout styles when sensible. Use responsive Grid/Flexbox. Avoid introducing a styling framework unless the existing project already uses one and it is appropriate.

## State and effects
- `useState` for local interactive state.
- `useEffect` for external synchronization such as API calls or LocalStorage.
- `useContext` for shared cart/wishlist state.
- Do not use an effect to compute values that can be calculated during render.
- Avoid unnecessary `useMemo` and `useCallback`.
- Keep dependencies and state flow easy to explain.

## Verification commands
First inspect `package.json`. Typical Vite commands may be `npm run dev` and `npm run build`, but use the scripts that actually exist. Run any available lint or test script only if configured. Record actual results; do not assume a command succeeded.

## Data integrity
Distinguish verified API fields from calculated display values and demo content. Label mock reviews, authentication, checkout, and orders honestly. Never embed secret API keys in frontend source.
