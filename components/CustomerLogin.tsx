import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface CustomerLoginProps {
  onLogin: () => void;
  onAdminAccess: () => void;
}

export const CustomerLogin: React.FC<CustomerLoginProps> = ({ onLogin, onAdminAccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cellNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Keyboard shortcut for admin access (Ctrl+Alt+P)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === 'p') {
        event.preventDefault();
        onAdminAccess();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAdminAccess]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Get stored users
    const users = JSON.parse(localStorage.getItem('smartwash-users') || '[]');
    const user = users.find((u: any) => u.email === loginData.email && u.password === loginData.password);

    if (user) {
      localStorage.setItem('smartwash-current-user', JSON.stringify({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        cellNumber: user.cellNumber
      }));
      onLogin();
    } else {
      setError('Invalid email or password');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Cellphone validation: only numeric and exactly 11 digits
    const cellNumberRegex = /^\d{11}$/;
    if (!cellNumberRegex.test(registerData.cellNumber)) {
      setError('Cell number must be exactly 11 digits and contain only numbers');
      return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('smartwash-users') || '[]');

    // Check if user already exists
    if (users.some((u: any) => u.email === registerData.email)) {
      setError('An account with this email already exists');
      return;
    }

    // Create new user
    const newUser = {
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      cellNumber: registerData.cellNumber,
      password: registerData.password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('smartwash-users', JSON.stringify(users));

    // Automatically log in the user after successful registration
    localStorage.setItem('smartwash-current-user', JSON.stringify({
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      cellNumber: newUser.cellNumber
    }));

    setSuccess('Account created successfully! You are now logged in.');
    setRegisterData({
      firstName: '',
      lastName: '',
      email: '',
      cellNumber: '',
      password: '',
      confirmPassword: ''
    });

    // Call onLogin to update the app state
    setTimeout(() => {
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-normal text-black mb-2">Welcome to SmartWash</h1>
          <p className="text-gray-600">Professional Laundry Service</p>
        </div>
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-6">
              {activeTab === 'register' && (
                <button
                  onClick={() => setActiveTab('login')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  type="button"
                  aria-label="Go back to login"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Back</span>
                </button>
              )}
            </div>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                <div>
                  <Label htmlFor="login-email">Email Address</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="register-email">Email Address</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cellNumber">Cell Number</Label>
                  <Input
                    id="cellNumber"
                    type="tel"
                    value={registerData.cellNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                      if (value.length <= 11) {
                        setRegisterData(prev => ({ ...prev, cellNumber: value }));
                      }
                    }}
                    placeholder="09123456789"
                    required
                    maxLength={11}
                  />
                </div>
                <div>
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Create a password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};