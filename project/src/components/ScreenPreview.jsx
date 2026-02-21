import React, { useEffect, useRef, useState, useCallback } from 'react';

export default function ScreenPreview({ stream }) {
    const videoRef = useRef(null);
    const wrapperRef = useRef(null);
    const [meta, setMeta] = useState({ resolution: null, surface: null });
    const [isFullscreen, setIsFullscreen] = useState(false);

    const isSameScreen = meta.surface === 'monitor' || meta.surface === 'browser';

    const toggleFullscreen = useCallback(() => {
        if (!wrapperRef.current) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            wrapperRef.current.requestFullscreen?.();
        }
    }, []);

    useEffect(() => {
        const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFsChange);
        return () => document.removeEventListener('fullscreenchange', onFsChange);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (stream) {
            video.srcObject = stream;

            const track = stream.getVideoTracks()[0];
            const settings = track.getSettings();
            setMeta({
                resolution: settings.width && settings.height
                    ? `${settings.width} × ${settings.height}`
                    : null,
                surface: settings.displaySurface ?? null,
            });
        } else {
            video.srcObject = null;
        }

        return () => {
            if (video) video.srcObject = null;
        };
    }, [stream]);

    if (!stream) return null;

    return (
        <div className="preview-container" ref={wrapperRef}>
            <div className="preview-wrapper">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="preview-video"
                />
                <div className="preview-overlay">
                    <span className="overlay-tag overlay-tag--live">
                        <span className="pulse-dot" />
                        LIVE
                    </span>
                    {meta.resolution && (
                        <span className="overlay-tag">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            </svg>
                            {meta.resolution}
                        </span>
                    )}
                    {meta.surface && (
                        <span className="overlay-tag" style={{ textTransform: 'capitalize' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                            {meta.surface}
                        </span>
                    )}
                </div>
                {!isSameScreen && (
                    <button
                        className={`fullscreen-btn${isFullscreen ? ' fullscreen-btn--active' : ''}`}
                        onClick={toggleFullscreen}
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    >
                        {isFullscreen ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="4 14 10 14 10 20" />
                                <polyline points="20 10 14 10 14 4" />
                                <line x1="14" y1="10" x2="21" y2="3" />
                                <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 3 21 3 21 9" />
                                <polyline points="9 21 3 21 3 15" />
                                <line x1="21" y1="3" x2="14" y2="10" />
                                <line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
