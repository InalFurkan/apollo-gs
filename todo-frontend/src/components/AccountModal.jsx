import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AccountModal = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    // TODO: Implement change password API call
    setTimeout(() => {
      setSuccess(true);
      setShowChangePassword(false);
      setOldPassword('');
      setNewPassword('');
    }, 1000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col items-center mb-4">
          {/* Avatar icon */}
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-lg font-semibold text-gray-800">{user?.name || 'User'}</div>
          <div className="text-sm text-gray-500">{user?.email}</div>
        </div>
        <button
          className="w-full mb-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
          onClick={() => setShowChangePassword((v) => !v)}
        >
          Change Password
        </button>
        {showChangePassword && (
          <form onSubmit={handleChangePassword} className="mb-2">
            <input
              type="password"
              placeholder="Old password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className="block w-full mb-2 px-3 py-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="block w-full mb-2 px-3 py-2 border rounded"
              required
            />
            <button type="submit" className="w-full px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 text-sm">Save</button>
          </form>
        )}
        {success && <div className="text-green-600 text-sm mb-2">Password changed!</div>}
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <button
          className="w-full px-4 py-2 rounded bg-red-100 hover:bg-red-200 text-red-700 text-sm mt-2"
          onClick={logout}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default AccountModal;
