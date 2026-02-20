import React, { useEffect, useRef, useState } from 'react';

export default function ScreenPreview({ stream }) {
    const videoRef = useRef(null);
    const [meta, setMeta] = useState({ resolution: null, surface: null });

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
        <div className="preview-wrapper">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="preview-video"
            />
            <div className="preview-overlay">
                <span className="overlay-tag">
                    <span className="pulse-dot" />
                    LIVE
                </span>
                {meta.resolution && (
                    <span className="overlay-tag">{meta.resolution}</span>
                )}
                {meta.surface && (
                    <span className="overlay-tag" style={{ textTransform: 'capitalize' }}>
                        {meta.surface}
                    </span>
                )}
            </div>
        </div>
    );
}
