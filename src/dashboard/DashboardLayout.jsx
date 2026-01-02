import React from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                backgroundColor: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-color)',
                padding: '1rem 0'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
                        License Admin
                    </h1>
                    <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link
                            to="/dashboard"
                            style={{
                                color: location.pathname === '/dashboard' ? 'var(--primary)' : 'var(--text-secondary)',
                                fontWeight: '500'
                            }}
                        >
                            Generate
                        </Link>
                        <Link
                            to="/dashboard/keys"
                            style={{
                                color: location.pathname === '/dashboard/keys' ? 'var(--primary)' : 'var(--text-secondary)',
                                fontWeight: '500'
                            }}
                        >
                            Manage Keys
                        </Link>
                        <button onClick={handleLogout} className="btn btn-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                            Logout
                        </button>
                    </nav>
                </div>
            </header>

            <main className="container" style={{ flex: 1, padding: '2rem 1rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
