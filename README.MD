# Screen Share Test App

A lightweight frontend application that verifies browser screen-sharing capabilities using the native Screen Capture API.
Built as a robust demonstration of permission handling, media stream lifecycle management, and clean React state architecture — with no backend and no recording.

## 🔗 Live Demo

https://screen-share-test-three.vercel.app/

---

## ✨ Features

* Full screen-sharing permission flow
* Live local preview (no recording, no upload)
* Detailed metadata display (resolution, surface type, FPS)
* Explicit success and failure states
* Retry with fresh media stream
* Automatic cleanup on stop or navigation
* Responsive UI across devices
* Accessibility-friendly controls
* Privacy-first messaging

---

## 🧠 Implemented Robustness Enhancements

In addition to the core requirements, the following stability improvements were implemented:

### ✅ Double-Launch Protection

Prevents multiple simultaneous picker dialogs if the start button is triggered repeatedly.

### ✅ SecurityError Handling

Gracefully handles cases where screen capture is blocked due to lack of user activation or page focus.

### ✅ Hall-of-Mirrors UX Tip

Provides guidance to avoid infinite preview recursion when sharing the same tab.

### ✅ Stream Activity Indicator

Displays a live timestamp showing the session is active without heavy processing.

> Note: Advanced experimental APIs such as `CaptureController` were intentionally not used to maximize cross-browser stability.

---

## 🛠 Tech Stack

* React (Vite, JavaScript)
* Native Browser Web APIs
* Plain CSS (no UI libraries)
* React Router v6

---

## 🔄 Screen Sharing Flow

1. User clicks **Start Screen Test**
2. App verifies browser support for `getDisplayMedia`
3. Browser displays screen picker
4. On selection:

   * Stream is attached to video element
   * Metadata extracted via `track.getSettings()`
   * Lifecycle listeners activated
5. When sharing stops:

   * UI updates immediately
   * Tracks are stopped
   * Resources released
6. User can retry or return home

---

## 🔐 Privacy & Security

* No data leaves the device
* No recording performed
* No storage of captured content
* Stream exists only in memory
* User-initiated permission required

---

## ⚙️ Setup Instructions

Clone the repository and install dependencies:

```bash
npm install
npm install react-router-dom
npm run dev
```

Open:

http://localhost:5173

---

## 🌐 Browser Support

Supported:

* Google Chrome (Desktop)
* Microsoft Edge (Desktop)

Limited or unsupported:

* Mobile browsers
* Safari (partial support)
* Older browsers without Screen Capture API

Production deployments require HTTPS (localhost is exempt).

---

## ⚠️ Known Limitations & Browser Quirks

* Screen capture is not available on most mobile devices
* Sharing the current tab may cause a mirror effect
* Some browsers do not expose display surface metadata
* Permission prompts must be triggered by a user gesture
* OS-level privacy settings can block capture

---

## 📂 Project Structure

```
src/
  hooks/
    useScreenShare.js      # Screen capture logic & lifecycle
  components/
    Button.jsx             # Reusable button component
    StatusCard.jsx         # State display & metadata
    ScreenPreview.jsx      # Video preview renderer
  pages/
    Home.jsx               # Landing page
    ScreenTest.jsx         # Core test interface
  App.jsx                  # Router configuration
  main.jsx                 # Entry point
  styles.css               # Global styling
```

---

## 🎯 Design Goals

* Correctness over visual complexity
* Predictable state transitions
* Clean separation of concerns
* Developer-friendly structure
* Production-safe resource handling
* Accessible and responsive UX

---

## 🚀 Deployment

Deployed on Vercel as a static site.

Build command:

```bash
npm run build
```

Output directory:

```
dist
```

---

## 🧪 Manual Testing Checklist

* Grant permission → preview starts
* Cancel picker → cancelled state shown
* Deny permission → denied state shown
* Stop sharing via browser UI → session ends immediately
* Retry → new stream created
* Navigate away → capture stops automatically

---

## 📄 License

This project is provided for demonstration and evaluation purposes.
