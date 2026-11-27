# Refactor plan: React 19, SOLID, dependencies

Phase 0 output. No source code has been changed.

## 1. Architecture

| Area        | What is there                                                                                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack       | React 19.1, TypeScript 5.9 (`strict`), webpack 5 + Babel, MUI 7, Tailwind 3                                                                                                                                   |
| Entry       | `src/main.tsx`: Redux `Provider`, TanStack Query, `RouterProvider`, `ToastContainer`                                                                                                                          |
| Routing     | `src/routes.tsx` (react-router-dom 7, lazy routes). Public: `/`, `/register`, `/login`, `/remote-capture`, `/unauthorized`, `*`. Behind `RequireAuth`: `/client`, `/freelancer`, `/calendar`, `/user-profile` |
| Route files | `src/routes/*.tsx`: one thin wrapper per page                                                                                                                                                                 |
| State       | Redux Toolkit, 8 slices, persisted to `sessionStorage`. TanStack Query is used only by the calendar                                                                                                           |
| Data        | `src/services/*` over an axios instance (`services/utils.ts`, `utils/authUtils.ts`); thunks in `src/store/*/thunks.ts`; SignalR in `lib/signalr.ts`                                                           |
| Forms       | Formik (login, register, address, user data, freelancer data) and react-hook-form (account page)                                                                                                              |
| Components  | `auth`, `calendar`, `camera`, `dashboard`, `errors`, `forms`, `sidebar`, `userProfile`, `wrappers`, `PageHeader`                                                                                              |
| Tests       | Jest 30 + Testing Library + MSW (123 suites), Playwright (21 tests), every file must exceed 80% coverage                                                                                                      |
| Lint        | ESLint 9 flat config with type-aware rules and React Compiler lint rules; Prettier                                                                                                                            |

## 2. Baseline (2026-11-27, commit `8546ac9`)

| Command                 | Result                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `npm ci`                | **Failed** with `EPERM`: a Jest run left over from 13:35 held a native module. `npm install` restored everything |
| `npm run build`         | Passes, 3 size warnings (`main` is 676 KiB)                                                                      |
| `npm run lint`          | 0 problems                                                                                                       |
| `npm run typecheck`     | 0 errors                                                                                                         |
| `npm run format:check`  | Clean                                                                                                            |
| `npm run test:coverage` | 570/570; statements 99.29%, branches 95.83%, functions 98.78%, lines 99.25%                                      |
| `npm run test:e2e`      | 21/21                                                                                                            |
| `npm audit`             | 0 vulnerabilities                                                                                                |

## 3. Problems found

### React 19

Already satisfied, so there is nothing to do: no `forwardRef` in `src` (only the test mock `jest.iconsMock.cjs:15`), no `<Context.Provider>`, `propTypes`, `defaultProps`, string refs, legacy context, class components or react-helmet, and `createRoot` is already used.

| Issue                                                                                        | Where                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Effect that reacts to state to stop the camera                                               | `components/camera/VerifyPhoto.tsx:71-75`                                                                                                                                                                                                                                                 |
| Effect copies server data into form state                                                    | `components/forms/UserForm.tsx:63-74`                                                                                                                                                                                                                                                     |
| `getValues()` read during render                                                             | `components/forms/UserForm.tsx:147`                                                                                                                                                                                                                                                       |
| Async effect without cleanup                                                                 | `hooks/useCameraAvailability.ts:7-19`                                                                                                                                                                                                                                                     |
| Same profile fetch repeated on mount                                                         | `hooks/useCurerentUser.ts:18-20`, `userProfile/ClientPage.tsx:39-41`, `userProfile/FreelancerPage.tsx:52-54`                                                                                                                                                                              |
| No Suspense boundary for authenticated routes, although the calendar uses `useSuspenseQuery` | `routes.tsx:67-96`, `hooks/useCalendar.ts:20`                                                                                                                                                                                                                                             |
| Hand-written pending flags that `useTransition` can replace                                  | `forms/UserForm.tsx:42-43`, `camera/MobileCapturePage.tsx:43`                                                                                                                                                                                                                             |
| `useMemo`/`useCallback` with no benefit                                                      | `sidebar/navigation/Navigation.tsx` (`navigationItems`), `RoleSelection.tsx:31`, `camera/VerifyPhoto.tsx:49`, `forms/common/PasswordInput.tsx:23`, `forms/AccountSettingsForm.tsx:39`, `forms/UserForm.tsx:76`, `sidebar/navigation/NavigationItemNested.tsx`, `NavigationItemSimple.tsx` |

### SOLID

