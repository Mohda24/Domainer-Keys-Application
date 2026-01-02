import React, { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const GenerateKey = () => {
    const [generatedKey, setGeneratedKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // success | error

    const generateRandomString = (length) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleGenerate = async () => {
        setLoading(true);
        setStatus(null);

        // APP-YYYYMMDD-XXXX-XXXX
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const part1 = generateRandomString(4);
        const part2 = generateRandomString(4);

        const newKey = `APP-${date}-${part1}-${part2}`;

        try {
            // Using setDoc with the key as the ID ensures uniqueness efficiently
            // If it theoretically existed, it would overwrite, but collision probability is low enough
            // and we can check if we wanted to be 100% strict, but for this use case:
            await setDoc(doc(db, "license_keys", newKey), {
                valid: true,
                used: false,
                createdAt: serverTimestamp(),
                usedAt: null
            });

            setGeneratedKey(newKey);
            setStatus('success');
        } catch (error) {
            console.error("Error creating key:", error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedKey) {
            navigator.clipboard.writeText(generatedKey);
            // Could add a toast here
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Generate New License Key</h2>

            <div className="card">
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Click below to generate a new unique license key. The key will be immediately saved to the database.
                </p>

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
                >
                    {loading ? 'Generating...' : 'Generate Key'}
                </button>

                {generatedKey && (
                    <div className="animate-fade-in" style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            Generated Key:
                        </p>
                        <div style={{
                            background: 'var(--bg-body)',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            fontFamily: 'monospace',
                            fontSize: '1.5rem',
                            letterSpacing: '1px',
                            color: 'var(--success)',
                            marginBottom: '1rem',
                            wordBreak: 'break-all'
                        }}>
                            {generatedKey}
                        </div>

                        <button onClick={copyToClipboard} className="btn" style={{
                            background: 'var(--bg-body)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-primary)'
                        }}>
                            📋 Copy to Clipboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateKey;
