import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => boolean;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      if (onLogin(username, password)) {
        setError('');
      } else {
        setError('Invalid username or password');
      }
    } else {
      setError('Please enter both username and password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black">Admin Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Username</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded text-black"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded text-black"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between gap-2 mt-6">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded text-black hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600 font-bold"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};