| Principle | Issue                                                | Where                                                                                                                      |
| --------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| S         | Components mix data, logic and layout                | `forms/UserForm.tsx`, `camera/VerifyPhoto.tsx`, `camera/MobileCapturePage.tsx:11-152`, `calendar/CalendarPage.tsx:14-146`  |
| O / DRY   | Near-identical onboarding pages                      | `userProfile/ClientPage.tsx`, `FreelancerPage.tsx`                                                                         |
| L         | Wrappers do not forward native props                 | `userProfile/TabPanel.tsx`, `forms/common/PasswordInput.tsx`, `wrappers/Spinner.tsx`                                       |
| I         | Whole profile passed where a few fields are used     | `sidebar/UserAvatar.tsx:9`, `sidebar/user-menu/UserMenu.tsx:22`, `camera/VerifyPhoto.tsx:25`                               |
| D         | Third-party APIs called with axios inside thunks     | `store/country/thunks.ts:19-23`, `store/city/thunks.ts:19-20`                                                              |
| D         | Components build SignalR/fetch calls themselves      | `camera/RemoteCaptureFallback.tsx:31-60`, `camera/MobileCapturePage.tsx:137-144`                                           |
| DRY       | "Current user by role" written four times            | `forms/UserForm.tsx:39`, `userProfile/UserAccountPage.tsx:33`, `auth/RequireAuth.tsx:15`, `sidebar/ToolbarElements.tsx:17` |
| DRY       | The same thunk `catch` block repeated about 10 times | `store/auth/thunks.ts`, `store/user-profile/thunks.ts`                                                                     |

### Oversized or repetitive components

| File                                | Lines | Split into                                                                          |
| ----------------------------------- | ----- | ----------------------------------------------------------------------------------- |
| `forms/UserForm.tsx`                | 304   | `AvatarCard`, `AccountFieldsCard`, `FormField`, `useAvatarUpload`, `useAccountForm` |
| `forms/FreelancerDataForm.tsx`      | 258   | `MultiSelectField`, `useFreelancerOptions`                                          |
| `sidebar/navigation/Navigation.tsx` | 237   | Move `NAV_ITEMS` to `navItems.tsx`                                                  |
| `camera/VerifyPhoto.tsx`            | 214   | `CameraViewfinder`, `PhotoPreview`, `useVerificationPhoto`                          |
| `forms/AddressForm.tsx`             | 187   | `LocationAutocomplete`, `FormikTextField`                                           |
| `camera/MobileCapturePage.tsx`      | 176   | `useFrontCamera`, `useSendPhoto`, `capture.ts`                                      |
| `calendar/CalendarPage.tsx`         | 157   | `CalendarEventTile`, `eventUtils.ts`                                                |
| `forms/AccountSettingsForm.tsx`     | 141   | `SettingsSection` (four repeated blocks)                                            |
| `errors/ErrorBoundary.tsx`          | 62    | One layout instead of two duplicated branches                                       |
| `store/user-profile/thunks.ts`      | 222   | Shared error helper (not a component)                                               |

### Accessibility and semantics

| Issue                                                                            | Where                                                      |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `aria-labelledby="simple-tab-N"` points at ids that do not exist                 | `userProfile/TabPanel.tsx:16`, `UserAccountPage.tsx:70-72` |
| Clickable `<a>` without `href`, not keyboard reachable; `<h1>` used for the logo | `sidebar/Logo/Logo.tsx:19-34`                              |
| Duplicate element id for every header                                            | `sidebar/navigation/NavigationItemHeader.tsx:11`           |
| Menu labelled by a missing id                                                    | `sidebar/user-menu/UserMenu.tsx:52`                        |
| Calendar event hover is mouse-only                                               | `calendar/CalendarPage.tsx:99-100`                         |
| Modal has no accessible name                                                     | `wrappers/GenericModal.tsx:13-20`                          |

### Cleanup

| Issue                                                | Where                                                                                                                                                                                  |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Files nothing in the app imports                     | `App.tsx` (only its test), `App.css`, `models/Errors.ts`, `reportWebVitals.ts` (only its test)                                                                                         |
| Reference to `react-scripts`, which is not installed | `react-app-env.d.ts:1`                                                                                                                                                                 |
| Thunks and helpers used only by tests                | `deleteUserAccount` (`store/auth/thunks.ts:72`), `getUserProfilesData` and `patchFreelancerData` (`store/user-profile/thunks.ts:187-222`), `handleHttpError` (`utils/authUtils.ts:66`) |
| Misspelled names                                     | `Unauthoized.tsx`, `useCurerentUser.ts`, `Widget/stylled/`, `freelnacerValidationSchema`, `verifreelancerProfile`, `PatchFreelancerProfielRequest`                                     |
| Several routes all name their component `Home`       | `routes/*.tsx`                                                                                                                                                                         |
| `console.log` / `any`                                | None. Three `console.error` calls report real failures and will stay                                                                                                                   |

## 4. Dependencies

"Read" means the changelog or migration guide was checked. "Not read" majors get that check in Phase 1, before any upgrade.

