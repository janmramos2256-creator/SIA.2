import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

type AuthMode = 'login' | 'register';

interface FirebaseAuthProps {
  onAdminAccess?: () => void;
  onUserRegistered?: () => void;
}

export const FirebaseAuth: React.FC<FirebaseAuthProps> = ({ onAdminAccess, onUserRegistered }) => {
  const [activeTab, setActiveTab] = useState<AuthMode>('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cellNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!onAdminAccess) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        onAdminAccess();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAdminAccess]);

  const ensureFirebaseAuth = () => {
    if (!window.firebaseAuth) {
      throw new Error('Firebase Auth is not initialized. Refresh the page and try again.');
    }
    return window.firebaseAuth;
  };

  const saveUserToRegistry = async (userData: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role?: string;
    createdAt: string;
  }) => {
    try {
      // Check if user already exists in Firestore
      const existingUser = await window.firebaseDB?.getUserByEmail(userData.email);

      if (!existingUser) {
        // Create new user in Firestore
        await window.firebaseDB?.saveUser(userData);
      } else {
        // Update last login in Firestore
        await window.firebaseDB?.updateUser(existingUser.id, {
          lastLogin: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
      // Fallback to localStorage if Firestore fails
      const existingUsers = JSON.parse(localStorage.getItem('smartwash-registered-users') || '[]');
      const userIndex = existingUsers.findIndex((u: any) => u.email === userData.email);

      if (userIndex === -1) {
        existingUsers.push({
          ...userData,
          role: userData.role || 'customer',
          status: 'active',
          lastLogin: new Date().toISOString(),
          totalBookings: 0,
          totalSpent: 0
        });
      } else {
        existingUsers[userIndex] = {
          ...existingUsers[userIndex],
          lastLogin: new Date().toISOString(),
        };
      }

      localStorage.setItem('smartwash-registered-users', JSON.stringify(existingUsers));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const auth = ensureFirebaseAuth();
      await auth.signIn(loginData.email, loginData.password);
      
      // Try to get existing user data or create minimal entry
      const existingUserData = JSON.parse(localStorage.getItem('smartwash-current-user') || '{}');
      const userData = {
        id: Date.now().toString(),
        firstName: existingUserData.firstName || 'User',
        lastName: existingUserData.lastName || '',
        email: loginData.email,
        phone: existingUserData.cellNumber || '',
        createdAt: existingUserData.createdAt || new Date().toISOString(),
      };
      
      await saveUserToRegistry(userData);
      setSuccess('Logged in successfully.');
      onUserRegistered?.();
    } catch (err: any) {
      setError(err?.message || 'Login failed.');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    try {
      const auth = ensureFirebaseAuth();
      if (!auth.signInWithGoogle) throw new Error('Google sign-in is not available.');
      const result = await auth.signInWithGoogle();
      const user = result?.user;
      if (user?.email) {
        const displayName = (user as { displayName?: string | null }).displayName ?? '';
        const [firstName = '', lastName = ''] = displayName.trim().split(/\s+/);
        const userData = {
          email: user.email,
          firstName,
          lastName,
          cellNumber: '',
          createdAt: new Date().toISOString(),
        };
        
        localStorage.setItem('smartwash-current-user', JSON.stringify(userData));
        
        // Save to registered users registry
        await saveUserToRegistry({
          id: user?.uid || Date.now().toString(),
          firstName,
          lastName,
          email: user.email,
          phone: '',
          createdAt: new Date().toISOString(),
        });
      }
      setSuccess('Signed in with Google successfully.');
      onUserRegistered?.();
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    const cellNumberRegex = /^\d{11}$/;
    if (!cellNumberRegex.test(registerData.cellNumber)) {
      setError('Cell number must be exactly 11 digits and contain only numbers');
      return;
    }

    try {
      const auth = ensureFirebaseAuth();
      const { user } = await auth.signUp(registerData.email, registerData.password);

      // Send verification email
      if (auth.sendEmailVerification && user) {
        await auth.sendEmailVerification(user);
      }

      // Keep existing app flows working (Booking modal prefill, MyAccount, etc.)
      const userData = {
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        cellNumber: registerData.cellNumber,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('smartwash-current-user', JSON.stringify(userData));

      // Save to registered users registry
      await saveUserToRegistry({
        id: user?.uid || Date.now().toString(),
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        phone: registerData.cellNumber,
        createdAt: new Date().toISOString(),
      });

      setSuccess(
        'Account created! Check your email inbox for a verification link. Click it to verify your account.',
      );
      setRegisterData({
        firstName: '',
        lastName: '',
        email: '',
        cellNumber: '',
        password: '',
        confirmPassword: '',
      });
      onUserRegistered?.();
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar with Google sign-in - always visible at the top */}
      <header className="border-b border-gray-200 bg-white px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
          </div>
          <span className="text-xl font-medium" style={{ color: '#2fb5b4' }}>SmartWash</span>
        </div>
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2 h-10 px-4 bg-white border-gray-300 hover:bg-gray-50 text-gray-700 font-medium"
          onClick={handleGoogleSignIn}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </Button>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-normal text-black mb-2">Welcome to SmartWash</h1>
          <p className="text-gray-600">Use the Google button above or continue with email below</p>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">or continue with email</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AuthMode)} className="w-full">
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
            <form onSubmit={(e) => void handleLoginSubmit(e)} className="space-y-4">
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
                  onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
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
                  onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
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
            <form onSubmit={(e) => void handleRegisterSubmit(e)} className="space-y-4">
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
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, lastName: e.target.value }))}
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
                  onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
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
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 11) {
                      setRegisterData((prev) => ({ ...prev, cellNumber: value }));
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
                  onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
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
                  onChange={(e) => setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
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

