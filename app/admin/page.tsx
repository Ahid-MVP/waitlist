'use client';

import { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminPage() {
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Check if already authenticated
        const auth = sessionStorage.getItem('adminAuth');
        const token = sessionStorage.getItem('adminToken');
        if (auth === 'true' && token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem('adminAuth', 'true');
                sessionStorage.setItem('adminToken', data.token);
                setIsAuthenticated(true);
                router.push('/admin/dashboard');
            } else {
                setError(data.error || 'Invalid password');
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminAuth');
        sessionStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        setPassword('');
    };

    return (
        <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white/80 backdrop-blur-2xl rounded-full shadow-xl border border-gray-200 py-3 px-6">
                        <Image
                            src="/Pokecut_1775139303164.png"
                            alt="ahid logo"
                            width={80}
                            height={80}
                        />
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-10">
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-teal-900">Admin Login</h1>
                            <p className="text-gray-600 text-sm">Enter your password to access the dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-6 py-4 rounded-full border-2 border-gray-200 bg-white/60 backdrop-blur-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-teal-400 text-sm"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                                    <p className="text-red-600 text-sm text-center">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full px-8 py-4 bg-lime-400 hover:bg-lime-500 text-teal-900 rounded-full font-semibold transition-colors text-sm shadow-md ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'opacity-100'
                                    }`}
                            >
                                {isSubmitting ? 'Logging in...' : 'Login ✨'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="text-center mt-6">
                    <a href="/" className="text-gray-600 hover:text-teal-900 text-sm transition-colors">
                        ← Back to home
                    </a>
                </div>
            </div>
        </div>
    );
}