### Major versions

| Package                         | Current  | Latest  | Breaking for this repo?                                                                                                                                            | Action                                      |
| ------------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| react-router-dom → react-router | 7.18.7   | 8.5.3   | Read. `react-router-dom` is removed; 29 files change imports. Needs Node 22.22+, React 19.2.7+, and Jest must transform ESM                                        | **Upgrade** (mechanical)                    |
| @hookform/resolvers             | 5.2.2    | 7.0.9   | Read. Only effect and typebox resolvers; we use yup                                                                                                                | **Upgrade**                                 |
| lucide-react                    | 0.542.0  | 1.82.0  | Read. Brand icons removed; we use only `Lock`                                                                                                                      | **Upgrade**                                 |
| webpack-cli                     | 5.1.4    | 7.3.1   | Read. Node 20.9+; removed commands and flags we do not use                                                                                                         | **Upgrade**                                 |
| lint-staged                     | 16.2.7   | 17.6.2  | Read. Node 22.22.1+, Git 2.32+. From 17.6 the hook also stages other tracked files that tasks modify                                                               | **Upgrade**                                 |
| @testing-library/jest-dom       | 6.8.0    | 8.0.0   | Read. Node 22+; v8 drops old Vitest, which we do not use                                                                                                           | **Upgrade**                                 |
| msw                             | 2.15.0   | 3.0.8   | Read. Import paths and `onUnhandledRequest` renamed (2 files); ESM                                                                                                 | **Try**, revert if Jest breaks              |
| @babel/core + presets           | 7.x      | 8.x     | Read (partly). Node 22.18+; our three presets use no removed options                                                                                               | **Try**, revert if build or coverage breaks |
| typescript                      | 5.9.2    | 7.0.2   | Not read. 7 is outside `typescript-eslint`'s range (`<6.1`). 6.0 likely needs `moduleResolution`, `target` and `types` changes                                     | **6.0** after reading; skip 7               |
| babel-loader                    | 9.2.1    | 10.1.1  | Not read                                                                                                                                                           | Read, then decide                           |
| dotenv                          | 16.6.1   | 18.0.10 | Not read                                                                                                                                                           | Read, then decide                           |
| @mui/material, icons-material   | 7.3.1    | 9.6.0   | Read. System props removed from `Box`, `Stack`, `Typography`, `Grid` (used widely here); Stepper, Tabs and list spacing behaviour changes; higher browser minimums | **Skip** (7.3.11 only): risks the UI        |
| tailwindcss                     | 3.4.17   | 4.3.5   | Not read. v4 replaces the config and PostCSS setup                                                                                                                 | **Skip**: risks the UI                      |
| eslint, @eslint/js              | 9.39.5   | 10.x    | `eslint-plugin-jsx-a11y` only allows up to 9                                                                                                                       | **Skip**                                    |
| @microsoft/signalr              | 9.0.6    | 11.0.0  | Changelog could not be fetched (HTTP 503); server version unknown                                                                                                  | **Skip** (9.0.19 only)                      |
| @types/node                     | 22.18.0  | 26.x    | Should match the Node 22 runtime                                                                                                                                   | **Skip** (22.x only)                        |
| user-event-13                   | 13.5.0   | 14.6.13 | Deliberate alias. 18 test files depend on v13 behaviour                                                                                                            | **Keep** for now                            |
| web-vitals                      | 2.1.4    | 6.2.3   | Only used by dead code                                                                                                                                             | **Remove**                                  |
| framer-motion                   | 12.23.12 | 14.x    | Not imported                                                                                                                                                       | **Remove**                                  |

### Patch and minor (all upgrade)

| Package                                                                                          | Current → latest                              |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| react, react-dom                                                                                 | 19.1.1 → 19.3.1                               |
| @types/react, @types/react-dom                                                                   | 19.1.x → 19.3.x                               |
| @testing-library/react, dom                                                                      | 16.3.0 → 16.3.3, 10.4.1 → 10.4.2              |
| @reduxjs/toolkit, react-redux                                                                    | 2.8.2 → 2.15.0, 9.2.0 → 9.3.1                 |
| @tanstack/react-query                                                                            | 5.90.2 → 5.108.4                              |
| react-hook-form, formik, yup                                                                     | 7.64.0 → 7.92.0, 2.4.6 → 2.4.9, 1.7.0 → 1.7.1 |
| react-calendar, react-qr-code, react-toastify                                                    | → 6.0.1, 2.2.0, 11.2.0                        |
| autoprefixer, css-loader, postcss-loader, html-webpack-plugin, mini-css-extract-plugin, prettier | → latest                                      |

Already latest or no newer minor: `@emotion/*`, `@nivo/*`, `axios`, `jwt-decode`, `redux-persist`, `webpack`, `webpack-dev-server`, `jest`, `postcss`, the ESLint plugins.

