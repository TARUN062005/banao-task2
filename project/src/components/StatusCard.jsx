import React, { useMemo, useState, useEffect, useRef } from 'react';

const STATUS_CONFIG = {
    idle: {
        label: 'Ready',
        badgeClass: 'neutral',
        message: 'Click "Start Capture" to begin the screen sharing test.',
    },
    requesting: {
        label: 'Requesting Permission…',
        badgeClass: 'requesting',
        message: 'A browser prompt has appeared. Select a screen, window, or tab to continue.',
    },
    granted: {
        label: 'Stream Active',
        badgeClass: 'active',
        message: 'Your screen is being captured locally. No data leaves your device.',
    },
    denied: {
        label: 'Permission Denied',
        badgeClass: 'error',
        message: 'Access was denied. Please click Retry and allow the screen sharing request.',
    },
    cancelled: {
        label: 'Selection Cancelled',
        badgeClass: 'ended',
        message: 'The screen picker was closed without a selection. Click Retry to try again.',
    },
    error: {
        label: 'Error',
        badgeClass: 'error',
        message: null,
    },
    ended: {
        label: 'Session Ended',
        badgeClass: 'ended',
        message: 'Screen sharing has stopped. You can retry or return to the home page.',
    },
    unsupported: {
        label: 'Unsupported',
        badgeClass: 'error',
        message: 'This browser does not support the Screen Capture API. Please use Chrome or Edge on desktop.',
    },
};

export default function StatusCard({ status, error, stream }) {
    const config = STATUS_CONFIG[status] ?? { label: 'Unknown', badgeClass: '', message: '' };
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
        <div className="status-card">
            <span className={`status-badge ${config.badgeClass}`}>{config.label}</span>
            <p className="status-message">{message}</p>

            {streamMeta && (
                <div className="stream-meta">
                    {liveSince && (
                        <span className="meta-chip meta-chip--live">🕐 Live since {liveSince}</span>
                    )}
                    {streamMeta.resolution && (
                        <span className="meta-chip">📐 {streamMeta.resolution}</span>
                    )}
                    {streamMeta.surface && (
                        <span className="meta-chip" style={{ textTransform: 'capitalize' }}>
                            🖥 {streamMeta.surface}
                        </span>
                    )}
                    {streamMeta.fps && (
                        <span className="meta-chip">⚡ {streamMeta.fps} fps</span>
                    )}
                </div>
            )}

            {showSurfaceTip && (
                <p className="surface-tip">
                    💡 Tip: Share a different window to avoid the mirror effect.
                </p>
            )}
        </div>
    );
}
