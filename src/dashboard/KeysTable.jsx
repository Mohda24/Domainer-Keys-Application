import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const KeysTable = () => {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const q = query(collection(db, "license_keys"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const keysData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setKeys(keysData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching keys:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleStatus = async (id, field, currentValue) => {
        const keyRef = doc(db, "license_keys", id);
        try {
            await updateDoc(keyRef, {
                [field]: !currentValue
            });
        } catch (error) {
            console.error("Error updating key:", error);
            alert("Failed to update status");
        }
    };

    const filteredKeys = keys.filter(key =>
        key.id.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        return new Date(timestamp.seconds * 1000).toLocaleString();
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading keys...</div>;

    return (
        <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Manage Keys</h2>
                <input
                    type="text"
                    placeholder="Search keys..."
                    className="input"
                    style={{ maxWidth: '300px' }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>License Key</th>
                                <th style={{ padding: '1rem' }}>Created At</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Usage</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredKeys.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No keys found.
                                    </td>
                                </tr>
                            ) : (
                                filteredKeys.map(key => (
                                    <tr key={key.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: '500' }}>
                                            {key.id}
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            {formatDate(key.createdAt)}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                backgroundColor: key.valid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                color: key.valid ? 'var(--success)' : 'var(--error)'
                                            }}>
                                                {key.valid ? 'Valid' : 'Invalid'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                color: key.used ? 'var(--text-secondary)' : 'var(--text-primary)'
                                            }}>
                                                {key.used ? 'Used' : 'Unused'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className="btn"
                                                    style={{
                                                        border: '1px solid var(--border-color)',
                                                        fontSize: '0.75rem',
                                                        backgroundColor: key.valid ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                        color: key.valid ? 'var(--error)' : 'var(--success)'
                                                    }}
                                                    onClick={() => toggleStatus(key.id, 'valid', key.valid)}
                                                >
                                                    {key.valid ? 'Revoke' : 'Activate'}
                                                </button>
                                                <button
                                                    className="btn"
                                                    style={{
                                                        border: '1px solid var(--border-color)',
                                                        fontSize: '0.75rem'
                                                    }}
                                                    onClick={() => toggleStatus(key.id, 'used', key.used)}
                                                >
                                                    {key.used ? 'Mark Unused' : 'Mark Used'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default KeysTable;
