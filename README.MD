# Screen Share Test App

A polished frontend application that verifies browser screen-sharing capabilities using the native Screen Capture API.  
Built with React + Vite — featuring local authentication, light/dark theming, responsive design, and production-ready UX — with no backend and no recording.

## 🔗 Live Demo

https://screen-share-test-three.vercel.app/

---

## ✨ Features

### Core
- Full screen-sharing permission flow with `getDisplayMedia`
- Live local preview — no recording, no upload, 100% private
- Detailed metadata display (resolution, surface type, FPS)
- Explicit state handling for all scenarios (idle, requesting, granted, denied, cancelled, ended, error)
- Retry with fresh media stream
- Automatic cleanup on stop or navigation

### Authentication
- **Sign In / Sign Up** — local user registration with SHA-256 password hashing (via `crypto.subtle`)
- **Demo Credentials** — one-click button to auto-fill `demo / demo1234` for instant testing
- **Protected Routes** — `/screen-test` requires login; unauthenticated users are redirected to `/login`
- **Session Persistence** — user sessions stored in `localStorage`

### UI / UX
- **Light / Dark Mode Toggle** — persisted in `localStorage`, with full CSS variable theming
- **Background Image** — subtle `bg.jpg` overlay in the hero section with tunable opacity
- **Transparent Navbar** — glassmorphism header that blends seamlessly with the hero
- **Red Dot Tab Indicator** — browser tab title shows 🔴 while screen sharing is active
- **Smart Fullscreen** — fullscreen button hidden when sharing current screen/tab (avoids mirror recursion), only appears on hover
- **Responsive Design** — optimised breakpoints at 768px, 600px, and 380px with horizontal feature cards on mobile
- **Smooth Animations** — cubic-bezier entrance animations, slide-in overlay tags, reduced glow for comfort
- **Accessibility** — ARIA labels, focus states, semantic HTML, keyboard-friendly controls

---

## 🧠 Robustness Enhancements

### ✅ Double-Launch Protection
Prevents multiple simultaneous picker dialogs if the start button is triggered repeatedly.

### ✅ Comprehensive Error Handling
Handles `NotAllowedError`, `AbortError`, `NotFoundError`, `NotReadableError`, `OverconstrainedError`, and `SecurityError` — each with a user-friendly message.

### ✅ Hall-of-Mirrors UX Tip
Provides guidance to avoid infinite preview recursion when sharing the same tab.

### ✅ Stream Activity Indicator
Displays a live timestamp showing the session is active without heavy processing.

### ✅ Browser Tab Sharing Indicator
Red dot 🔴 appears in the browser tab title when screen sharing is active and disappears when stopped.

> Note: Advanced experimental APIs such as `CaptureController` were intentionally not used to maximize cross-browser stability.

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| React Router v7 | Client-side routing |
| Web Crypto API | SHA-256 password hashing |
| Screen Capture API | `getDisplayMedia` for screen sharing |
| Plain CSS | Custom theming with CSS variables (no UI libraries) |
| localStorage | User sessions & theme persistence |

---

## 🔄 Screen Sharing Flow

1. User clicks **Start Screen Test**
2. App verifies browser support for `getDisplayMedia`
3. Browser displays the screen picker dialog
4. On selection:
   - Stream is attached to `<video>` element
   - Metadata extracted via `track.getSettings()`
   - Browser tab title shows 🔴 indicator
   - Lifecycle listeners activated
5. When sharing stops:
   - UI updates immediately
   - Tracks are stopped & resources released
   - Tab title reverts to normal
6. User can retry or return home

---

## 🔐 Authentication Flow

1. User visits the app and clicks **Sign In to Start** or navigates to `/login`
2. Can **Sign Up** with a new username/password (min 6 chars, SHA-256 hashed)
3. Or click **Use Demo Credentials** to auto-fill `demo / demo1234`
4. On successful login, redirected to `/screen-test`
5. Protected routes redirect unauthenticated users to `/login`
6. Users can **Sign Out** from the navbar

---

## 🎨 Theming

The app supports **Light** and **Dark** mode:

| Setting | Dark Mode | Light Mode |
|---------|-----------|------------|
| Background | `#0b1120` (deep navy) | `#f4f7fb` (soft white) |
| Surfaces | `#131e30`, `#1c2b42` | `#ffffff`, `#eef2f8` |
| Primary | `#4f8ef7` | `#2563eb` |
| Text | `#e8eef6` | `#1e293b` |

