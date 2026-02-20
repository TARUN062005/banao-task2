import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScreenShare } from '../hooks/useScreenShare';
import Button from '../components/Button';
import StatusCard from '../components/StatusCard';
import ScreenPreview from '../components/ScreenPreview';

const RETRY_STATUSES = ['ended', 'denied', 'cancelled', 'error'];

export default function ScreenTest() {
    const navigate = useNavigate();
    const { stream, status, error, startSharing, stopSharing, reset } = useScreenShare();

    const handleRetry = useCallback(() => {
        reset();
        startSharing();
    }, [reset, startSharing]);

    // Keyboard: Enter on idle triggers start — only when no interactive element is focused
    useEffect(() => {
        const INTERACTIVE = ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'A'];
        const onKey = (e) => {
            if (status !== 'idle') return;
            if (INTERACTIVE.includes(document.activeElement?.tagName)) return;
            if (e.key === 'Enter') {
                e.preventDefault();
                startSharing();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [status, startSharing]);

    return (
        <div className="container">
            <div className="card">
                <h2>Screen Share Test</h2>

                <StatusCard status={status} error={error} stream={stream} />

                <div className="preview-slot">
                    {status === 'granted' && stream && (
                        <ScreenPreview stream={stream} />
                    )}
                </div>

                <div className="action-row">
                    {status === 'idle' && (
                        <>
                            <Button
                                id="btn-start"
                                onClick={startSharing}
                                aria-label="Start screen capture test"
                            >
                                Start Capture
                            </Button>
                            <Button
                                id="btn-back-idle"
                                variant="secondary"
                                onClick={() => navigate('/')}
                                aria-label="Go back to home page"
                            >
                                Back
                            </Button>
                        </>
                    )}

                    {status === 'requesting' && (
                        <div
                            className="spinner-row"
                            role="status"
                            aria-live="polite"
                            aria-label="Waiting for screen picker"
                        >
                            <span className="spinner" aria-hidden="true" />
                            <span className="spinner-label">Waiting for browser picker…</span>
                        </div>
                    )}

                    {status === 'granted' && (
                        <Button
                            id="btn-stop"
                            variant="danger"
                            onClick={stopSharing}
                            aria-label="Stop screen sharing"
                        >
                            Stop Sharing
                        </Button>
                    )}

                    {RETRY_STATUSES.includes(status) && (
                        <>
                            <Button
                                id="btn-retry"
                                onClick={handleRetry}
                                aria-label="Retry screen capture test"
                            >
                                Retry Test
                            </Button>
                            <Button
                                id="btn-back"
                                variant="secondary"
                                onClick={() => navigate('/')}
                                aria-label="Return to home page"
                            >
                                Back to Home
                            </Button>
                        </>
                    )}
                </div>

                <p className="privacy-note" aria-label="Privacy assurance">
                    {status !== 'granted' && status !== 'requesting'
                        ? '🔒 Nothing is recorded or transmitted. Preview is local only.'
                        : '\u00A0'}
                </p>
            </div>
        </div>
    );
}
