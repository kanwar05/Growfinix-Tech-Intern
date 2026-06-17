# Full-Stack Notes App

A beginner-friendly, production-style Notes App built with React, Vite, React Router, Tailwind CSS, Node.js, Express, MongoDB, Mongoose, JWT auth in HTTP-only cookies, bcrypt password hashing, protected routes, owner-only note access, Markdown preview, pinned notes, archived notes, trash/restore, search, and tag/category filters.

## Project Structure

```txt
Task-1-FullStack-Notes-App/
  client/                 React + Vite frontend
    src/api/              Axios API functions
    src/components/       Reusable UI, layout, auth, route, and note components
    src/context/          Auth, theme, and toast providers
    src/pages/            Login, Signup, Dashboard, Archive, Trash, Create, Edit, Details
  server/                 Express + MongoDB backend
    src/config/           MongoDB connection
    src/controllers/      Auth and notes controllers
    src/middlewares/      Auth, rate limit, and error middleware
    src/models/           User and Note schemas
    src/routes/           REST API routes
    src/utils/            JWT cookie helpers
```

## Features

- Signup, login, logout, and current-user session check
- JWT stored in HTTP-only cookies
- Protected frontend routes and protected notes API routes
- Owner-only create, read, update, and delete access for notes
- Pin and unpin important notes, with pinned notes shown first
- Archive and unarchive notes, with archived notes hidden from the main dashboard
- Dedicated archive page for reviewing, restoring, or deleting archived notes
- Trash and restore system so normal deletes are recoverable
- Permanent delete flow from Trash with confirmation modal
- Login/register rate limiting
- Notes dashboard with search, tag filter, and category filter
- Markdown note editor with live preview
- Note details page with rendered Markdown
- Empty, loading, success, and error states
- Delete confirmation
- Responsive modern UI with reusable design-system components
- Light and dark mode with saved user preference
- Toast notifications for auth and note actions
- Skeleton loaders for note loading states
- Custom delete confirmation modal

## UI Features

- Tailwind CSS design system with class-based dark mode, polished cards, gradients, shadows, focus rings, and responsive spacing.
- Modern dashboard with polished note cards, pinned/archive badges, quick filter chips, search, empty state artwork, and card-level Pin/Archive/View/Edit/Trash actions.
- Improved auth pages with centered cards, subtle background pattern, validation messages, loading states, and password visibility toggle.
- Create/Edit pages with a clean editor panel, tag previews, desktop side-by-side Markdown preview, and mobile stacked layout.
- Note details page with large title, metadata, rendered Markdown, tags, back link, and safe delete flow.
- Accessible focus states, aria labels for notifications/modals, keyboard-friendly controls, and responsive layouts for mobile, tablet, and desktop.

## Light/Dark Mode

Use the `Light`/`Dark` toggle in the top navigation after logging in.

- On first load, the app detects the system color scheme with `prefers-color-scheme`.
- The selected theme is saved in `localStorage` under `notes-theme`.
- Theme styles are applied through the `dark` class on `document.documentElement`.
- Tailwind `dark:` utilities keep pages and reusable components consistent across both themes.

## Screenshots

Add screenshots here after running the app locally:

- Dashboard - light mode
- Dashboard - dark mode
- Markdown editor
- Note details
- Login or signup page

## API Routes

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Notes:

- `GET /api/notes`
- `GET /api/notes/trash`
- `GET /api/notes/:id`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `PATCH /api/notes/:id/pin`
- `PATCH /api/notes/:id/archive`
- `PATCH /api/notes/:id/restore`
- `DELETE /api/notes/:id`
- `DELETE /api/notes/:id/permanent`

`GET /api/notes` supports query params:

- `search=keyword`
- `tag=react`
- `category=work`
- `archived=true`

By default, `GET /api/notes` returns only non-trashed notes. The dashboard receives non-archived notes, and `archived=true` loads the archive page. Pinned notes are returned before unpinned notes, then sorted by latest update.

`DELETE /api/notes/:id` moves a note to Trash by setting `isTrashed` and `trashedAt`. Use `PATCH /api/notes/:id/restore` to restore it, or `DELETE /api/notes/:id/permanent` to permanently delete it from Trash.

## Environment Variables

Create `server/.env` from `server/.env.example`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fullstack-notes-app
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
JWT_COOKIE_NAME=token
CLIENT_URL=http://localhost:5173
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Setup

1. Install backend dependencies:

```bash
cd server
npm install
```

2. Install frontend dependencies:

```bash
cd ../client
npm install
```

3. Start MongoDB locally, or use MongoDB Atlas and update `MONGO_URI`.

4. Start the backend:

```bash
cd server
npm run dev
```

5. Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

Frontend runs at `http://localhost:5173`. Backend runs at `http://localhost:5000`.

## Run Instructions

Start backend:

```bash
cd server
npm run dev
```

Start frontend:

```bash
cd client
npm run dev
```

Build frontend for production:

```bash
cd client
npm run build
```

## Deployment Notes

Backend deployment:

- Deploy `server` to Render, Railway, Fly.io, or another Node host.
- Add production env vars: `NODE_ENV=production`, `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_COOKIE_NAME`, and `CLIENT_URL`.
- Use a MongoDB Atlas connection string for `MONGO_URI`.
- Set the start command to `npm start`.

Frontend deployment:

- Deploy `client` to Vercel, Netlify, or another static host.
- Set `VITE_API_URL` to your deployed backend URL plus `/api`.
- Build command: `npm run build`.
- Output directory: `dist`.

Cookie/CORS production checklist:

- `CLIENT_URL` must exactly match the deployed frontend origin.
- The frontend API requests already use `withCredentials: true`.
- In production, auth cookies use `secure: true` and `sameSite: none`, so HTTPS is required.

## Useful Commands

Backend:

```bash
npm run dev
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```
