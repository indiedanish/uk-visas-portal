import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signUpUser } from '../services/auth.service';

const SignUpLayer = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { user, tokens } = await signUpUser(formData.name, formData.email, formData.password);
            login(user, tokens);  // Update auth context
            navigate('/dashboard');  // Redirect on success
        } catch (err) {
            setError(err.message || 'Failed to sign up');
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
                    <h4 className="mb-12">Create your Account</h4>
                    <p className="mb-32 text-secondary-light text-lg">
                        Welcome! Please enter your details to sign up.
                    </p>
                    {error && <p className="text-danger mb-16">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="icon-field mb-16">
                            <span className="icon top-50 translate-middle-y">
                                <Icon icon="mdi:user" />
                            </span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control h-56-px bg-neutral-50 radius-12"
                                placeholder="Full Name"
                                required
                            />
                        </div>
                        <div className="icon-field mb-16">
                            <span className="icon top-50 translate-middle-y">
                                <Icon icon="mage:email" />
                            </span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control h-56-px bg-neutral-50 radius-12"
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="icon-field mb-16">
                            <span className="icon top-50 translate-middle-y">
                                <Icon icon="solar:lock-password-outline" />
                            </span>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-control h-56-px bg-neutral-50 radius-12"
                                placeholder="Password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary bg-red border-red text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>
                    <div className="mt-32 text-center text-sm">
                        <p className="mb-0">
                            Already have an account?{' '}
                            <Link to="/sign-in" className="text-primary-600 fw-semibold">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignUpLayer;
