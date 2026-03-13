import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutUs } from './components/AboutUs';
import { Services } from './components/Services';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FirebaseAuth } from './components/FirebaseAuth';
import { MyAccount } from './components/MyAccount';
import { useState, useEffect } from 'react';

export interface Service {
  id: string;
  title: string;
  price: number;
  priceUnit: string;
  description: string;
  features: string[];
  status: 'active' | 'inactive';
}

export interface SoapPrices {
  soap: number;
  pabcon: number;
  both: number;
}

export interface Discount {
  id: string;
  name: string;
  description: string;
  active: boolean;
  value?: number; // For percentage discounts
  type: 'percentage' | 'free_deliveries' | 'fixed_amount' | 'free_shipping';
  freeDeliveries?: number; // For free deliveries discount
  code?: string; // Coupon code
  usageLimitPerCustomer?: number;
  eligibility?: 'new_accounts' | 'all';
  expiryDaysAfterCreation?: number;
  minimumOrder?: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'staff';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
  totalBookings: number;
  totalSpent: number;
}

export interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  notes: string;
  paymentMethod: string;
  soapChoice: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'in-transit' | 'completed' | 'cancelled' | 'received';
  createdAt: string;
  deliveryOption?: boolean;
  deliveryDistance?: number;
  deliveryFee?: number;
  totalAmount?: number;
  statusLog?: Array<{
    status: string;
    timestamp: string;
    changedBy: 'admin' | 'customer' | 'system';
  }>;
}

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<{ email?: string | null } | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isMyAccountOpen, setIsMyAccountOpen] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      id: '1',
      name: 'Welcome Discount',
      description: '10% off for new customers',
      active: true,
      value: 10,
      type: 'percentage',
      code: 'WELCOME10',
      usageLimitPerCustomer: 1,
      eligibility: 'new_accounts',
      expiryDaysAfterCreation: 30,
      minimumOrder: 100
    },
    {
      id: '2',
      name: 'Free Delivery',
      description: 'Free delivery on orders over ₱500',
      active: true,
      type: 'free_shipping',
      eligibility: 'all',
      minimumOrder: 500
    },
    {
      id: '3',
      name: 'Bulk Order Discount',
      description: '₱50 off on orders over ₱1000',
      active: false,
      value: 50,
      type: 'fixed_amount',
      eligibility: 'all',
      minimumOrder: 1000
    }
  ]);
  const [users, setUsers] = useState<User[]>([]);
  const [soapPrices, setSoapPrices] = useState<SoapPrices>({ soap: 18, pabcon: 15, both: 30 });

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('smartwash-current-user');
    if (saved) {
      const user = JSON.parse(saved);
      setCurrentUser(user);
      if (user?.email) setCurrentUserEmail(user.email);
    }
  }, []);

  useEffect(() => {
    if (!window.firebaseAuth) return;
    return window.firebaseAuth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      if (!user) {
        setIsAdminView(false);
      } else if (user?.email) {
        // Sync current user from Firebase so My Account shows correct bookings
        setCurrentUserEmail(user.email);
        const saved = localStorage.getItem('smartwash-current-user');
        const parsed = saved ? JSON.parse(saved) : {};
        if (parsed.email !== user.email) {
          const merged = { ...parsed, email: user.email, displayName: (user as any).displayName };
          setCurrentUser(merged);
          localStorage.setItem('smartwash-current-user', JSON.stringify(merged));
        }
      }
    });
  }, []);

  useEffect(() => {
    const savedBookings = localStorage.getItem('smartwash-bookings');
    const savedServices = localStorage.getItem('smartwash-services');
    const savedDiscounts = localStorage.getItem('smartwash-discounts');
    const savedSoapPrices = localStorage.getItem('smartwash-soap-prices');

    if (savedServices) {
      setServices(JSON.parse(savedServices));
    } else {
      const defaultServices: Service[] = [
        {
          id: 'wash-dry-fold',
          title: 'Wash, Dry & Fold',
          price: 150,
          priceUnit: '/kg',
          description: 'Complete laundry service with folding',
          features: ['Washing', 'Drying', 'Folding', 'Basic stain treatment'],
          status: 'active'
        },
        {
          id: 'dry-cleaning',
          title: 'Dry Cleaning',
          price: 200,
          priceUnit: '/piece',
          description: 'Professional dry cleaning for delicate fabrics',
          features: ['Solvent cleaning', 'Pressing', 'Specialized care', 'Protective wrapping'],
          status: 'active'
        },
        {
          id: 'express',
          title: 'Express Service',
          price: 200,
          priceUnit: '/kg',
          description: 'Same-day service for urgent needs',
          features: ['Priority processing', 'Same-day delivery', 'Quality guaranteed', 'Rush fee included'],
          status: 'active'
        }
      ];
      setServices(defaultServices);
      localStorage.setItem('smartwash-services', JSON.stringify(defaultServices));
    }

    if (savedDiscounts) {
      setDiscounts(JSON.parse(savedDiscounts));
    } else {
      const defaultDiscounts: Discount[] = [
        {
          id: 'promotional',
          name: 'Promotional Discount',
          description: 'General promotional discount applied to all services',
          active: false,
          value: 0,
          type: 'percentage'
        },
        {
          id: 'new-user-free-deliveries',
          name: 'New User Free Deliveries',
          description: 'Free deliveries for new customers',
          active: true,
          type: 'free_deliveries',
          freeDeliveries: 2
        },
        {
          id: 'welcome2ship',
          name: 'Welcome Free Shipping',
          description: 'Free shipping for new customers with code WELCOME2SHIP',
          active: true,
          type: 'free_shipping',
          code: 'WELCOME2SHIP',
          usageLimitPerCustomer: 2,
          eligibility: 'new_accounts',
          expiryDaysAfterCreation: 75, // Average of 60-90
          minimumOrder: 150
        }
      ];
      setDiscounts(defaultDiscounts);
      localStorage.setItem('smartwash-discounts', JSON.stringify(defaultDiscounts));
    }

    if (savedSoapPrices) {
      setSoapPrices(JSON.parse(savedSoapPrices));
    } else {
      const defaultSoapPrices: SoapPrices = { soap: 18, pabcon: 15, both: 30 };
      setSoapPrices(defaultSoapPrices);
      localStorage.setItem('smartwash-soap-prices', JSON.stringify(defaultSoapPrices));
    }

    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      const mockBookings: Booking[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john@example.com',
          phone: '09171234567',
          service: 'wash-dry-fold',
          date: '2026-01-25',
          time: '10:00',
          street: '123 Main St',
          city: 'Manila',
          state: 'Metro Manila',
          zip: '1000',
          notes: 'Please use fragrance-free detergent',
          paymentMethod: 'credit-card',
          soapChoice: 'soap',
          status: 'pending',
          createdAt: '2026-01-20T10:30:00',
          totalAmount: 270
        },
        {
          id: '2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah@example.com',
          phone: '09189876543',
          service: 'dry-cleaning',
          date: '2026-01-23',
          time: '14:00',
          street: '456 Oak Ave',
          city: 'Quezon City',
          state: 'Metro Manila',
          zip: '1100',
          notes: 'Suit for wedding',
          paymentMethod: 'cash',
          soapChoice: 'both',
          status: 'confirmed',
          createdAt: '2026-01-19T15:20:00',
          totalAmount: 385
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Davis',
          email: 'mike@example.com',
          phone: '09154567890',
          service: 'express',
          date: '2026-01-22',
          time: '09:00',
          street: '789 Pine Rd',
          city: 'Makati',
          state: 'Metro Manila',
          zip: '1200',
          notes: '',
          paymentMethod: 'credit-card',
          soapChoice: 'soap',
          status: 'in-progress',
          createdAt: '2026-01-21T08:45:00',
          totalAmount: 320
        }
      ];
      setBookings(mockBookings);
      localStorage.setItem('smartwash-bookings', JSON.stringify(mockBookings));
    }

    // Initialize users from Firestore (with localStorage fallback)
    const initializeUsers = async () => {
      try {
        if (window.firebaseDB?.getAllUsers) {
          const firestoreUsers = await window.firebaseDB.getAllUsers();
          if (firestoreUsers.length > 0) {
            setUsers(firestoreUsers);
            return;
          }
        }
      } catch (error) {
        console.error('Error loading users from Firestore:', error);
      }

      // Fallback to localStorage
      const savedUsers = localStorage.getItem('smartwash-registered-users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
        return;
      }

      // Final fallback: mock admin accounts
      const mockAdmins: User[] = [
        {
          id: 'admin-1',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@smartwash.com',
          phone: '09191111111',
          role: 'admin',
          status: 'active',
          createdAt: '2026-01-01T00:00:00',
          lastLogin: '2026-01-25T12:00:00',
          totalBookings: 0,
          totalSpent: 0
        },
        {
          id: 'admin-2',
          firstName: 'Jane',
          lastName: 'Staff',
          email: 'staff@smartwash.com',
          phone: '09192222222',
          role: 'staff',
          status: 'active',
          createdAt: '2026-01-05T09:00:00',
          lastLogin: '2026-01-25T08:30:00',
          totalBookings: 0,
          totalSpent: 0
        }
      ];

      setUsers(mockAdmins);
      localStorage.setItem('smartwash-registered-users', JSON.stringify(mockAdmins));
    };

    initializeUsers();
  }, []);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem('smartwash-bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('smartwash-registered-users', JSON.stringify(users));
    }
  }, [users]);

  // Save services to localStorage whenever they change
  useEffect(() => {
    if (services.length > 0) {
      localStorage.setItem('smartwash-services', JSON.stringify(services));
    }
  }, [services]);

  // Save discount to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('smartwash-discounts', JSON.stringify(discounts));
  }, [discounts]);

  // Save soap prices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('smartwash-soap-prices', JSON.stringify(soapPrices));
  }, [soapPrices]);

  const addBooking = (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    const timestamp = new Date().toISOString();
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: timestamp,
      statusLog: [{
        status: 'pending',
        timestamp: timestamp,
        changedBy: 'system'
      }]
    };
    setBookings([...bookings, newBooking]);
    
    // Update user's booking statistics
    setUsers(users.map(user => {
      if (user.email === booking.email) {
        return {
          ...user,
          totalBookings: user.totalBookings + 1,
          totalSpent: user.totalSpent + (booking.totalAmount || 0)
        };
      }
      return user;
    }));
    
    setIsBookingOpen(false); // Close the booking modal
  };



  const updateBookingStatus = (id: string, status: Booking['status'], changedBy: 'admin' | 'customer' = 'admin') => {
    setBookings(bookings.map(booking => {
      if (booking.id === id) {
        const statusLog = booking.statusLog || [];
        return {
          ...booking,
          status,
          statusLog: [
            ...statusLog,
            {
              status,
              timestamp: new Date().toISOString(),
              changedBy
            }
          ]
        };
      }
      return booking;
    }));
  };

  const deleteBooking = (id: string) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  const updateServices = (newServices: Service[]) => {
    setServices(newServices);
  };

  const updateDiscounts = (newDiscounts: Discount[]) => {
    setDiscounts(newDiscounts);
  };

  const updateSoapPrices = (prices: SoapPrices) => {
    setSoapPrices(prices);
  };

  const updateUsers = async (newUsers: User[]) => {
    setUsers(newUsers);
    // Note: In a real implementation, you'd want to sync all users back to Firestore
    // For now, we'll just update local state
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const updateUserRole = async (id: string, role: User['role']) => {
    try {
      if (window.firebaseDB?.updateUser) {
        await window.firebaseDB.updateUser(id, { role });
      }
      setUsers(users.map(user =>
        user.id === id ? { ...user, role } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
      // Fallback to local state only
      setUsers(users.map(user =>
        user.id === id ? { ...user, role } : user
      ));
    }
  };

  const toggleUserStatus = async (id: string) => {
    const newStatus = users.find(user => user.id === id)?.status === 'active' ? 'inactive' : 'active';
    try {
      if (window.firebaseDB?.updateUser) {
        await window.firebaseDB.updateUser(id, { status: newStatus });
      }
      setUsers(users.map(user =>
        user.id === id
          ? { ...user, status: newStatus }
          : user
      ));
    } catch (error) {
      console.error('Error toggling user status:', error);
      // Fallback to local state only
      setUsers(users.map(user =>
        user.id === id
          ? { ...user, status: newStatus }
          : user
      ));
    }
  };

  const reloadUsers = async () => {
    try {
      if (window.firebaseDB?.getAllUsers) {
        const firestoreUsers = await window.firebaseDB.getAllUsers();
        setUsers(firestoreUsers);
      } else {
        // Fallback to localStorage
        const savedUsers = localStorage.getItem('smartwash-registered-users');
        if (savedUsers) {
          const registeredUsers = JSON.parse(savedUsers);
          setUsers(registeredUsers);
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
      // Fallback to localStorage
      const savedUsers = localStorage.getItem('smartwash-registered-users');
      if (savedUsers) {
        const registeredUsers = JSON.parse(savedUsers);
        setUsers(registeredUsers);
      }
    }
  };

  const adminEmails = (import.meta as any).env?.VITE_ADMIN_EMAILS
    ? String((import.meta as any).env.VITE_ADMIN_EMAILS)
        .split(',')
        .map((s: string) => s.trim().toLowerCase())
        .filter(Boolean)
    : ['admin@smartwash.com'];

  // Check if user is admin either by email or by role
  const isAdmin = !!firebaseUser?.email && (
    adminEmails.includes(String(firebaseUser.email).toLowerCase()) ||
    users.find(user => user.email === firebaseUser.email && user.role === 'admin') !== undefined
  );

  const handleLogout = async () => {
    try {
      await window.firebaseAuth?.signOut();
    } finally {
      localStorage.removeItem('smartwash-current-user');
      setCurrentUserEmail('');
      setCurrentUser(null);
    }
  };

  const handleMarkAsReceived = (id: string) => {
    updateBookingStatus(id, 'received', 'customer');
  };

  if (isAdminView) {
    if (!isAdmin) {
      setIsAdminView(false);
    } else {
      return (
        <AdminDashboard
          bookings={bookings}
          services={services}
          discounts={discounts}
          soapPrices={soapPrices}
          users={users}
          onUpdateStatus={updateBookingStatus}
          onDeleteBooking={deleteBooking}
          onUpdateServices={updateServices}
          onUpdateDiscounts={updateDiscounts}
          onUpdateSoapPrices={updateSoapPrices}
          onUpdateUsers={updateUsers}
          onDeleteUser={deleteUser}
          onUpdateUserRole={updateUserRole}
          onToggleUserStatus={toggleUserStatus}
          onLogout={() => void handleLogout()}
        />
      );
    }
  }

  if (!firebaseUser) {
    return (
      <FirebaseAuth
        onAdminAccess={() => {
          // Optional shortcut (Ctrl+Alt+P) to jump into admin view after login
          setIsAdminView(true);
        }}
        onUserRegistered={reloadUsers}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        onBookingClick={() => setIsBookingOpen(true)}
        onMyAccountClick={() => setIsMyAccountOpen(true)}
        onLogout={() => void handleLogout()}
        showAdminDashboard={isAdmin}
        onAdminDashboardClick={() => setIsAdminView(true)}
        onHomeClick={() => scrollToSection('home')}
        onAboutClick={() => scrollToSection('about')}
        onServicesClick={() => scrollToSection('services')}
      />
      <div id="home">
        <Hero onBookingClick={() => setIsBookingOpen(true)} />
      </div>
      <div id="about">
        <AboutUs />
      </div>
      <div id="services">
        <Services services={services} />
      </div>
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSubmit={addBooking}
        currentUser={currentUser}
        services={services}
        discounts={discounts}
        soapPrices={soapPrices}
      />
      <MyAccount
        isOpen={isMyAccountOpen}
        onClose={() => setIsMyAccountOpen(false)}
        bookings={bookings}
        services={services}
        currentUserEmail={currentUserEmail || firebaseUser?.email || ''}
        onMarkAsReceived={handleMarkAsReceived}
      />
    </div>
  );
}