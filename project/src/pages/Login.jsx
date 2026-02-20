import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, seedDemoUser, getAuthUser } from '../auth/auth';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function Login() {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        seedDemoUser();
        if (getAuthUser()) {
            navigate('/screen-test', { replace: true });
        }
    }, [navigate]);

    function fillDemo() {
        setUsername('demo');
        setPassword('demo1234');
        setConfirmPassword('');
        setError('');
        setSuccess('');
        setIsSignUp(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password.');
            return;
        }

        if (isSignUp) {
            if (password.length < 6) {
                setError('Password must be at least 6 characters.');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }

            setLoading(true);
            const result = await registerUser(username.trim(), password);
            setLoading(false);

            if (result.success) {
                setSuccess('Account created! You can now sign in.');
                setIsSignUp(false);
                setPassword('');
                setConfirmPassword('');
            } else {
                setError(result.error);
            }
        } else {
            setLoading(true);
            const result = await loginUser(username.trim(), password);
            setLoading(false);

            if (result.success) {
                navigate('/screen-test', { replace: true });
            } else {
                setError(result.error);
            }
        }
    }

    function toggleMode() {
        setIsSignUp((prev) => !prev);
        setError('');
        setSuccess('');
        setConfirmPassword('');
    }

    return (
        <div className="container">
            <Card className="login-card">
                <div className="login-header">
                    <div className="login-icon" aria-hidden="true">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {isSignUp ? (
                                <>
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="8.5" cy="7" r="4" />
                                    <line x1="20" y1="8" x2="20" y2="14" />
                                    <line x1="23" y1="11" x2="17" y2="11" />
                                </>
                            ) : (
                                <>
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </>
                            )}
                        </svg>
                    </div>
                    <h1 className="login-title">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="login-subtitle">
                        {isSignUp
                            ? 'Sign up to access the Screen Share Test'
                            : 'Sign in to access the Screen Share Test'}
                    </p>
                </div>

                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <Input
                        id="login-username"
                        label="Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        disabled={loading}
                        autoComplete="username"
                    />

                    <Input
                        id="login-password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isSignUp ? 'Create a password (min 6 chars)' : 'Enter your password'}
                        disabled={loading}
                        autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    />

                    {isSignUp && (
                        <Input
                            id="login-confirm-password"
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            disabled={loading}
                            autoComplete="new-password"
                        />
                    )}

                    {error && (
                        <div className="login-error" role="alert">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="login-success" role="status">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                            <span>{success}</span>
                        </div>
                    )}

                    <Button
                        id="btn-login"
                        type="submit"
                        disabled={loading}
                        className={`login-btn${loading ? ' login-btn--loading' : ''}`}
                        aria-label={isSignUp ? 'Create account' : 'Sign in'}
                    >
                        {loading ? (
                            <span className="login-spinner-row">
                                <span className="spinner" aria-hidden="true" />
                                {isSignUp ? 'Creating account…' : 'Signing in…'}
                            </span>
                        ) : isSignUp ? (
                            'Create Account'
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>

                <div className="login-toggle">
                    <span className="login-toggle-text">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    </span>
                    <button
                        type="button"
                        className="login-toggle-btn"
                        onClick={toggleMode}
                    >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </div>

                {!isSignUp && (
                    <div className="login-demo-hint">
                        <span className="login-demo-label">Try it out instantly</span>
                        <button
                            type="button"
                            className="login-demo-btn"
                            onClick={fillDemo}
                            aria-label="Auto-fill demo credentials"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                            </svg>
                            Use Demo Credentials
                        </button>
                    </div>
                )}

                <button
                    type="button"
                    className="login-back-link"
                    onClick={() => navigate('/')}
                    aria-label="Return to home page"
                >
                    ← Back to Home
                </button>
            </Card>
        </div>
    );
}