### Remove (checked with knip, depcheck and grep)

| Package                                                            | Reason                                                             |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `clsx`, `framer-motion`, `redux-thunk`, `redux`                    | Never imported (`redux` and `redux-thunk` ship with Redux Toolkit) |
| `@types/jwt-decode`, `@types/react-toastify`, `@types/redux-thunk` | Deprecated stubs                                                   |
| `@types/react-redux`, `@types/react-router-dom`                    | Libraries ship their own types                                     |
| `web-vitals`                                                       | With `reportWebVitals.ts`                                          |

`process`, the Babel presets, loaders, `webpack-cli`, `webpack-dev-server` and `@types/jest` are reported as unused but are used by config. Keep.

### Move to `devDependencies`

`@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/react`, `tailwindcss`, `mini-css-extract-plugin`, `process`.

## 5. Order of work

One commit per step. After each: build, typecheck, lint, format check, unit tests with coverage. Playwright after each phase and after any routing, form or camera step. Work happens on a branch, not on `main`.

1. `chore`: remove unused dependencies and move misplaced ones.
2. `chore`: patch and minor upgrades, React 19.3.
3. `chore`: one commit per major upgrade (resolvers, lucide, webpack-cli, lint-staged, jest-dom, react-router 8, then msw, Babel 8, TypeScript 6). Add `engines.node >=22.22.1`.
4. `refactor`: delete dead code and fix misspelled names.
5. `refactor`: shared `components/ui` (`FormField`, `ConfirmModal`, `Spinner`, `PageHeader`, `FullPageMessage`).
6. `refactor`: move to `features/`, one commit each, moving and splitting separately: `auth`, `profile` (onboarding, account), `camera`, `calendar`, `dashboard`, `navigation`.
7. `refactor`: hooks and service abstractions (`useCurrentProfile`, location API, capture API).
8. `refactor`: effects, `useTransition`, pointless memoisation, Suspense and error boundaries.
9. `fix(a11y)`: the items above that do not change the look.
10. Final summary added to this file.

Tests move with their files. Test changes are limited to imports and renames; if an assertion would need to change, behaviour has changed and the step is reconsidered.

## 6. Needs decision

Each has a default that applies if you say nothing.

| #   | Question                                                                                                                                                     | Default                                                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| 1   | Convert forms to `<form action>` / `useActionState`? Formik validates as you type, and React resets a form after an action, so behaviour could change.       | Keep Formik and react-hook-form; use `useTransition` for pending states                           |
| 2   | Add `useOptimistic` (for example when removing the avatar)? It changes what the user sees.                                                                   | Do not add                                                                                        |
| 3   | Enable the React Compiler (new dependency `babel-plugin-react-compiler`)?                                                                                    | Not in this refactor                                                                              |
| 4   | MUI 9 migration? Needs a visual review of every screen.                                                                                                      | Separate task                                                                                     |
| 5   | Deduplicate the repeated profile fetches? Changes network behaviour.                                                                                         | Remove only the same-component duplicates in the two profile pages if tests confirm no difference |
| 6   | Delete the test-only thunks and the unused domain models (`models/Contracts.ts`, `Invoices.ts`, `Projects.ts` and others)? They may be for planned features. | Delete the dead files in "Cleanup"; keep thunks and models                                        |
| 7   | Logo and calendar keyboard support changes focus order.                                                                                                      | Add it, keeping the look identical                                                                |
| 8   | Remove template leftovers (placeholder dashboard data, two identical welcome cards, the `FoxUiNavigationItem` style name)?                                   | Leave as is                                                                                       |

## 7. Bugs noticed, not part of a refactor

These change behaviour, so they will **not** be fixed unless you ask.

| Severity | Bug                                                                                                                         | Where                                                            |
| -------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| High     | The production build does not copy `public/`, so the Docker image has no logo, favicon or manifest                          | `webpack.config.js` (no copy plugin), `Dockerfile:26`            |
| High     | nginx has no SPA fallback, so reloading `/client` and other deep links should return 404 (from reading the config, not run) | `Dockerfile:29`                                                  |
| Medium   | Client and freelancer onboarding navigate as if saved even when the save fails                                              | `userProfile/ClientPage.tsx:80-88`, `FreelancerPage.tsx:104-114` |
| Medium   | "Save changes" on account settings does nothing, and the checkboxes are hard-coded                                          | `forms/AccountSettingsForm.tsx:30-41`                            |
| Low      | `%PUBLIC_URL%` is left literally in the built HTML; title is "React App"                                                    | `public/index.html`                                              |
| Low      | Calendar sorts the cached query data in place                                                                               | `calendar/CalendarPage.tsx:26-33`                                |
| Low      | `.env` is tracked by git although it is listed in `.gitignore`                                                              | `.env`                                                           |
