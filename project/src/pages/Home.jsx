import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthUser, logoutUser } from '../auth/auth';
import { useScreenShareStatus } from '../contexts/ScreenShareContext';
import Button from '../components/Button';

const FEATURES = [
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
        title: 'Screen Capture',
        description: 'Test your browser\'s native Screen Capture API with real-time preview and diagnostics.',
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        title: '100% Private',
        description: 'Everything runs locally in your browser. No data is recorded, uploaded, or transmitted.',
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        title: 'Instant Results',
        description: 'Get immediate feedback on resolution, frame rate, display surface, and stream status.',
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        ),
        title: 'No Setup Needed',
        description: 'Zero dependencies, zero plugins. Works out of the box on modern browsers.',
    },
];

function getStoredTheme() {
    try {
        return localStorage.getItem('theme') || 'dark';
    } catch {
        return 'dark';
    }
}

export default function Home() {
    const navigate = useNavigate();
    const [isSupported, setIsSupported] = useState(true);
    const [authUser, setAuthUser] = useState(null);
    const [theme, setTheme] = useState(getStoredTheme);
    const { status } = useScreenShareStatus();

    useEffect(() => {
        setIsSupported(!!navigator.mediaDevices?.getDisplayMedia);
        setAuthUser(getAuthUser());
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    function handleLogout() {
        logoutUser();
        setAuthUser(null);
    }

    return (
        <div className="home-page">
            {/* Navbar */}
            <nav className="home-nav" aria-label="Main navigation">
                <div className="home-nav-inner">
                    <a href="/" className="home-nav-brand" aria-label="Home">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                        <span>ScreenTest</span>
                        {status === 'granted' && <span className="hero-badge-dot" aria-hidden="true" />}
                    </a>
                    <div className="home-nav-actions">
                        {/* Theme Toggle */}
                        <button
                            type="button"
                            className="theme-toggle"
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            )}
                        </button>

                        {authUser ? (
                            <>
                                <span className="home-nav-user">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    {authUser.username}
                                </span>
                                <button
                                    type="button"
                                    className="home-nav-logout"
                                    onClick={handleLogout}
                                    aria-label="Sign out"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="home-nav-login"
                                onClick={() => navigate('/login')}
                                aria-label="Sign in"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero" aria-labelledby="hero-title">
                <div className="hero-bg-image" aria-hidden="true" />
                <div className="hero-glow" aria-hidden="true" />
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="hero-badge-dot" aria-hidden="true" />
                        Open-Source Screen Diagnostics
                    </div>

                    <h1 id="hero-title" className="hero-title">
                        Screen Share Test App
                        <span className="hero-title-accent"></span>
                    </h1>

                    <p className="hero-description">
                        Verify your browser's screen-sharing capabilities using the native
                        Screen Capture API. Everything runs locally — no recording, no uploads,
                        complete privacy.
                    </p>

                    <div className="hero-trust">
                        <span className="trust-chip">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            No recording
                        </span>
                        <span className="trust-chip">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            No upload
                        </span>
                        <span className="trust-chip">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                            Local preview only
                        </span>
                    </div>

                    {!isSupported && (
                        <div className="unsupported-banner" role="alert">
                            ⚠️ Screen sharing is not available in this browser.
                            Please open in <strong>Chrome</strong> or <strong>Edge</strong> on a desktop device.
                        </div>
                    )}

                    <div className="hero-actions">
                        {authUser ? (
                            <Button
                                id="btn-start-test"
                                onClick={() => navigate('/screen-test')}
                                disabled={!isSupported}
                                className={`hero-btn-primary${isSupported ? ' btn-pulse' : ''}`}
                                aria-label="Begin screen sharing test"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                Start Screen Test
                            </Button>
                        ) : (
                            <>
                                <Button
                                    id="btn-hero-login"
                                    onClick={() => navigate('/login')}
                                    className="hero-btn-primary btn-pulse"
                                    aria-label="Sign in to start testing"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                        <polyline points="10 17 15 12 10 7" />
                                        <line x1="15" y1="12" x2="3" y2="12" />
                                    </svg>
                                    Sign In to Start
                                </Button>
                                <Button
                                    id="btn-hero-test-disabled"
                                    disabled
                                    variant="secondary"
                                    aria-label="Sign in required to start screen test"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    Screen Test (Login Required)
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" aria-labelledby="features-heading">
                <h2 id="features-heading" className="features-heading">
                    Why Use ScreenTest?
                </h2>
                <div className="features-grid">
                    {FEATURES.map((feature) => (
                        <article key={feature.title} className="feature-card">
                            <div className="feature-icon" aria-hidden="true">
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <p className="home-footer-text">
                    Built with React + Vite · No data leaves your device
                </p>
            </footer>
        </div>
    );
}
