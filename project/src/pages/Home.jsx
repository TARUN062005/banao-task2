import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function Home() {
    const navigate = useNavigate();
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        setIsSupported(!!navigator.mediaDevices?.getDisplayMedia);
    }, []);

    return (
        <div className="container">
            <div className="card home-card">
                <h1>Screen Share Test App</h1>

                <p>
                    Verifies your browser&apos;s screen-sharing capabilities using the native
                    Screen Capture API. No data leaves your device.
                </p>

                <div className="trust-row">
                    <span className="trust-chip">🔒 No recording</span>
                    <span className="trust-chip">🚫 No upload</span>
                    <span className="trust-chip">💡 Local preview only</span>
                </div>

                {!isSupported && (
                    <div className="unsupported-banner" role="alert">
                        ⚠️ Screen sharing is not available in this browser.
                        Please open in <strong>Chrome</strong> or <strong>Edge</strong> on a desktop device.
                    </div>
                )}

                <div className="action-row">
                    <Button
                        id="btn-start-test"
                        onClick={() => navigate('/screen-test')}
                        disabled={!isSupported}
                        className={isSupported ? 'btn-pulse' : ''}
                        aria-label="Begin screen sharing test"
                        aria-disabled={!isSupported}
                    >
                        Start Screen Test
                    </Button>
                </div>

                {isSupported && (
                    <p className="hint-text">
                        Press <kbd>Enter</kbd> to start after navigating to the test page.
                    </p>
                )}
            </div>
        </div>
    );
}
