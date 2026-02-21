import React, { useMemo, useState, useEffect, useRef } from 'react';

const STATUS_CONFIG = {
    idle: {
        label: 'Ready',
        badgeClass: 'neutral',
        message: 'Click "Start Capture" to begin the screen sharing test.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
    },
    requesting: {
        label: 'Requesting Permission…',
        badgeClass: 'requesting',
        message: 'A browser prompt has appeared. Select a screen, window, or tab to continue.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
    },
    granted: {
        label: 'Stream Active',
        badgeClass: 'active',
        message: 'Your screen is being captured locally. No data leaves your device.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
    denied: {
        label: 'Permission Denied',
        badgeClass: 'error',
        message: 'Access was denied. Please click Retry and allow the screen sharing request.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
    },
    cancelled: {
        label: 'Selection Cancelled',
        badgeClass: 'ended',
        message: 'The screen picker was closed without a selection. Click Retry to try again.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
        ),
    },
    error: {
        label: 'Error',
        badgeClass: 'error',
        message: null,
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
    },
    ended: {
        label: 'Session Ended',
        badgeClass: 'ended',
        message: 'Screen sharing has stopped. You can retry or return to the home page.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
    },
    unsupported: {
        label: 'Unsupported',
        badgeClass: 'error',
        message: 'This browser does not support the Screen Capture API. Please use Chrome or Edge on desktop.',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        ),
    },
};

export default function StatusCard({ status, error, stream }) {
    const config = STATUS_CONFIG[status] ?? { label: 'Unknown', badgeClass: '', message: '', icon: null };
    const message = config.message ?? error ?? 'An unknown error occurred.';
    const startTimeRef = useRef(null);
    const [liveSince, setLiveSince] = useState(null);

    useEffect(() => {
        if (status !== 'granted') {
            startTimeRef.current = null;
            setLiveSince(null);
            return;
        }

        if (!startTimeRef.current) {
            startTimeRef.current = new Date();
        }

        const formatTime = (date) =>
            date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        setLiveSince(formatTime(startTimeRef.current));

        const id = setInterval(() => {
            setLiveSince(formatTime(startTimeRef.current));
        }, 1000);

        return () => clearInterval(id);
    }, [status]);

    const streamMeta = useMemo(() => {
        if (status !== 'granted' || !stream) return null;
        const track = stream.getVideoTracks()[0];
        const s = track.getSettings();
        return {
            resolution: s.width && s.height ? `${s.width} × ${s.height}` : null,
            surface: s.displaySurface ?? null,
            fps: s.frameRate ? Math.round(s.frameRate) : null,
        };
    }, [status, stream]);

    const showSurfaceTip = streamMeta?.surface === 'browser';

    return (
        <div className={`status-card status-card--${config.badgeClass}`}>
            <div className="status-card-header">
                <div className={`status-icon-ring status-icon-ring--${config.badgeClass}`}>
                    {config.icon}
                </div>
                <div className="status-card-info">
                    <span className={`status-badge ${config.badgeClass}`}>{config.label}</span>
                    <p className="status-message">{message}</p>
                </div>
            </div>

            {streamMeta && (
                <div className="stream-meta">
                    {liveSince && (
                        <div className="meta-chip meta-chip--live">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            Live since {liveSince}
                        </div>
                    )}
                    {streamMeta.resolution && (
                        <div className="meta-chip">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                            {streamMeta.resolution}
                        </div>
                    )}
                    {streamMeta.surface && (
                        <div className="meta-chip" style={{ textTransform: 'capitalize' }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                            {streamMeta.surface}
                        </div>
                    )}
                    {streamMeta.fps && (
                        <div className="meta-chip">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                            </svg>
                            {streamMeta.fps} fps
                        </div>
                    )}
                </div>
            )}

            {showSurfaceTip && (
                <div className="surface-tip">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Tip: Share a different window to avoid the mirror effect.
                </div>
            )}
        </div>
    );
}
