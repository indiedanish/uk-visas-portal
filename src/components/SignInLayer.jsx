import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInUser } from '../services/auth.service';

const SignInLayer = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const userData = await signInUser(email, password);
            login(userData.user, userData.tokens);  // Update auth context


            navigate('/dashboard');  // Redirect on success
        } catch (err) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth bg-base d-flex flex-wrap">
            <div className="auth-left d-lg-block d-none">
                <div className="d-flex align-items-center flex-column h-100 justify-content-center">
                    <img src="assets/images/auth/auth-img.png" alt="Auth illustration" />
                </div>
            </div>
            <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
                <div className="max-w-464-px mx-auto w-100">
                    <Link to="/" className="mb-40 text-center max-w-290-px flex place-self-center">
                        <img src="assets/images/logo.png" alt="Logo" />
                    </Link>
                    <h4 className="mb-12">Sign In to your Account</h4>
                    <p className="mb-32 text-secondary-light text-lg">
                        Welcome back! Please enter your details.
                    </p>
                    {error && <p className="text-danger mb-16">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="icon-field mb-16">
                            <span className="icon top-50 translate-middle-y">
                                <Icon icon="mage:email" />
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control h-56-px bg-neutral-50 radius-12"
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="position-relative mb-20">
                            <div className="icon-field">
                                <span className="icon top-50 translate-middle-y">
                                    <Icon icon="solar:lock-password-outline" />
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control h-56-px bg-neutral-50 radius-12"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                        </div>
                        <div className="d-flex justify-content-between gap-2">
                            <div className="form-check style-check d-flex align-items-center">
                                <input
                                    className="form-check-input border border-neutral-300"
                                    type="checkbox"
                                    id="remember"
                                />
                                <label className="form-check-label" htmlFor="remember">
                                    Remember me
                                </label>
                            </div>
                            <Link to="/forgot-password" className="text-primary-600 fw-medium">
                                Forgot Password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary bg-red border-red text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <div className="mt-32 text-center text-sm">
                        <p className="mb-0">
                            Don’t have an account?{' '}
                            <Link to="/sign-up" className="text-primary-600 fw-semibold">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignInLayer;