Toggle is in the navbar and persists via `localStorage`.  
The `bg.jpg` hero background opacity is tunable in CSS:
- Dark: `.hero-bg-image { opacity: .30 }`
- Light: `[data-theme="light"] .hero-bg-image { opacity: .25 }`

---

## � Privacy & Security

- No data leaves the device
- No recording performed
- No storage of captured content
- Stream exists only in memory
- User-initiated permission required
- Passwords hashed with SHA-256 before storage

---

## ⚙️ Setup Instructions

Clone the repository and install dependencies:

```bash
cd project
npm install
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
```

Output directory: `dist/`

---

## 🌐 Browser Support

**Supported:**
- Google Chrome (Desktop)
- Microsoft Edge (Desktop)

**Limited or unsupported:**
- Mobile browsers (Screen Capture API not available)
- Safari (partial support)
- Older browsers without Screen Capture API

Production deployments require HTTPS (localhost is exempt).

---

## ⚠️ Known Limitations & Browser Quirks

- Screen capture is not available on most mobile devices
- Sharing the current tab may cause a mirror effect (fullscreen button is auto-hidden)
- Some browsers do not expose `displaySurface` metadata
- Permission prompts must be triggered by a user gesture
- OS-level privacy settings can block capture

---

## 📂 Project Structure

```
project/
├── public/
│   ├── bg.jpg                    # Hero background image (1600×896)
│   └── share.png                 # App favicon
├── src/
│   ├── auth/
│   │   ├── auth.js               # User registration, login, SHA-256 hashing, demo user seeding
│   │   └── ProtectedRoute.jsx    # Route guard — redirects to /login if unauthenticated
│   ├── components/
│   │   ├── Button.jsx            # Reusable button (supports type prop for form submission)
│   │   ├── Card.jsx              # Reusable card container
│   │   ├── Input.jsx             # Reusable input with label, error state, accessibility
│   │   ├── ScreenPreview.jsx     # Video preview with LIVE overlay, metadata tags, smart fullscreen
│   │   └── StatusCard.jsx        # State display & metadata chips
│   ├── hooks/
│   │   └── useScreenShare.js     # Screen capture logic, lifecycle, error handling, tab title indicator
│   ├── pages/
│   │   ├── Home.jsx              # Landing page with hero, features, theme toggle, bg image
│   │   ├── Login.jsx             # Sign In / Sign Up with demo credentials button
│   │   ├── NotFound.jsx          # 404 page
│   │   └── ScreenTest.jsx        # Core screen sharing test interface
│   ├── App.jsx                   # Router configuration with protected routes
│   ├── main.jsx                  # Entry point
│   └── styles.css                # Global styles — light/dark theming, responsive breakpoints, animations
├── index.html                    # HTML entry with meta tags, fonts, favicon
├── vite.config.js                # Vite configuration
├── vercel.json                   # Vercel SPA routing config
└── package.json                  # Dependencies & scripts
```

---

## 🎯 Design Goals

- Correctness over visual complexity
- Predictable state transitions with clear user feedback
- Clean separation of concerns (hooks, components, pages, auth)
- Developer-friendly, well-organised structure
- Production-safe resource handling & cleanup
- Accessible, responsive, and visually polished UX
- Privacy-first architecture — zero data leaves the device

---

## 🧪 Manual Testing Checklist

### Screen Sharing
- [ ] Grant permission → preview starts with LIVE indicator
- [ ] Cancel picker → cancelled state shown
- [ ] Deny permission → denied state shown
- [ ] Stop sharing via browser UI → session ends immediately
- [ ] Retry → new stream created
- [ ] Navigate away → capture stops automatically
- [ ] Browser tab shows 🔴 during active sharing
- [ ] Fullscreen button hidden when sharing current monitor/tab

### Authentication
- [ ] Sign Up with new username → success message shown
- [ ] Sign In with registered credentials → redirect to /screen-test
- [ ] Use Demo Credentials button → fields auto-filled
- [ ] Access /screen-test without login → redirect to /login
- [ ] Sign Out → session cleared

### Theming
- [ ] Toggle dark ↔ light mode → theme switches
- [ ] Refresh page → theme persists
- [ ] All pages readable in both themes

### Responsive
- [ ] Desktop (>768px) → full layout
- [ ] Tablet (600–768px) → 2-column features
- [ ] Mobile (<600px) → stacked layout, horizontal feature cards
- [ ] Small screens (<380px) → compact sizing

---

## 🚀 Deployment

Deployed on **Vercel** as a static site.

| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## 📄 License

This project is provided for demonstration and evaluation purposes.
