import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <div className="card home-card">
                <h1>404</h1>

                <p>
                    You seem to have reached a page that doesn't exist.
                </p>

                <div className="action-row">
                    <Button
                        id="btn-go-home"
                        onClick={() => navigate('/')}
                        aria-label="Return to home page"
                    >
                        Go to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
